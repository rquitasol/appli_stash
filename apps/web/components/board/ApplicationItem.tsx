import React from "react";
import type { Application } from "@shared/types";

interface ApplicationItemProps {
  application: Application;
  onClick?: ((application: Application) => void) | undefined;
}

export function ApplicationItem({ application, onClick }: ApplicationItemProps) {
  // Function to get company logo or display first letter in a circle
  const getCompanyDisplay = () => {
    // For this example, we'll use the first letter of company name
    const firstLetter = application.company_name.charAt(0).toUpperCase();
    
    return (
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
        style={{ backgroundColor: '#E0E0E0' }}
      >
        {firstLetter}
      </div>
    );
  };
  
  // Determine border color based on application status
  const getBorderColor = () => {
    const statusColors: Record<string, string> = {
      'Saved': '#7C3AED', // purple for Saved
      'Applied': '#FACC15', // yellow for Applied
      'Interview': '#8B5CF6', // violet for Interview
      'Offer': '#10B981', // green for Offer
      'Rejected': '#EF4444', // red for Rejected
    };

    return statusColors[application.status] || '#7C3AED';
  };
  
  return (
    <div
      className="bg-white rounded-lg p-3 border border-gray-200 cursor-pointer transition-all duration-200"
      style={{ 
        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
        borderLeftWidth: '4px',
        borderLeftColor: getBorderColor()
      }}
      onClick={() => onClick && onClick(application)}
      tabIndex={0}
      role="button"
      aria-label={`Edit application for ${application.company_name}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0px 2px 6px rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.transform = 'translateY(0px)';
      }}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          {getCompanyDisplay()}
          <div className="flex-1 ml-1">
            <div className="text-secondary text-lg font-semibold">{application.position}</div>
            <div className="text-gray-500 text-base">{application.company_name}</div>
          </div>
          <div className="text-secondary text-sm whitespace-nowrap">
            1mo
          </div>
        </div>
      </div>
    </div>
  );
}
