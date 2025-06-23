// Sidebar.tsx
// Боковая панель со статистикой, фильтрами и действиями.
import React from 'react';
import { Calendar, Plus, Users, BarChart3, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import './Sidebar.css';

interface SidebarProps {
  // Текущая выбранная дата
  selectedDate: Date;
  // Срабатывает при выборе другой даты
  onDateChange: (date: Date) => void;
  // Режим отображения календаря
  viewMode: 'month' | 'week' | 'day';
  // Изменение режима отображения
  onViewModeChange: (mode: 'month' | 'week' | 'day') => void;
  // Фильтр по статусу туров
  statusFilters: {
    confirmed: boolean;
    pending: boolean;
    'guide-needed': boolean;
  };
  // Обработчик изменения фильтров
  onStatusFiltersChange: (filters: any) => void;
  // Статистические данные
  stats: {
    totalTours: number;
    confirmedTours: number;
    pendingTours: number;
  };
  // Открыть модальное окно создания тура
  onCreateTour: () => void;
  // Открыть окно управления гидами
  onManageGuides: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedDate,
  onDateChange,
  viewMode,
  onViewModeChange,
  statusFilters,
  onStatusFiltersChange,
  stats,
  onCreateTour,
  onManageGuides
}) => {
  const { t } = useLanguage();
  return (
    <div className="sidebar">
      {/* Логотип/заголовок */}
      <div className="sidebar-header">
        <h1>Tour Guide Manager</h1>
      </div>

      {/* Кнопки действий */}
      <div className="sidebar-actions">
        <button onClick={onCreateTour} className="create-tour-btn">
          <Plus size={16} />
          {t('create_tour')}
        </button>

        <button onClick={onManageGuides} className="manage-guides-btn">
          <Users size={16} />
          {t('manage_guides')}
        </button>
      </div>

      <div className="sidebar-section">
        <h3><Calendar size={16} /> {t('calendar')}</h3>
        {/* Выбор даты */}
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => onDateChange(new Date(e.target.value))}
          className="date-picker"
        />
      </div>

      <div className="sidebar-section">
        <h3>{t('view_mode')}</h3>
        {/* Переключатели режима отображения календаря */}
        <div className="view-modes">
          {(['month', 'week', 'day'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`view-mode-btn ${viewMode === mode ? 'active' : ''}`}
            >
              {t(mode)}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3><Filter size={16} /> {t('filters')}</h3>
        {/* Фильтры по статусу туров */}
        <div className="status-filters">
          {Object.entries(statusFilters).map(([status, enabled]) => (
            <label key={status} className="filter-checkbox">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => onStatusFiltersChange({
                  ...statusFilters,
                  [status]: e.target.checked
                })}
              />
              <span className={`status-indicator ${status}`}></span>
              {t(`show_${status.replace('-', '_')}`)}
            </label>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3><BarChart3 size={16} /> {t('statistics')}</h3>
        {/* Небольшая статистика по турам */}
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">{t('total_tours_count')}</span>
            <span className="stat-value">{stats.totalTours}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('confirmed_tours')}</span>
            <span className="stat-value confirmed">{stats.confirmedTours}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('pending_tours')}</span>
            <span className="stat-value pending">{stats.pendingTours}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;