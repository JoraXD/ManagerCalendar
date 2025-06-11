import React from 'react';
import { Calendar, Plus, Users, BarChart3, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import './Sidebar.css';

interface SidebarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  viewMode: 'month' | 'week' | 'day';
  onViewModeChange: (mode: 'month' | 'week' | 'day') => void;
  statusFilters: {
    confirmed: boolean;
    pending: boolean;
    'guide-needed': boolean;
  };
  onStatusFiltersChange: (filters: any) => void;
  stats: {
    totalTours: number;
    confirmedTours: number;
    pendingTours: number;
  };
  onCreateTour: () => void;
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
      <div className="sidebar-header">
        <h1>Tour Guide Manager</h1>
      </div>

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
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => onDateChange(new Date(e.target.value))}
          className="date-picker"
        />
      </div>

      <div className="sidebar-section">
        <h3>{t('view_mode')}</h3>
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