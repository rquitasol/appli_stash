import React from "react";

export interface Contact {
  id?: string;
  user_id?: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  company: string;
  url: string;
  notes: string;
}

interface ContactItemProps {
  contact: Contact;
  onClick?: (contact: Contact) => void;
}

export function ContactItem({ contact, onClick }: ContactItemProps) {
  // Function to get contact initials or display first letter in a circle
  const getContactDisplay = () => {
    const initials = contact.name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return (
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
        style={{ backgroundColor: '#6366F1' }} // Indigo color for contacts
      >
        {initials}
      </div>
    );
  };

  // Function to format URL for display
  const formatUrl = (url: string) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div
      className="bg-white rounded-lg p-4 border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-gray-300"
      onClick={() => onClick?.(contact)}
      tabIndex={0}
      role="button"
      aria-label={`View contact details for ${contact.name}`}
    >
      <div className="flex items-start gap-3">
        {getContactDisplay()}
        
        <div className="flex-1 min-w-0">
          {/* Name and Title */}
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {contact.name}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {contact.title}
            </p>
          </div>
          
          {/* Company */}
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-700">
              {contact.company}
            </p>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-600 truncate">
                {contact.email}
              </span>
            </div>
            
            {contact.phone && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm text-gray-600">
                  {contact.phone}
                </span>
              </div>
            )}
            
            {contact.url && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-sm text-blue-600 truncate">
                  {formatUrl(contact.url)}
                </span>
              </div>
            )}
          </div>
          
          {/* Notes Preview */}
          {contact.notes && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-500 line-clamp-2">
                {contact.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}