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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [createTourOpen, setCreateTourOpen] = useState(false);
  const [manageGuidesOpen, setManageGuidesOpen] = useState(false);
  const [statusFilters, setStatusFilters] = useState({
    confirmed: true,
    pending: true,
    'guide-needed': true,
  });

  // const queryClient = useQueryClient();

  const { data: tours = [], isLoading: toursLoading } = useQuery(
    'tours',
    fetchTours,
    { refetchInterval: 30000 }
  );

  const { data: clients = [] } = useQuery('clients', fetchClients);
  const { data: guides = [] } = useQuery('guides', fetchGuides);

  const stats = {
    totalTours: tours.length,
    confirmedTours: tours.filter(tour => tour.status === 'confirmed').length,
    pendingTours: tours.filter(tour => tour.status === 'pending').length,
  };

  const filteredTours = tours.filter(tour => {
    return statusFilters[tour.status as keyof typeof statusFilters];
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="text-2xl font-bold text-gray-800">{t('dashboard')}</h1>
        </div>
      </div>

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

      <CreateTourModal
        open={createTourOpen}
        onOpenChange={setCreateTourOpen}
        clients={clients}
      />

      <ManageGuidesModal
        open={manageGuidesOpen}
        onOpenChange={setManageGuidesOpen}
      />
    </div>
  );
}