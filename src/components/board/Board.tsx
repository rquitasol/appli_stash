import React from "react";
import { ApplicationStatus } from "../../types/ApplicationStatus";
import type { Application } from "../../types/Application";
import { Column } from "./Column";

interface BoardProps {
  applications: Application[];
  onItemClick?: (application: Application) => void;
}

export function Board({ applications, onItemClick }: BoardProps) {
  // Group applications by status
  const columns = Object.values(ApplicationStatus).map((status) => ({
    status,
    items: applications.filter((app) => app.status === status),
  }));

  return (
    <div className="flex gap-4 w-full overflow-x-auto">
      {columns.map((col) => (
        <Column
          key={col.status}
          status={col.status}
          items={col.items}
          {...(onItemClick ? { onItemClick } : {})}
        />
      ))}
    </div>
  );
}
