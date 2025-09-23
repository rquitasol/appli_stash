"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "../../components/context/UserContext";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Modal } from "@shared/components/ui/Modal";
import { ApplicationForm } from "../../components/forms/ApplicationForm";
import { ContactForm } from "../../components/forms/ContactForm";
import { InterviewForm } from "../../components/forms/InterviewForm";
import { Board } from "../../components/board/Board";
import { Sidebar } from "../../components/layout/Sidebar";
import type { Application } from "@shared/types";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editApp, setEditApp] = useState<Application | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [appLoading, setAppLoading] = useState(true);
  const [appError, setAppError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    setAppLoading(true);
    fetch("/api/application", {
      credentials: "include"
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch applications");
        }
        return res.json();
      })
      .then((data) => {
        setApplications(data);
        setAppError("");
      })
      .catch((err) => {
        setAppError(err.message || "Failed to fetch applications");
      })
      .finally(() => setAppLoading(false));
  }, [user]);

  const refreshApplications = () => {
    setAppLoading(true);
    fetch("/api/application", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch applications");
        }
        return res.json();
      })
      .then((data) => {
        setApplications(data);
        setAppError("");
      })
      .catch((err) => {
        setAppError(err.message || "Failed to fetch applications");
      })
      .finally(() => setAppLoading(false));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className={`flex flex-col flex-1 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="flex-shrink-0">
          <Header />
        </div>
        
        <main className="flex-grow p-4 bg-white overflow-auto">
          <div className="flex justify-between items-center mb-6 flex-wrap">
            <h1 className="text-2xl font-bold text-[#581C87] mb-2 md:mb-0">Applications</h1>
            <div className="flex gap-2 flex-wrap">
              <button
                className="px-4 py-2 bg-primary text-accent rounded shadow hover:bg-secondary hover:text-accent border border-primary"
                onClick={() => setModalOpen(true)}
                data-add-application
              >
                Add Application
              </button>
              <button
                className="px-4 py-2 bg-[#3B82F6] text-white rounded shadow hover:bg-[#2563EB] border border-[#3B82F6]"
                onClick={() => setInterviewModalOpen(true)}
              >
                Add Interview
              </button>
            </div>
          </div>
          
          {appLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : appError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {appError}
            </div>
          ) : (
            <Board 
              applications={applications} 
              onItemClick={setEditApp} 
            />
          )}
          
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Application">
            <ApplicationForm
              onSuccess={() => {
                setModalOpen(false);
                refreshApplications();
              }}
            />
          </Modal>
          
          <Modal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} title="Add Contact">
            <ContactForm
              onSuccess={() => {
                setContactModalOpen(false);
              }}
            />
          </Modal>
          
          <Modal isOpen={interviewModalOpen} onClose={() => setInterviewModalOpen(false)} title="Add Interview">
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
        </main>
        
        <div className="flex-shrink-0 mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}
