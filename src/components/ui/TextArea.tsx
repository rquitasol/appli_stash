import React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  className?: string;
}

export function TextArea({ label, className = "", ...props }: TextAreaProps) {
  return (
    <div className="mb-4 border-[#8B5CF6] text-[#8B5CF6]">
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300 ${className}`}
        {...props}
      />
    </div>
  );
}
