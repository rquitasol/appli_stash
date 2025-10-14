import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`}
    />
  );
}

interface FormLoadingProps {
  message?: string;
}

export function FormLoading({ message = 'Loading...' }: FormLoadingProps) {
  return (
    <div className="flex items-center justify-center py-8">
      <LoadingSpinner className="mr-2" />
      <span className="text-gray-600">{message}</span>
    </div>
  );
}
