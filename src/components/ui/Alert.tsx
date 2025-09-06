import type { ReactNode } from 'react';

export function Alert({ children }: { children: ReactNode }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-2" role="alert">
      {children}
    </div>
  );
}

export function AlertDescription({ children }: { children: ReactNode }) {
  return <span className="block">{children}</span>;
}

export default Alert;
