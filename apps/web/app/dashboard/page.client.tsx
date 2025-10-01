'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '../../components/context/UserContext';
import { Modal } from '@shared/components/ui/Modal';
import { ApplicationForm } from '../../components/forms/ApplicationForm';
import { ContactForm } from '../../components/forms/ContactForm';
import { InterviewForm } from '../../components/forms/InterviewForm';
import { Board } from '../../components/board/Board';
import { MainLayout } from '../../components/layout/MainLayout';
import type { Application } from '@shared/types';

export default function DashboardPage() {
  const { user, loading } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [editApp, setEditApp] = useState<Application | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [appLoading, setAppLoading] = useState(true);
  const [appError, setAppError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadApplications();
  }, [user]);

  const loadApplications = (search = '') => {
    setAppLoading(true);
    setIsSearching(!!search);

    const url = search
      ? `/api/application?search=${encodeURIComponent(search)}`
      : '/api/application';

    fetch(url, {
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch applications');
        }
        return res.json();
      })
      .then((data) => {
        setApplications(data);
        setAppError('');
      })
      .catch((err) => {
        setAppError(err.message || 'Failed to fetch applications');
      })
      .finally(() => {
        setAppLoading(false);
        setIsSearching(false);
      });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadApplications(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    loadApplications();
  };

  const refreshApplications = () => {
    // Refresh with current search query
    loadApplications(searchQuery);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  if (!user) {
    return null;
  }

  return (
    <MainLayout>
      <div className="p-4 bg-white">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-[#581C87]">Applications</h1>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Box */}
            <form onSubmit={handleSearch} className="relative">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search by company or position..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <div className="flex">
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="px-4 py-2 bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                  >
                    {isSearching ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    )}
                  </button>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="px-3 py-2 bg-gray-500 text-white rounded-r-lg hover:bg-gray-600"
                      title="Clear search"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Add Application Button */}
            <button
              className="px-4 py-2 bg-primary text-accent rounded shadow hover:bg-secondary hover:text-accent border border-primary"
              onClick={() => setModalOpen(true)}
              data-add-application
            >
              Add Application
            </button>
          </div>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-4 text-sm text-gray-600">
            {appLoading ? (
              'Searching...'
            ) : (
              <>
                Showing {applications.length} result
                {applications.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
                <button
                  onClick={handleClearSearch}
                  className="ml-2 text-primary hover:text-secondary underline"
                >
                  Clear search
                </button>
              </>
            )}
          </div>
        )}

        {appLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : appError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {appError}
          </div>
        ) : (
          <Board applications={applications} onItemClick={setEditApp} />
        )}

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Application">
          <ApplicationForm
            onSuccess={() => {
              setModalOpen(false);
              refreshApplications();
            }}
          />
        </Modal>

        <Modal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          title="Add Contact"
        >
          <ContactForm
            onSuccess={() => {
              setContactModalOpen(false);
            }}
          />
        </Modal>

        <Modal
          isOpen={interviewModalOpen}
          onClose={() => setInterviewModalOpen(false)}
          title="Add Interview"
        >
          <InterviewForm
            onSuccess={() => {
              setInterviewModalOpen(false);
            }}
          />
        </Modal>

        <Modal isOpen={!!editApp} onClose={() => setEditApp(null)} title="Edit Application">
          {editApp && (
            <ApplicationForm
              initial={editApp}
              onSuccess={() => {
                setEditApp(null);
                refreshApplications();
              }}
            />
          )}
        </Modal>
      </div>
    </MainLayout>
  );
}
