'use client';
import React, { useEffect, ReactNode } from 'react';
import { useUser } from '../context/UserContext';
import Header from './Header';
import Footer from './Footer';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login';
    }
  }, [user, loading]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header - 10% */}
      <div className="flex-shrink-0 h-[5vh] w-full">
        <Header />
      </div>

      {/* Main Content Area with Sidebar - 85% */}
      <div className="flex flex-1 h-[92.5vh]">
        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      {/* Footer - 5% */}
      <div className="flex-shrink-0 h-[2.5vh] w-full text-sm">
        <Footer />
      </div>
    </div>
  );
}
