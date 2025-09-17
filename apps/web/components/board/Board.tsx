import React from "react";
import { ApplicationStatus, Application } from "@shared/types";
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
    <div className="flex flex-col md:flex-row gap-8 w-full md:overflow-x-auto pb-6">
      {columns.map((col) => (
        <Column
          key={col.status}
          status={col.status}
          items={col.items}
          itemCount={col.items.length}
          {...(onItemClick ? { onItemClick } : {})}
        />
      ))}
    </div>
  );
}
