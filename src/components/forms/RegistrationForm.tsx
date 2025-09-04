
"use client";
import React, { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert'
import { Loader2 } from 'lucide-react';

// TypeScript interfaces
interface RegistrationFormData {
  name: string;
  email: string;
  password: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
}

interface ApiResponse {
  success: boolean;
  error?: string;
  message?: string;
}

// Custom hook for form validation
function useFormValidation() {
  const validateForm = useCallback((formData: RegistrationFormData): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    return errors;
  }, []);
  
  return { validateForm };
}

async function signUp(userData: RegistrationFormData): Promise<ApiResponse> {
    try {
  const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Network error occurred. Please try again.');
    }
  };

export function RegistrationForm() {
  // Form state
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    password: ''
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [apiError, setApiError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Custom hooks
  const { validateForm } = useFormValidation();

  // Handle input changes with validation
  const handleInputChange = useCallback((field: keyof RegistrationFormData) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      // Update form data
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // Clear field-specific error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
      
      // Clear API error when user makes changes
      if (apiError) {
        setApiError('');
      }
    }, [errors, apiError]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset states
    setApiError('');
    setIsSuccess(false);
    
    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Clear validation errors
    setErrors({});
    setIsLoading(true);
    
    try {
      await signUp(formData);
      
      // Success handling
      setIsSuccess(true);
      setFormData({ name: '', email: '', password: '' });
      
      // Optional: Redirect after successful registration
      // setTimeout(() => router.push('/login'), 2000);
      
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="text-green-600 text-lg font-medium">
          ✅ Registration Successful!
        </div>
        <div className="text-slate-600">
          Please check your email to verify your account.
        </div>
        <Button onClick={() => setIsSuccess(false)}>
          Register Another Account
        </Button>
      </div>
    );
  }

  return (
  <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {/* API Error Alert */}
      {apiError && (
        <Alert>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      {/* Name Field */}
      <div className="space-y-2">
        <Input
          label="Name"
          type="text"
          id="name"
          name="name"
          required
          autoComplete="name"
          value={formData.name}
          onChange={handleInputChange('name')}
          disabled={isLoading}
          className={`transition-colors ${
            errors.name ? 'border-red-500 focus:ring-red-500' : 
            'border-slate-300 focus:ring-blue-500'
          }`}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <div id="name-error" className="text-sm text-red-600" role="alert">
            {errors.name}
          </div>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Input
          label="Email Address"
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          disabled={isLoading}
          className={`transition-colors ${
            errors.email ? 'border-red-500 focus:ring-red-500' : 
            'border-slate-300 focus:ring-blue-500'
          }`}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <div id="email-error" className="text-sm text-red-600" role="alert">
            {errors.email}
          </div>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Input
          label="Password"
          type="password"
          id="password"
          name="password"
          required
          autoComplete="new-password"
          value={formData.password}
          onChange={handleInputChange('password')}
          disabled={isLoading}
          aria-describedby={errors.password ? 'password-error password-help' : 'password-help'}
        />
        {errors.password && (
          <div id="password-error" className="text-sm text-red-600" role="alert">
            {errors.password}
          </div>
        )}
        <div id="password-help" className="text-sm text-slate-500">
          Must be at least 8 characters with uppercase, lowercase, and number
        </div>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={isLoading}
        
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  );
}
