import React from "react";
import type { Application } from "@shared/types";
import { Draggable } from "@hello-pangea/dnd";

interface ApplicationItemProps {
  application: Application;
  onClick?: ((application: Application) => void) | undefined;
  index: number;
}

export function ApplicationItem({ application, onClick, index }: ApplicationItemProps) {

  
  // Determine border color based on application priority
  const getBorderColor = () => {
    const priorityColors: Record<string, string> = {
      'Low': '#F59E0B', // amber for Low priority
      'Medium': '#10B981', // emerald green for Medium priority
      'High': '#EF4444', // red for High priority
    };

    return priorityColors[application.priority_level] || '#F59E0B';
  };

  // Function to get company logo or display first letter in a circle
  const getCompanyDisplay = () => {
    // For this example, we'll use the first letter of company name
    const firstLetter = application.company_name.charAt(0).toUpperCase();
    
    return (
      <div 
        className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm"
        style={{ backgroundColor: getBorderColor() }}
      >
        {firstLetter}
      </div>
    );
  };
  
  return (
    <Draggable 
      draggableId={application.id ? String(application.id) : `temp-${application.company_name}`} 
      index={index}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg p-3 border border-gray-200 cursor-pointer transition-all duration-200 ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-primary ring-opacity-50' : ''
          }`}
          style={{ 
            ...provided.draggableProps.style,
            boxShadow: snapshot.isDragging 
              ? '0px 8px 16px rgba(0, 0, 0, 0.1)' 
              : '0px 2px 6px rgba(0, 0, 0, 0.05)',
            borderLeftWidth: '4px',
            borderLeftColor: getBorderColor()
          }}
          onClick={(e) => {
            if (!snapshot.isDragging && onClick) {
              e.stopPropagation();
              onClick(application);
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Edit application for ${application.company_name}`}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              {getCompanyDisplay()}
              <div className="flex-1 ml-1">
                <div className="text-secondary text-base font-semibold">{application.position}</div>
                <div className="text-gray-500 text-sm">{application.company_name}</div>
              </div>
              <div className="text-secondary text-sm whitespace-nowrap">
                1mo
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
