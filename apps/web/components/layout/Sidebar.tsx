'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// SVG Components
const ApplicationIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 -960 960 960"
    fill="currentColor"
  >
    <path d="M240-80q-50 0-85-35t-35-85v-120h120v-560h600v680q0 50-35 85t-85 35zm480-80q17 0 28.5-11.5T760-200v-600H320v480h360v120q0 17 11.5 28.5T720-160M360-600v-80h360v80zm0 120v-80h360v80zM240-160h360v-80H200v40q0 17 11.5 28.5T240-160m0 0h-40 400z" />
  </svg>
);

const ContactIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 -960 960 960"
    fill="currentColor"
  >
    <path d="M185-80q-17 0-29.5-12.5T143-122v-105q0-90 56-159t144-88q-40 28-62 70.5T259-312v190q0 11 3 22t10 20zm147 0q-17 0-29.5-12.5T290-122v-190q0-70 49.5-119T459-480h189q70 0 119 49t49 119v64q0 70-49 119T648-80zm148-484q-66 0-112-46t-46-112 46-112 112-46 112 46 46 112-46 112-112 46" />
  </svg>
);

const InterviewIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 -960 960 960"
    fill="currentColor"
  >
    <path d="M640-80v-90q-56-18-94-64t-44-106h80q8 43 40.5 71.5T700-240h120q25 0 42.5 17.5T880-180v100zm120-200q-33 0-56.5-23.5T680-360t23.5-56.5T760-440t56.5 23.5T840-360t-23.5 56.5T760-280M360-400q0-150 105-255t255-105v80q-117 0-198.5 81.5T440-400zm160 0q0-83 58.5-141.5T720-600v80q-50 0-85 35t-35 85zM80-520v-100q0-25 17.5-42.5T140-680h120q45 0 77.5-28.5T378-780h80q-6 60-44 106t-94 64v90zm120-200q-33 0-56.5-23.5T120-800t23.5-56.5T200-880t56.5 23.5T280-800t-23.5 56.5T200-720" />
  </svg>
);

export function Sidebar() {
  const pathname = usePathname();
  const [isHovering, setIsHovering] = useState(false);

  // Reset hover state when navigating to a new page
  useEffect(() => {
    setIsHovering(false);
  }, [pathname]);

  const navigationItems = [
    {
      href: '/dashboard',
      label: 'Applications',
      icon: ApplicationIcon,
    },
    {
      href: '/contacts',
      label: 'Contacts',
      icon: ContactIcon,
    },
    {
      href: '/interviews',
      label: 'Interviews',
      icon: InterviewIcon,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname === href;
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`
          flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
          ${!isHovering ? 'w-16' : 'w-64'}
        `}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Navigation Items */}
        <nav className="flex-1 p-2 pt-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsHovering(false)}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all duration-200
                  ${
                    active
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                  ${!isHovering ? 'justify-center' : ''}
                `}
                title={!isHovering ? item.label : undefined}
              >
                <Icon className={`flex-shrink-0 ${!isHovering ? 'w-6 h-6' : 'w-5 h-5'}`} />
                {isHovering && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {isHovering && (
          <div className="mt-auto p-4">
            <div className="text-xs text-gray-500 text-center">AppliStash v1.0</div>
          </div>
        )}
      </div>
    </>
  );
}
