import React, { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  // Handle Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      
      // Focus the modal container
      if (modalRef.current) {
        modalRef.current.focus();
      }
      
      // Prevent scrolling on the body
      document.body.style.overflow = "hidden";
    } else {
      // Restore scrolling
      document.body.style.overflow = "";
      
      // Restore focus
      if (previousActiveElement.current && "focus" in previousActiveElement.current) {
        (previousActiveElement.current as HTMLElement).focus();
      }
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backdropFilter: 'blur(2px)'
      }}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      ref={modalRef}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-auto max-w-md mx-auto relative overflow-hidden p-0"
        style={{
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          zIndex: 10000,
          borderRadius: '8px',
          margin: '24px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="relative w-full"
          style={{ 
            backgroundColor: '#8B5CF6', 
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            padding: '10px'
          }}
        >
          {title && (
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white ml-4 ">
                {title.includes("Application") 
                  ? title.split("Application").map((part, i) => 
                      i === 0 
                        ? <>{part}<span className="font-bold">Application</span></>
                        : part
                    )
                  : title
                }
              </h2>
              <button
                className="text-white hover:text-gray-200 ml-4"
                onClick={onClose}
                aria-label="Close"
                style={{ fontSize: '24px' }}
              >
                ×
              </button>
            </div>
          )}
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
