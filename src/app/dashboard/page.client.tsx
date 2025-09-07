"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "../../components/context/UserContext";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Modal } from "../../components/ui/Modal";

import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { Board } from "../../components/board/Board";
import type { Application } from "../../types/Application";
import { ApplicationStatus } from "../../types/ApplicationStatus";


export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editApp, setEditApp] = useState<Application | null>(null);
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [user, loading]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  if (!user) {
    // Optionally render nothing or a spinner while redirecting
    return null;
  }


  const [applications, setApplications] = useState<Application[]>([]);
  const [appLoading, setAppLoading] = useState(true);
  const [appError, setAppError] = useState("");

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

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex-shrink-0" style={{ height: "5%" }}>
        <Header />
      </div>
      <main className="flex-grow" style={{ height: "90%" }}>
        <div className="flex justify-end mt-4 mb-4 mr-4">
          <button
            className="px-4 py-2 bg-accent text-primary rounded shadow hover:bg-primary hover:text-accent border border-primary"
            onClick={() => setModalOpen(true)}
          >
            Add Application
          </button>
        </div>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Application">
          <ApplicationForm />
        </Modal>
        <Modal isOpen={!!editApp} onClose={() => setEditApp(null)} title="Edit Application">
          {editApp && <ApplicationForm initial={editApp} />}
        </Modal>
        <div className="mt-8">
          {appLoading ? (
            <div className="text-center text-gray-500">Loading applications...</div>
          ) : appError ? (
            <div className="text-center text-red-500">{appError}</div>
          ) : (
            <Board applications={applications} onItemClick={setEditApp} />
          )}
        </div>
      </main>
      <div className="flex-shrink-0" style={{ height: "5%" }}>
        <Footer />
      </div>
    </div>
  );
}
