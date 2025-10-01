import React, { useState, useMemo } from 'react';
import { Interview } from '../board/InterviewItem';

interface CalendarViewProps {
  interviews: Interview[];
  onInterviewClick: (interview: Interview) => void;
}

export function CalendarView({ interviews, onInterviewClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Memoize calendar date calculations
  const calendarDates = useMemo(() => {
    // Get the first day of the current month
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Get the last day of the current month
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Get the first day of the week for the calendar grid
    const firstDayOfCalendar = new Date(firstDayOfMonth);
    firstDayOfCalendar.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

    // Get the last day of the week for the calendar grid
    const lastDayOfCalendar = new Date(lastDayOfMonth);
    lastDayOfCalendar.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));

    return { firstDayOfCalendar, lastDayOfCalendar };
  }, [currentDate]);

  // Generate all days for the calendar grid
  const calendarDays = useMemo(() => {
    const days = [];
    const current = new Date(calendarDates.firstDayOfCalendar);

    while (current <= calendarDates.lastDayOfCalendar) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [calendarDates]);

  // Group interviews by date
  const interviewsByDate = useMemo(() => {
    const grouped: Record<string, Interview[]> = {};

    interviews.forEach((interview) => {
      const date = new Date(interview.schedule);
      const dateKey = date.toDateString();

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(interview);
    });

    // Sort interviews within each day by time
    Object.keys(grouped).forEach((dateKey) => {
      grouped[dateKey].sort(
        (a, b) => new Date(a.schedule).getTime() - new Date(b.schedule).getTime()
      );
    });

    return grouped;
  }, [interviews]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      Scheduled: '#3B82F6',
      Completed: '#10B981',
      Cancelled: '#EF4444',
      Rescheduled: '#F59E0B',
      'No Show': '#6B7280',
    };
    return statusColors[status] || '#3B82F6';
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthYear = currentDate.toLocaleDateString([], { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Calendar Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{monthYear}</h2>

          <div className="flex items-center space-x-2">
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Today
            </button>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Previous month"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Next month"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-px mb-2">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          {calendarDays.map((day) => {
            const dayInterviews = interviewsByDate[day.toDateString()] || [];

            return (
              <div
                key={day.toISOString()}
                className={`bg-white p-2 min-h-[120px] ${isCurrentMonth(day) ? '' : 'bg-gray-50'}`}
              >
                {/* Date number */}
                <div className="flex justify-between items-start mb-1">
                  <span
                    className={`text-sm font-medium ${
                      isToday(day)
                        ? 'bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs'
                        : isCurrentMonth(day)
                          ? 'text-gray-900'
                          : 'text-gray-400'
                    }`}
                  >
                    {day.getDate()}
                  </span>

                  {dayInterviews.length > 0 && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded">
                      {dayInterviews.length}
                    </span>
                  )}
                </div>

                {/* Interviews for this day */}
                <div className="space-y-1">
                  {dayInterviews.slice(0, 2).map((interview) => (
                    <div
                      key={interview.id}
                      onClick={() => onInterviewClick(interview)}
                      className="cursor-pointer group"
                    >
                      <div
                        className="text-xs p-1 rounded text-white truncate group-hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: getStatusColor(interview.status) }}
                        title={`${formatTime(interview.schedule)} - ${interview.company_name} (${interview.interviewer})`}
                      >
                        <div className="font-medium truncate">{formatTime(interview.schedule)}</div>
                        <div className="truncate opacity-90">{interview.company_name}</div>
                      </div>
                    </div>
                  ))}

                  {dayInterviews.length > 2 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      +{dayInterviews.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
