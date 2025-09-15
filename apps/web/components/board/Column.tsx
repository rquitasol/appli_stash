import React from "react";
import { Application, ApplicationStatus } from "@shared/types";
import { ApplicationItem } from "./ApplicationItem";

interface ColumnProps {
  status: ApplicationStatus;
  items: Application[];
  onItemClick?: (application: Application) => void;
}

export function Column({ status, items, onItemClick }: ColumnProps) {
  return (
    <div className="bg-gray-100 rounded-lg shadow p-4 min-w-[250px] flex-1">
      <h3 className="text-lg font-bold mb-4 text-[#581C87]">{status}</h3>
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-gray-400 text-sm">No applications</div>
        ) : (
          items.map((app) => (
            <ApplicationItem key={app.id || app.company_name} application={app} onClick={onItemClick} />
          ))
        )}
      </div>
    </div>
  );
}
