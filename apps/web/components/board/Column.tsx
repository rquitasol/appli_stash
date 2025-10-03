import React from 'react';
import { Application, ApplicationStatus } from '@shared/types';
import { ApplicationItem } from './ApplicationItem';
import { Droppable } from '@hello-pangea/dnd';

const statusColors: Record<string, string> = {
  Saved: '#7C3AED',
  Applied: '#FACC15',
  Interview: '#476EE1',
  Offer: '#10B981',
  Rejected: '#EF4444',
};

interface ColumnProps {
  status: ApplicationStatus;
  items: Application[];
  itemCount?: number;
  onItemClick?: (application: Application) => void;
  onDelete?: (application: Application) => void;
}

export function Column({ status, items, itemCount = 0, onItemClick, onDelete }: ColumnProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-4 md:mb-0 md:min-w-[300px] w-full md:flex-1 border border-gray-200 flex-shrink-0">
      <div
        className="flex items-center justify-between rounded-t-lg px-4 py-3 mb-4"
        style={{ background: statusColors[status], color: '#fff' }}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold uppercase" style={{ color: '#fff' }}>
            {status}
          </h3>
        </div>
        <span className="text-xs font-semibold" style={{ color: '#fff' }}>
          {itemCount} JOBS
        </span>
      </div>

      {/* Add button for adding new applications */}
      <div className="flex justify-center mb-5 px-4">
        <button
          className="w-full border rounded-lg py-3 flex justify-center items-center font-semibold transition-colors"
          style={{
            borderColor: statusColors[status],
            color: statusColors[status],
          }}
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
          onMouseEnter={(e) => (e.currentTarget.style.background = statusColors[status] + '22')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '')}
        >
          <span className="text-2xl">+</span>
        </button>
      </div>

      <div className="px-4">
        <Droppable droppableId={status}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`space-y-5 min-h-[100px] transition-colors`}
              style={
                snapshot.isDraggingOver
                  ? { background: statusColors[status] + '22', borderRadius: 8, padding: 8 }
                  : {}
              }
            >
              {items.length === 0 ? (
                <div className="text-secondary text-sm text-center mt-4">No applications</div>
              ) : (
                items.map((app, index) => (
                  <ApplicationItem
                    key={app.id || app.company_name}
                    application={app}
                    onClick={onItemClick}
                    onDelete={onDelete}
                    index={index}
                  />
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}
