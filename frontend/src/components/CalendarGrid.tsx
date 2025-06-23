// CalendarGrid.tsx
// Отображает сетку календаря с турами и обработчиками кликов.
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from 'date-fns';
import { Tour } from '../services/api';
import './CalendarGrid.css';

// Свойства компонента календаря
interface CalendarGridProps {
  // Выбранная дата, вокруг которой строится календарь
  selectedDate: Date;
  // Список туров для отображения
  tours: Tour[];
  // Обработчик клика по туру
  onTourClick: (tour: Tour) => void;
  // Обработчик клика по дню календаря
  onDateClick: (date: Date) => void;
  // Режим отображения (месяц/неделя/день)
  viewMode: 'month' | 'week' | 'day';
  // Флаг загрузки данных
  isLoading: boolean;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  selectedDate,
  tours,
  onTourClick,
  onDateClick,
  viewMode,
  isLoading
}) => {
  // Возвращает массив всех дней текущего месяца
  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  };

  // Фильтрует туры по указанной дате
  const getToursForDate = (date: Date) => {
    return tours.filter(tour =>
      isSameDay(new Date(tour.date), date)
    );
  };

  // Определяем CSS-классы для отображения статуса тура
  const getTourStatusColor = (tour: Tour) => {
    switch (tour.status) {
      case 'confirmed':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'pending':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'guide-needed':
        return 'bg-red-100 border-red-500 text-red-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  // Показываем спиннер загрузки, пока данные туров еще не получены
  if (isLoading) {
    return (
      <div className="calendar-grid loading">
        <div className="loading-spinner">Loading tours...</div>
      </div>
    );
  }

  // Список дней текущего месяца
  const days = getDaysInMonth(selectedDate);

  return (
    <div className="calendar-grid">
      {/* Заголовок с названием месяца */}
      <div className="calendar-header">
        <h2>{format(selectedDate, 'MMMM yyyy')}</h2>
      </div>
      
      {/* Заголовок дней недели */}
      <div className="calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      {/* Сетка дней месяца */}
      <div className="calendar-days">
        {days.map(day => {
          const dayTours = getToursForDate(day);
          const isCurrentDay = isToday(day);
          const isCurrentMonth = isSameMonth(day, selectedDate);

          return (
            <div
              key={day.toISOString()}
              className={`calendar-day ${isCurrentDay ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''}`}
              onClick={() => onDateClick(day)}
            >
              {/* Номер дня */}
              <div className="day-number">
                {format(day, 'd')}
              </div>

              {/* Список туров в этот день */}
              <div className="day-tours">
                {dayTours.map(tour => (
                  <div
                    key={tour.id}
                    className={`tour-item ${getTourStatusColor(tour)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTourClick(tour);
                    }}
                  >
                    {/* Время начала тура */}
                    <div className="tour-time">
                      {format(new Date(tour.date), 'HH:mm')}
                    </div>
                    {/* Название тура */}
                    <div className="tour-name">{tour.name}</div>
                    {/* Место проведения */}
                    <div className="tour-venue">{tour.venue}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;