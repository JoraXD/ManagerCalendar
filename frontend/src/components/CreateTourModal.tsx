import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { X, Calendar, MapPin, Users, Clock, DollarSign } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { createTour, CreateTourData, Client } from '../services/api';
import './CreateTourModal.css';

interface CreateTourModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Client[];
}

const CreateTourModal: React.FC<CreateTourModalProps> = ({
  open,
  onOpenChange,
  clients
}) => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateTourData>();

  const createTourMutation = useMutation(createTour, {
    onSuccess: () => {
      queryClient.invalidateQueries('tours');
      reset();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error creating tour:', error);
    }
  });

  const onSubmit = (data: CreateTourData) => {
    createTourMutation.mutate({
      ...data,
      price: Number(data.price),
      group_size: Number(data.group_size),
      duration: Number(data.duration),
      client_id: Number(data.client_id)
    });
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{t('create_tour')}</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="close-button"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="tour-form">
          <div className="form-group">
            <label htmlFor="name">{t('tour_name')}</label>
            <input
              id="name"
              {...register('name', { required: 'Tour name is required' })}
              placeholder={t('tour_name')}
            />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">{t('description')}</label>
            <textarea
              id="description"
              {...register('description')}
              placeholder={t('description')}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">{t('date')} & {t('time')}</label>
              <div className="input-with-icon">
                <Calendar size={16} />
                <input
                  id="date"
                  type="datetime-local"
                  {...register('date', { required: 'Date is required' })}
                />
              </div>
              {errors.date && <span className="error">{errors.date.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="duration">{t('duration')}</label>
              <div className="input-with-icon">
                <Clock size={16} />
                <input
                  id="duration"
                  type="number"
                  step="0.5"
                  min="0.5"
                  {...register('duration', { required: 'Duration is required' })}
                  placeholder="2.5"
                />
              </div>
              {errors.duration && <span className="error">{errors.duration.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="venue">{t('venue')}</label>
            <div className="input-with-icon">
              <MapPin size={16} />
              <input
                id="venue"
                {...register('venue', { required: 'Venue is required' })}
                placeholder={t('venue')}
              />
            </div>
            {errors.venue && <span className="error">{errors.venue.message}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="group_size">{t('group_size')}</label>
              <div className="input-with-icon">
                <Users size={16} />
                <input
                  id="group_size"
                  type="number"
                  min="1"
                  {...register('group_size', { required: 'Group size is required' })}
                  placeholder="10"
                />
              </div>
              {errors.group_size && <span className="error">{errors.group_size.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="price">{t('price')}</label>
              <div className="input-with-icon">
                <DollarSign size={16} />
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price', { required: 'Price is required' })}
                  placeholder="150.00"
                />
              </div>
              {errors.price && <span className="error">{errors.price.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="client_id">{t('client')}</label>
            <select
              id="client_id"
              {...register('client_id', { required: 'Client selection is required' })}
            >
              <option value="">{t('client')}</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.client_id && <span className="error">{errors.client_id.message}</span>}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="cancel-button"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={createTourMutation.isLoading}
              className="submit-button"
            >
              {createTourMutation.isLoading ? t('create') + '...' : t('create_tour')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTourModal;