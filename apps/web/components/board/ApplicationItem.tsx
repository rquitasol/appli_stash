import React, { useState } from 'react';
import type { Application } from '@shared/types';
import { Draggable } from '@hello-pangea/dnd';
import { Dialog } from '@shared/components/ui/Dialog';

interface ApplicationItemProps {
  application: Application;
  onClick?: ((application: Application) => void) | undefined;
  onDelete?: ((application: Application) => void) | undefined;
  index: number;
}

export function ApplicationItem({ application, onClick, onDelete, index }: ApplicationItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Handle delete button click
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick
    setShowDeleteDialog(true);
  };

  // Handle confirmed delete
  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(application);
    }
  };

  // Determine border color based on application priority
  const getBorderColor = () => {
    const priorityColors: Record<string, string> = {
      Low: '#F59E0B', // amber for Low priority
      Medium: '#10B981', // emerald green for Medium priority
      High: '#EF4444', // red for High priority
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
    <>
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
              borderLeftColor: getBorderColor(),
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
            <div className="flex flex-col relative">
              <div className="flex items-center gap-2 mb-1">
                {getCompanyDisplay()}
                <div className="flex-1 ml-1">
                  <div className="text-secondary text-base font-semibold">
                    {application.position}
                  </div>
                  <div className="text-gray-500 text-sm">{application.company_name}</div>
                </div>

                {/* Delete button */}
                {onDelete && (
                  <button
                    onClick={handleDeleteClick}
                    className="w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200 z-10"
                    aria-label={`Delete application for ${application.company_name}`}
                    title="Delete application"
                  >
                    ×
                  </button>
                )}

                <div></div>
              </div>
            </div>
          </div>
        )}
      </Draggable>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Application"
        message={`Are you sure you want to delete the application for ${application.position} at ${application.company_name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
