import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`w-full py-2 px-4 text-white font-semibold rounded transition-colors font-[Futura] ${className}`}
      style={{ fontFamily: 'Futura, Arial, sans-serif' }}
      {...props}
    >
      {children}
    </button>
  );
}
