"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { MainLayout } from "../../components/layout/MainLayout";
import { InterviewItem, Interview } from "../../components/board/InterviewItem";
import { CalendarView } from "../../components/calendar/CalendarView";
import { Button } from "@shared/components/ui/Button";
import { Modal } from "@shared/components/ui/Modal";
import { InterviewForm } from "../../components/forms/InterviewForm";

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [viewMode, setViewMode] = useState<'normal' | 'calendar'>('normal');

  // Mock data for demonstration - wrapped in useMemo to avoid recreating on every render
  const mockInterviews: Interview[] = useMemo(() => [
    {
      id: "1",
      type: "Phone",
      schedule: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      interviewer: "Sarah Johnson",
      status: "Scheduled",
      notes: "Initial phone screening with HR",
      company_name: "TechCorp Inc",
      position: "Senior Frontend Developer",
      application_id: 1,
    },
    {
      id: "2",
      type: "Video",
      schedule: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      interviewer: "Mike Chen",
      status: "Scheduled",
      notes: "Technical interview focusing on React and TypeScript",
      company_name: "StartupXYZ",
      position: "Full Stack Developer",
      application_id: 2,
    },
    {
      id: "3",
      type: "In-Person",
      schedule: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      interviewer: "Emily Davis",
      status: "Completed",
      notes: "Great conversation about team culture and project management",
      company_name: "Enterprise Solutions",
      position: "Project Manager",
      application_id: 3,
    },
    {
      id: "4",
      type: "Technical",
      schedule: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
      interviewer: "Alex Rodriguez",
      status: "Scheduled",
      notes: "Live coding session - prepare data structures and algorithms",
      company_name: "Innovation Labs",
      position: "Software Engineer",
      application_id: 4,
    },
  ], []);

  const handleInterviewClick = (interview: Interview) => {
    setSelectedInterview(interview);
    setModalOpen(true);
  };

  const loadInterviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/interview');
      if (response.ok) {
        const data = await response.json();
        setInterviews(data);
      } else {
        console.error('Failed to fetch interviews');
        // Fallback to mock data for development
        setInterviews(mockInterviews);
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
      // Fallback to mock data for development
      setInterviews(mockInterviews);
    } finally {
      setLoading(false);
    }
  }, [mockInterviews]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedInterview(null);
    // Refresh interviews after modal closes
    loadInterviews();
  };

  useEffect(() => {
    loadInterviews();
  }, [loadInterviews]);

  // Group interviews by status
  const groupedInterviews = interviews.reduce((groups, interview) => {
    const status = interview.status;
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(interview);
    return groups;
  }, {} as Record<string, Interview[]>);

  // Sort interviews by date
  const sortInterviewsByDate = (interviews: Interview[]) => {
    return [...interviews].sort((a, b) => new Date(a.schedule).getTime() - new Date(b.schedule).getTime());
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Interviews</h1>
                <p className="text-gray-600">
                  Manage and track your job interviews
                </p>
              </div>
              <Button
                onClick={() => setModalOpen(true)}
                className="bg-primary hover:bg-primary-dark text-white"
              >
                Add Interview
              </Button>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 rounded-lg p-1 flex">
                <button
                  onClick={() => setViewMode('normal')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'normal'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Normal View
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'calendar'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Calendar View
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : interviews.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                No interviews yet
              </h2>
              
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Get started by adding your first interview. Keep track of all your upcoming and past interviews in one place.
              </p>
              
              <Button
                onClick={() => setModalOpen(true)}
                className="bg-primary hover:bg-primary-dark text-white"
              >
                Add Your First Interview
              </Button>
            </div>
          ) : viewMode === 'calendar' ? (
            /* Calendar View */
            <CalendarView
              interviews={interviews}
              onInterviewClick={handleInterviewClick}
            />
          ) : (
            /* Normal View - Interview Lists */
            <div className="space-y-8">
              {/* Upcoming Interviews */}
              {groupedInterviews["Scheduled"] && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Upcoming Interviews ({groupedInterviews["Scheduled"].length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {sortInterviewsByDate(groupedInterviews["Scheduled"]).map((interview) => (
                      <InterviewItem
                        key={interview.id}
                        interview={interview}
                        onClick={handleInterviewClick}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Interviews */}
              {groupedInterviews["Completed"] && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Completed Interviews ({groupedInterviews["Completed"].length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {sortInterviewsByDate(groupedInterviews["Completed"]).reverse().map((interview) => (
                      <InterviewItem
                        key={interview.id}
                        interview={interview}
                        onClick={handleInterviewClick}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Other Statuses */}
              {Object.entries(groupedInterviews).map(([status, statusInterviews]) => {
                if (status === "Scheduled" || status === "Completed") return null;
                
                return (
                  <div key={status}>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {status} Interviews ({statusInterviews.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {sortInterviewsByDate(statusInterviews).map((interview) => (
                        <InterviewItem
                          key={interview.id}
                          interview={interview}
                          onClick={handleInterviewClick}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Interview Modal */}
      <Modal isOpen={modalOpen} onClose={handleCloseModal} title={selectedInterview ? "Edit Interview" : "Add Interview"}>
        <InterviewForm
          initial={selectedInterview || undefined}
          onSuccess={handleCloseModal}
        />
      </Modal>
    </MainLayout>
  );
}