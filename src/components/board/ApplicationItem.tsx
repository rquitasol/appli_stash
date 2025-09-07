import React from "react";
import type { Application } from "../../types/Application";

interface ApplicationItemProps {
  application: Application;
  onClick?: (application: Application) => void;
}

export function ApplicationItem({ application, onClick }: ApplicationItemProps) {
  return (
    <div
      className="bg-white rounded shadow p-3 border border-[#8B5CF6] cursor-pointer hover:bg-violet-50 transition"
      onClick={() => onClick && onClick(application)}
      tabIndex={0}
      role="button"
      aria-label={`Edit application for ${application.company_name}`}
    >
  <div className="font-semibold text-[#581C87]">{application.company_name}</div>
  <div className="text-sm text-gray-700">{application.position}</div>
      <div className="text-xs text-gray-400">{application.url}</div>
    </div>
  );
}
