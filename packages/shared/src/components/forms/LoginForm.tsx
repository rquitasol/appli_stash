'use client';
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface LoginFormProps {
  onSubmit?: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  apiEndpoint?: string | null;
  redirectUrl?: string;
  isExtension?: boolean;
}

export function LoginForm({
  onSubmit,
  apiEndpoint = '/api/login',
  redirectUrl = '/dashboard',
  isExtension = false,
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!email) return 'Email is required.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Invalid email address.';
    if (!password) return 'Password is required.';
    return '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      // Use custom onSubmit handler if provided, otherwise use API endpoint
      if (onSubmit) {
        const result = await onSubmit(email, password);
        if (!result.success) {
          setError(result.error || 'Login failed');
        } else if (!isExtension) {
          // For web app: Redirect after successful login if not an extension
          // Extensions should handle their own state management after login
          window.location.href = redirectUrl;
        }
      } else if (apiEndpoint) {
        const res = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Sign in failed');
        } else {
          // handle successful login with redirect
          if (!isExtension) {
            window.location.href = redirectUrl;
          }
        }
      } else {
        setError('No login method provided');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <Input
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <div className="error">{error}</div>}
      <div className="flex justify-center">
        <Button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </Button>
      </div>
    </form>
  );
}
