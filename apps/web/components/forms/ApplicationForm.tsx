"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@shared/components/ui/Button";
import { Input } from "@shared/components/ui/Input";
import { Select } from "@shared/components/ui/Select";
import { TextArea } from "@shared/components/ui/TextArea";
import { Alert, AlertDescription } from "@shared/components/ui/Alert";
import { Application, ApplicationStatus, ApplicationPriority } from "@applistash/shared";


const defaultForm: Omit<Application, "id" | "user_id"> = {
  company_name: "",
  url: "",
  status: ApplicationStatus.Saved,
  position: "",
  priority_level: ApplicationPriority.Low,
  notes: "",
};

interface ApplicationFormProps {
  initial?: Partial<Application>;
  onSuccess?: () => void;
}

export function ApplicationForm({ initial, onSuccess }: ApplicationFormProps) {
  const [form, setForm] = useState<Omit<Application, "id" | "user_id">>({
    ...defaultForm,
    ...initial,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Check for column-specific status on mount
  useEffect(() => {
    const columnStatus = localStorage.getItem('newApplicationStatus');
    if (columnStatus && !initial) {
      console.log('Setting status from localStorage:', columnStatus);
      setForm(prev => ({
        ...prev,
        status: columnStatus as ApplicationStatus
      }));
      // Clear localStorage after using it
      localStorage.removeItem('newApplicationStatus');
    }
  }, [initial]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to add application");
      } else {
        setSuccess("Application added successfully!");
        setShowSuccess(true);
        setForm(defaultForm);
        if (onSuccess) {
          setTimeout(() => {
            setShowSuccess(false);
            onSuccess();
          }, 3000);
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {showSuccess && (
        <Alert type="success">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Input
          label="Company Name"
          name="company_name"
          value={form.company_name}
          onChange={handleChange}
          required
          placeholder="e.g. Google, Microsoft, Apple"
        />
      </div>
      <div className="space-y-2">
        <Input
          label="URL"
          name="url"
          value={form.url}
          onChange={handleChange}
          required
          placeholder="https://company.com/careers/job-posting"
        />
      </div>
      <Select
        label="Status"
        id="status"
        name="status"
        value={form.status}
        onChange={handleChange}
        required
      >
        {Object.values(ApplicationStatus).map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </Select>
      <div className="space-y-2">
        <Input
          label="Position"
          name="position"
          value={form.position}
          onChange={handleChange}
          required
          placeholder="e.g. Software Engineer, Product Manager"
        />
      </div>
      <div className="space-y-2">
        <Select
          label="Priority Level"
          name="priority_level"
          value={form.priority_level}
          onChange={handleChange}
          required
        >
          {Object.values(ApplicationPriority).map((priority) => (
            <option key={priority} value={priority}>{priority}</option>
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
        placeholder="Additional notes about this application, interview details, contacts, etc..."
      />
        <div className="flex justify-center mt-4">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
    </form>
  );
}
