import type { ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
  type?: "success" | "error";
}
export function Alert({ children, type = "error" }: AlertProps) {
  const color =
    type === "success"
      ? "bg-green-100 border-green-400 text-green-700"
      : "bg-red-100 border-red-400 text-red-700";
  return (
    <div className={`${color} px-4 py-3 rounded relative mb-2`} role="alert">
      {children}
    </div>
  );
}

export function AlertDescription({ children }: { children: ReactNode }) {
  return <span className="block">{children}</span>;
}

export default Alert;
