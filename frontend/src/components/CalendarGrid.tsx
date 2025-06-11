import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from 'date-fns';
import { Tour } from '../services/api';
import './CalendarGrid.css';

interface CalendarGridProps {
  selectedDate: Date;
  tours: Tour[];
  onTourClick: (tour: Tour) => void;
  onDateClick: (date: Date) => void;
  viewMode: 'month' | 'week' | 'day';
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
  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  };

  const getToursForDate = (date: Date) => {
    return tours.filter(tour => 
      isSameDay(new Date(tour.date), date)
    );
  };

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

  if (isLoading) {
    return (
      <div className="calendar-grid loading">
        <div className="loading-spinner">Loading tours...</div>
      </div>
    );
  }

  const days = getDaysInMonth(selectedDate);

  return (
    <div className="calendar-grid">
      <div className="calendar-header">
        <h2>{format(selectedDate, 'MMMM yyyy')}</h2>
      </div>
      
      <div className="calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

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
              <div className="day-number">
                {format(day, 'd')}
              </div>
              
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
                    <div className="tour-time">
                      {format(new Date(tour.date), 'HH:mm')}
                    </div>
                    <div className="tour-name">{tour.name}</div>
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