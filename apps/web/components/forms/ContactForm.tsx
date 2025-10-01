'use client';
import React, { useState } from 'react';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { TextArea } from '@shared/components/ui/TextArea';
import { Alert, AlertDescription } from '@shared/components/ui/Alert';

export interface Contact {
  id?: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  company: string;
  url: string;
  notes: string;
}

const defaultForm: Omit<Contact, 'id'> = {
  name: '',
  title: '',
  email: '',
  phone: '',
  company: '',
  url: '',
  notes: '',
};

interface ContactFormProps {
  initial?: Partial<Contact>;
  onSuccess?: () => void;
}

export function ContactForm({ initial, onSuccess }: ContactFormProps) {
  const [form, setForm] = useState<Omit<Contact, 'id'>>({
    ...defaultForm,
    ...initial,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const method = initial?.id ? 'PUT' : 'POST';
      const url = '/api/contact';

      const body = initial?.id ? { ...form, id: initial.id } : form;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save contact');
      }

      setSuccess(initial?.id ? 'Contact updated successfully!' : 'Contact created successfully!');
      setShowSuccess(true);

      // Reset form if creating new contact
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
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {showSuccess && success && (
        <Alert type="success">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert type="error">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Input
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Enter full name"
        />
      </div>

      <div className="space-y-2">
        <Input
          label="Job Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="e.g. Software Engineer, HR Manager"
        />
      </div>

      <div className="space-y-2">
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="contact@company.com"
        />
      </div>

      <div className="space-y-2">
        <Input
          label="Phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          required
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div className="space-y-2">
        <Input
          label="Company"
          name="company"
          value={form.company}
          onChange={handleChange}
          required
          placeholder="Company name"
        />
      </div>

      <div className="space-y-2">
        <Input
          label="LinkedIn/Website URL"
          name="url"
          type="url"
          value={form.url}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/username"
        />
      </div>

      <TextArea
        label="Notes"
        id="notes"
        name="notes"
        value={form.notes}
        onChange={handleChange}
        rows={3}
        placeholder="Additional notes about this contact..."
      />

      <div className="flex justify-center mt-4">
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Saving...' : initial?.id ? 'Update Contact' : 'Add Contact'}
        </Button>
      </div>
    </form>
  );
}
