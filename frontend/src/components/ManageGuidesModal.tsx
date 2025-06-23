import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { X, Mail, Phone, MessageCircle, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { createGuide, CreateGuideData, fetchGuides, Guide } from '../services/api';
import './ManageGuidesModal.css';

// Свойства модального окна управления гидами
interface ManageGuidesModalProps {
  // Признак открытия окна
  open: boolean;
  // Колбэк для изменения состояния
  onOpenChange: (open: boolean) => void;
}

const ManageGuidesModal: React.FC<ManageGuidesModalProps> = ({
  open,
  onOpenChange
}) => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  // Форма для добавления нового гида
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateGuideData>();

  // Загружаем список гидов
  const { data: guides = [], isLoading } = useQuery('guides', fetchGuides);

  // Мутация для добавления гида
  const createGuideMutation = useMutation(createGuide, {
    onSuccess: () => {
      queryClient.invalidateQueries('guides');
      reset();
    },
    onError: (error) => {
      console.error('Error creating guide:', error);
    }
  });

  // Отправка формы добавления гида
  const onSubmit = (data: CreateGuideData) => {
    createGuideMutation.mutate(data);
  };

  // Если окно закрыто, ничего не отображаем
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        {/* Заголовок модального окна */}
        <div className="modal-header">
          <h2>Manage Guides</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="close-button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="guides-section">
            <h3>Current Guides</h3>
            {isLoading ? (
              <div className="loading">Loading guides...</div>
            ) : (
              <div className="guides-list">
                {guides.length === 0 ? (
                  <p className="no-guides">No guides found. Add your first guide below.</p>
                ) : (
                  guides.map((guide: Guide) => (
                    <div key={guide.id} className="guide-item">
                      {/* Информация о гиде */}
                      <div className="guide-info">
                        <h4>{guide.name}</h4>
                        <div className="guide-details">
                          <span><Mail size={14} /> {guide.email}</span>
                          {guide.phone && <span><Phone size={14} /> {guide.phone}</span>}
                          {guide.tg_alias && <span><MessageCircle size={14} /> @{guide.tg_alias}</span>}
                        </div>
                      </div>
                      {/* Статистика по гиду */}
                      <div className="guide-stats">
                        <span className="tours-count">{guide.total_tours} tours</span>
                        <span className="earnings">${guide.total_earnings}</span>
                        <span className={`status ${guide.is_active ? 'active' : 'inactive'}`}>
                          {guide.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="add-guide-section">
            <h3>Add New Guide</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="guide-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-with-icon">
                    <User size={16} />
                    <input
                      id="name"
                      {...register('name', { required: 'Name is required' })}
                      placeholder="Guide's full name"
                    />
                  </div>
                  {errors.name && <span className="error">{errors.name.message}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <div className="input-with-icon">
                    <Mail size={16} />
                    <input
                      id="email"
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      placeholder="guide@example.com"
                    />
                  </div>
                  {errors.email && <span className="error">{errors.email.message}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone (optional)</label>
                  <div className="input-with-icon">
                    <Phone size={16} />
                    <input
                      id="phone"
                      {...register('phone')}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="tg_alias">Telegram Username (optional)</label>
                  <div className="input-with-icon">
                    <MessageCircle size={16} />
                    <input
                      id="tg_alias"
                      {...register('tg_alias')}
                      placeholder="telegram_username"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact_info">Additional Contact Info (optional)</label>
                <textarea
                  id="contact_info"
                  {...register('contact_info')}
                  placeholder="Any additional contact information or notes"
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={createGuideMutation.isLoading}
                  className="submit-button"
                >
                  {createGuideMutation.isLoading ? 'Adding...' : 'Add Guide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageGuidesModal;