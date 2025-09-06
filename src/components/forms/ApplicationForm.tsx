"use client";
import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Alert, AlertDescription } from "../ui/Alert";
import type { Application } from "../../app/api/application/route";

const initialForm: Omit<Application, "id" | "user_id"> = {
  company_name: "",
  url: "",
  status: "",
  position: "",
  priority_level: "",
  notes: "",
};

export function ApplicationForm() {
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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
        setForm(initialForm);
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
      {success && (
        <Alert>
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
        />
      </div>
      <div className="space-y-2">
        <Input
          label="URL"
          name="url"
          value={form.url}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Input
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Input
          label="Position"
          name="position"
          value={form.position}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Input
          label="Priority Level"
          name="priority_level"
          value={form.priority_level}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          rows={3}
        />
      </div>
        <div className="flex justify-center">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Application"}
          </Button>
        </div>
    </form>
  );
}
