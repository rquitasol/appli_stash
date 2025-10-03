import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function Dialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
}: DialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Prevent body scroll when dialog is open
    if (isOpen && mounted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, mounted]);

  if (!isOpen || !mounted) return null;

  const variantStyles = {
    danger: {
      icon: '⚠️',
      confirmButton: 'bg-red-600 hover:bg-red-700 border-red-600',
      titleColor: 'text-red-600',
    },
    warning: {
      icon: '⚠️',
      confirmButton: 'bg-yellow-600 hover:bg-yellow-700 border-yellow-600',
      titleColor: 'text-yellow-600',
    },
    info: {
      icon: 'ℹ️',
      confirmButton: 'bg-blue-600 hover:bg-blue-700 border-blue-600',
      titleColor: 'text-blue-600',
    },
  };

  const styles = variantStyles[variant];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const dialogContent = (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fadeIn"
      style={{
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 animate-slideIn"
        style={{
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          zIndex: 10000,
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-6 pb-4 border-b border-gray-100">
          <div className="text-3xl">{styles.icon}</div>
          <h2 className={`text-xl font-semibold ${styles.titleColor}`}>{title}</h2>
        </div>

        {/* Message */}
        <div className="px-6 py-6">
          <p className="text-gray-700 leading-relaxed text-base">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0 justify-end bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-6 py-1 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium min-w-[80px]"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-6 py-1 rounded-lg text-white transition-colors font-medium min-w-[80px] ${styles.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  // Use React Portal to render the dialog at the document body level
  if (typeof window !== 'undefined' && document.body) {
    return createPortal(dialogContent, document.body);
  }

  // Fallback to normal rendering if portal fails
  return dialogContent;
}
