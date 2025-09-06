"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "../../components/context/UserContext";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Modal } from "../../components/ui/Modal";
import { ApplicationForm } from "@/components/forms/ApplicationForm";


export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
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

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex-shrink-0" style={{ height: "5%" }}>
        <Header />
      </div>
      <main className="flex-grow" style={{ height: "90%" }}>
        <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
        <div className="bg-accent rounded shadow p-6 mb-4">
          <p>Welcome to your dashboard! Here you can manage your account and view your data.</p>
        </div>
        <button
          className="px-4 py-2 bg-primary text-accent rounded shadow hover:bg-accent hover:text-primary border border-primary mb-4"
          onClick={() => setModalOpen(true)}
        >
          Add Task
        </button>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Application">
          <ApplicationForm />
        </Modal>
      </main>
      <div className="flex-shrink-0" style={{ height: "5%" }}>
        <Footer />
      </div>
    </div>
  );
}
