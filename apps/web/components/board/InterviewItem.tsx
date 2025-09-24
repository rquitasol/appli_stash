import React from "react";

export interface Interview {
  id?: string;
  user_id?: string;
  application_id?: number;
  type: string;
  schedule: string; // timestamp
  interviewer: string;
  status: string;
  notes: string;
  // Additional fields for display
  company_name?: string;
  position?: string;
}

interface InterviewItemProps {
  interview: Interview;
  onClick?: (interview: Interview) => void;
}

export function InterviewItem({ interview, onClick }: InterviewItemProps) {
  
  // Determine border color based on interview status
  const getBorderColor = () => {
    const statusColors: Record<string, string> = {
      'Scheduled': '#3B82F6', // blue for scheduled
      'Completed': '#10B981', // emerald green for completed
      'Cancelled': '#EF4444', // red for cancelled
      'Rescheduled': '#F59E0B', // amber for rescheduled
      'No Show': '#6B7280', // gray for no show
    };

    return statusColors[interview.status] || '#3B82F6';
  };

  // Function to get interview type icon
  const getTypeIcon = () => {
    const typeIcons: Record<string, JSX.Element> = {
      'Phone': (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      'Video': (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      'In-Person': (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      'Technical': (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    };

    return typeIcons[interview.type] || (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    );
  };

  // Format the date and time
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = date.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (diffDays === 0) {
        return `Today, ${timeString}`;
      } else if (diffDays === 1) {
        return `Tomorrow, ${timeString}`;
      } else if (diffDays === -1) {
        return `Yesterday, ${timeString}`;
      } else if (diffDays > 0 && diffDays <= 7) {
        return `${date.toLocaleDateString([], { weekday: 'long' })}, ${timeString}`;
      } else {
        return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeString}`;
      }
    } catch {
      return dateString;
    }
  };

  // Get status badge styling
  const getStatusBadge = () => {
    const statusStyles: Record<string, string> = {
      'Scheduled': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Rescheduled': 'bg-yellow-100 text-yellow-800',
      'No Show': 'bg-gray-100 text-gray-800',
    };

    return statusStyles[interview.status] || 'bg-blue-100 text-blue-800';
  };

  return (
    <div
      className="bg-white rounded-lg p-4 border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-gray-300"
      style={{ 
        borderLeftWidth: '4px',
        borderLeftColor: getBorderColor()
      }}
      onClick={() => onClick?.(interview)}
      tabIndex={0}
      role="button"
      aria-label={`Interview with ${interview.interviewer} for ${interview.company_name || 'position'}`}
    >
      <div className="flex flex-col space-y-3">
        {/* Header with company and status */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {interview.company_name && (
              <div className="text-sm text-gray-500">{interview.company_name}</div>
            )}
            {interview.position && (
              <div className="font-semibold text-gray-900">{interview.position}</div>
            )}
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge()}`}>
            {interview.status}
          </span>
        </div>

        {/* Interview details */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <div style={{ color: getBorderColor() }}>
              {getTypeIcon()}
            </div>
            <span>{interview.type}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatDateTime(interview.schedule)}</span>
          </div>
        </div>

        {/* Interviewer */}
        <div className="flex items-center space-x-1 text-sm">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-gray-600">{interview.interviewer}</span>
        </div>

        {/* Notes preview (if exists) */}
        {interview.notes && (
          <div className="text-xs text-gray-500 truncate">
            <span className="font-medium">Notes:</span> {interview.notes}
          </div>
        )}
      </div>
    </div>
  );
}