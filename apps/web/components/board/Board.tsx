import React, { useEffect, useState } from 'react';
import { ApplicationStatus, Application } from '@shared/types';
import { Column } from './Column';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';

interface BoardProps {
  applications: Application[];
  onItemClick?: (application: Application) => void;
  onDelete?: (application: Application) => void;
}

export function Board({ applications, onItemClick, onDelete }: BoardProps) {
  // State to keep track of applications locally
  const [localApplications, setLocalApplications] = useState<Application[]>(applications);

  // Update local applications when the prop changes
  useEffect(() => {
    setLocalApplications(applications);
  }, [applications]);

  // Group applications by status
  const columns = Object.values(ApplicationStatus).map((status) => ({
    status,
    items: localApplications.filter((app) => app.status === status),
  }));

  // Update application status via API
  const updateApplicationStatus = async (appId: string, newStatus: ApplicationStatus) => {
    if (!appId) return;

    try {
      // Find the full application to ensure we have all required fields
      const application = localApplications.find((app) => String(app.id) === appId);
      if (!application) return;

      const response = await fetch(`/api/application`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id: appId,
          status: newStatus,
          // Include other required fields to avoid overwriting them with null
          company_name: application.company_name,
          position: application.position,
          url: application.url,
          priority_level: application.priority_level,
          notes: application.notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update application status:', errorData);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  // Handle drag end event
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // If dropped outside a droppable area or in the same position
    if (
      !destination ||
      (source.droppableId === destination.droppableId && source.index === destination.index)
    ) {
      return;
    }

    // Find the application that was dragged
    // draggableId might be a string representation of a number or a temp id
    const application = localApplications.find(
      (app) =>
        String(app.id) === draggableId ||
        (draggableId.startsWith('temp-') && `temp-${app.company_name}` === draggableId)
    );

    if (!application) return;

    // Create a new status based on the destination column
    const newStatus = destination.droppableId as ApplicationStatus;

    // Update local state immediately for better UX
    const updatedApplications = localApplications.map((app) =>
      app.id === application.id ? { ...app, status: newStatus } : app
    );

    setLocalApplications(updatedApplications);

    // Send update to the server
    updateApplicationStatus(String(application.id), newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col md:flex-row gap-8 w-full md:overflow-x-auto pb-6">
        {columns.map((col) => (
          <Column
            key={col.status}
            status={col.status}
            items={col.items}
            itemCount={col.items.length}
            {...(onItemClick ? { onItemClick } : {})}
            {...(onDelete ? { onDelete } : {})}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
