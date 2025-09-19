import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  className?: string;
  children: React.ReactNode;
}

export function Select({ label, className = "", children, value, ...props }: SelectProps) {
  // Convert null value to empty string or undefined
  const safeValue = value === null ? "" : value;
  
  return (
    <div className="mb-4 border-[#8B5CF6] text-[#8B5CF6]">
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        className={`mt-1 block w-full px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300 ${className}`}
        value={safeValue}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
