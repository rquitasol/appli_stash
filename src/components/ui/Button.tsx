import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded bg-primary text-accent hover:bg-accent hover:text-primary border border-primary ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
