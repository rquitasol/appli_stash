import React from "react";
import { Application, ApplicationStatus } from "@shared/types";
import { ApplicationItem } from "./ApplicationItem";
import { Droppable } from "@hello-pangea/dnd";

interface ColumnProps {
  status: ApplicationStatus;
  items: Application[];
  itemCount?: number;
  onItemClick?: (application: Application) => void;
}

export function Column({ status, items, itemCount = 0, onItemClick }: ColumnProps) {
  // Map status to appropriate icons
  const getStatusIcon = () => {
    switch (status) {
      case ApplicationStatus.Saved:
        return <span className="text-secondary">✩</span>;
      case ApplicationStatus.Applied:
        return <span className="text-secondary">📄</span>;
      case ApplicationStatus.Interview:
        return <span className="text-secondary">💼</span>;
      case ApplicationStatus.Offer:
        return <span className="text-green-500">✓</span>;
      case ApplicationStatus.Rejected:
        return <span className="text-red-500">✕</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 md:mb-0 md:min-w-[300px] w-full md:flex-1 border border-gray-200 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="text-lg">{getStatusIcon()}</div>
          <h3 className="text-lg font-bold uppercase text-primary">{status}</h3>
        </div>
        <span className="text-secondary text-sm">{itemCount} JOBS</span>
      </div>
      
      {/* Add button for adding new applications */}
      <div className="flex justify-center mb-5">
        <button 
          className="w-full border border-secondary rounded-lg py-3 flex justify-center items-center text-secondary hover:bg-gray-50 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Store the status in localStorage to be picked up by the form
            localStorage.setItem('newApplicationStatus', status);
            // Trigger the same add application modal that's used elsewhere
            const addButton = document.querySelector('button[data-add-application]');
            if (addButton instanceof HTMLElement) {
              addButton.click();
            }
          }}
        >
          <span className="text-2xl">+</span>
        </button>
      </div>
      
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-5 min-h-[100px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-gray-50 rounded-lg p-2' : ''
            }`}
          >
            {items.length === 0 ? (
              <div className="text-secondary text-sm text-center mt-4">No applications</div>
            ) : (
              items.map((app, index) => (
                <ApplicationItem 
                  key={app.id || app.company_name} 
                  application={app} 
                  onClick={onItemClick}
                  index={index}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
