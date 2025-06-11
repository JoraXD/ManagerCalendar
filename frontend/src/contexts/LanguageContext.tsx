import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'dashboard': 'Dashboard',
    'tours': 'Tours',
    'guides': 'Guides',
    'clients': 'Clients',
    
    // Calendar
    'calendar': 'Calendar',
    'month': 'Month',
    'week': 'Week',
    'day': 'Day',
    'today': 'Today',
    
    // Tours
    'create_tour': 'Create Tour',
    'tour_name': 'Tour Name',
    'description': 'Description',
    'date': 'Date',
    'time': 'Time',
    'venue': 'Venue',
    'group_size': 'Group Size',
    'duration': 'Duration (hours)',
    'price': 'Price',
    'client': 'Customer',
    'status': 'Status',
    'assigned_guide': 'Assigned Guide',
    
    // Tour statuses
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'guide_needed': 'Guide Needed',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    
    // Guides
    'manage_guides': 'Manage Guides',
    'add_guide': 'Add Guide',
    'guide_name': 'Guide Name',
    'email': 'Email',
    'phone': 'Phone',
    'telegram': 'Telegram',
    'contact_info': 'Contact Information',
    'total_earnings': 'Total Earnings',
    'total_tours': 'Total Tours',
    'active': 'Active',
    'inactive': 'Inactive',
    
    // Clients
    'client_name': 'Client Name',
    'blacklisted': 'Blacklisted',
    
    // Actions
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'delete': 'Delete',
    'assign': 'Assign',
    'create': 'Create',
    'update': 'Update',
    
    // Statistics
    'statistics': 'Statistics',
    'total_tours_count': 'Total Tours',
    'confirmed_tours': 'Confirmed Tours',
    'pending_tours': 'Pending Tours',
    
    // Filters
    'filters': 'Filters',
    'show_confirmed': 'Show Confirmed',
    'show_pending': 'Show Pending',
    'show_guide_needed': 'Show Guide Needed',
    
    // View Mode
    'view_mode': 'View Mode',
  },
  ru: {
    // Navigation
    'dashboard': 'Панель управления',
    'tours': 'Туры',
    'guides': 'Гиды',
    'clients': 'Клиенты',
    
    // Calendar
    'calendar': 'Календарь',
    'month': 'Месяц',
    'week': 'Неделя',
    'day': 'День',
    'today': 'Сегодня',
    
    // Tours
    'create_tour': 'Создать тур',
    'tour_name': 'Название тура',
    'description': 'Описание',
    'date': 'Дата',
    'time': 'Время',
    'venue': 'Место проведения',
    'group_size': 'Размер группы',
    'duration': 'Продолжительность (часы)',
    'price': 'Цена',
    'client': 'Заказчик',
    'status': 'Статус',
    'assigned_guide': 'Назначенный гид',
    
    // Tour statuses
    'pending': 'В ожидании',
    'confirmed': 'Подтвержден',
    'guide_needed': 'Нужен гид',
    'completed': 'Завершен',
    'cancelled': 'Отменен',
    
    // Guides
    'manage_guides': 'Управление гидами',
    'add_guide': 'Добавить гида',
    'guide_name': 'Имя гида',
    'email': 'Email',
    'phone': 'Телефон',
    'telegram': 'Telegram',
    'contact_info': 'Контактная информация',
    'total_earnings': 'Общий доход',
    'total_tours': 'Всего туров',
    'active': 'Активный',
    'inactive': 'Неактивный',
    
    // Clients
    'client_name': 'Имя клиента',
    'blacklisted': 'В черном списке',
    
    // Actions
    'save': 'Сохранить',
    'cancel': 'Отмена',
    'edit': 'Редактировать',
    'delete': 'Удалить',
    'assign': 'Назначить',
    'create': 'Создать',
    'update': 'Обновить',
    
    // Statistics
    'statistics': 'Статистика',
    'total_tours_count': 'Всего туров',
    'confirmed_tours': 'Подтвержденные туры',
    'pending_tours': 'Туры в ожидании',
    
    // Filters
    'filters': 'Фильтры',
    'show_confirmed': 'Показать подтвержденные',
    'show_pending': 'Показать в ожидании',
    'show_guide_needed': 'Показать требующие гида',
    
    // View Mode
    'view_mode': 'Режим просмотра',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};