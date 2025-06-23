import { useState } from 'react';
import { useQuery } from 'react-query';
import CalendarGrid from '../components/CalendarGrid';
import CreateTourModal from '../components/CreateTourModal';
import ManageGuidesModal from '../components/ManageGuidesModal';
import Sidebar from '../components/Sidebar';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchTours, fetchClients, fetchGuides, type Tour } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const { t } = useLanguage();

  // Текущая выбранная дата в календаре
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Режим отображения календаря: месяц/неделя/день
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  // Выбранный тур (когда пользователь кликает по карточке)
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  // Состояния открытия модальных окон
  const [createTourOpen, setCreateTourOpen] = useState(false);
  const [manageGuidesOpen, setManageGuidesOpen] = useState(false);
  // Фильтры по статусу туров
  const [statusFilters, setStatusFilters] = useState({
    confirmed: true,
    pending: true,
    'guide-needed': true,
  });

  // const queryClient = useQueryClient();

  // Получаем данные туров с сервера и автоматически обновляем их каждые 30 секунд
  const { data: tours = [], isLoading: toursLoading } = useQuery(
    'tours',
    fetchTours,
    { refetchInterval: 30000 }
  );

  // Получаем списки клиентов и гидов
  const { data: clients = [] } = useQuery('clients', fetchClients);
  const { data: guides = [] } = useQuery('guides', fetchGuides);

  // Статистика для сайдбара
  const stats = {
    totalTours: tours.length,
    confirmedTours: tours.filter(tour => tour.status === 'confirmed').length,
    pendingTours: tours.filter(tour => tour.status === 'pending').length,
  };

  // Применяем фильтры статуса к списку туров
  const filteredTours = tours.filter(tour => {
    return statusFilters[tour.status as keyof typeof statusFilters];
  });

  return (
    <div className="dashboard">
      {/* Шапка страницы */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="text-2xl font-bold text-gray-800">{t('dashboard')}</h1>
        </div>
      </div>

      {/* Основная часть с сайдбаром и календарем */}
      <div className="dashboard-body">
        <Sidebar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          statusFilters={statusFilters}
          onStatusFiltersChange={setStatusFilters}
          stats={stats}
          onCreateTour={() => setCreateTourOpen(true)}
          onManageGuides={() => setManageGuidesOpen(true)}
        />

        {/* Содержимое календаря */}
        <main className="main-content">
          <CalendarGrid
            selectedDate={selectedDate}
            tours={filteredTours}
            onTourClick={setSelectedTour}
            onDateClick={setSelectedDate}
            viewMode={viewMode}
            isLoading={toursLoading}
          />
        </main>
      </div>

      {/* Модальное окно создания тура */}
      <CreateTourModal
        open={createTourOpen}
        onOpenChange={setCreateTourOpen}
        clients={clients}
      />

      {/* Модальное окно управления гидами */}
      <ManageGuidesModal
        open={manageGuidesOpen}
        onOpenChange={setManageGuidesOpen}
      />
    </div>
  );
}