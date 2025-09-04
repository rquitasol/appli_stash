import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`w-full py-2 px-4 font-FuturaPTMedium rounded transition-colors bg-secondary hover:bg-primary text-accent ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
 