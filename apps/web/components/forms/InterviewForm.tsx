"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@shared/components/ui/Button";
import { Input } from "@shared/components/ui/Input";
import { Select } from "@shared/components/ui/Select";
import { TextArea } from "@shared/components/ui/TextArea";
import { Alert, AlertDescription } from "@shared/components/ui/Alert";

export interface Interview {
  id?: string;
  user_id?: string;
  application_id?: number;
  type: string;
  schedule: string; // timestamp
  interviewer: string;
  status: string;
  notes: string;
}

const defaultForm: Omit<Interview, "id" | "user_id"> = {
  application_id: undefined,
  type: "",
  schedule: "",
  interviewer: "",
  status: "",
  notes: "",
};

// Common interview types
const interviewTypes = [
  "Phone Screening",
  "Technical Interview",
  "Behavioral Interview",
  "System Design",
  "Coding Challenge",
  "Panel Interview",
  "Final Interview",
  "HR Interview",
  "Other"
];

// Interview statuses
const interviewStatuses = [
  "Scheduled",
  "Completed",
  "Cancelled",
  "Rescheduled",
  "No Show",
  "Pending"
];

interface InterviewFormProps {
  initial?: Partial<Interview>;
  onSuccess?: () => void;
}

export function InterviewForm({ initial, onSuccess }: InterviewFormProps) {
  const [form, setForm] = useState<Omit<Interview, "id" | "user_id">>({
    ...defaultForm,
    ...initial,
  });
  const [applications, setApplications] = useState<Array<{id: number, company_name: string, position: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch user's applications for the dropdown
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("/api/application", {
          credentials: "include"
        });
        if (response.ok) {
          const data = await response.json();
          setApplications(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      }
    };

    fetchApplications();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    
    // Handle application_id as number
    if (name === "application_id") {
      setForm((prev) => ({ 
        ...prev, 
        [name]: value ? parseInt(value, 10) : undefined 
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const method = initial?.id ? "PUT" : "POST";
      const url = "/api/interview";
      
      const body = initial?.id 
        ? { ...form, id: initial.id }
        : form;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save interview");
      }

      setSuccess(initial?.id ? "Interview updated successfully!" : "Interview created successfully!");
      setShowSuccess(true);
      
      // Reset form if creating new interview
      if (!initial?.id) {
        setForm(defaultForm);
      }

      // Call onSuccess callback
      if (onSuccess) {
        // Small delay to show success message
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }

      // Auto-hide success message
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  // Format datetime-local input value
  const formatDateTimeLocal = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
    } catch {
      return "";
    }
  };

  // Convert datetime-local to ISO string
  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const isoString = new Date(value).toISOString();
      setForm((prev) => ({ ...prev, schedule: isoString }));
    } else {
      setForm((prev) => ({ ...prev, schedule: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {showSuccess && success && (
        <Alert type="success">
          <AlertDescription>
            {success}
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert type="error">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Select
          label="Application"
          id="application_id"
          name="application_id"
          value={form.application_id?.toString() || ""}
          onChange={handleChange}
        >
          <option value="">Select an application (optional)</option>
          {applications.map((app) => (
            <option key={app.id} value={app.id}>
              {app.company_name} - {app.position}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Select
          label="Interview Type"
          id="type"
          name="type"
          value={form.type}
          onChange={handleChange}
          required
        >
          <option value="">Select interview type</option>
          {interviewTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Input
          label="Schedule"
          name="schedule"
          type="datetime-local"
          value={formatDateTimeLocal(form.schedule)}
          onChange={handleScheduleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Input
          label="Interviewer"
          name="interviewer"
          value={form.interviewer}
          onChange={handleChange}
          required
          placeholder="e.g. John Smith, Sarah Johnson"
        />
      </div>

      <div className="space-y-2">
        <Select
          label="Status"
          id="status"
          name="status"
          value={form.status}
          onChange={handleChange}
          required
        >
          <option value="">Select status</option>
          {interviewStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
      </div>

      <TextArea
        label="Notes"
        id="notes"
        name="notes"
        value={form.notes}
        onChange={handleChange}
        rows={3}
        placeholder="Interview preparation notes, questions to ask, feedback, etc..."
      />

      <div className="flex justify-center mt-4">
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : initial?.id ? "Update Interview" : "Add Interview"}
        </Button>
      </div>
    </form>
  );
}