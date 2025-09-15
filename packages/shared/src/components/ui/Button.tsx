import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`px-8 py-2 rounded bg-primary text-accent hover:bg-accent hover:text-primary border border-primary p-4 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
