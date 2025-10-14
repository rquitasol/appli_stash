import { useState, useCallback } from 'react';
import { Interview } from '../components/forms/InterviewForm';

interface UseInterviewApiReturn {
  createInterview: (interview: Omit<Interview, 'id' | 'user_id'>) => Promise<Interview>;
  updateInterview: (interview: Interview) => Promise<Interview>;
  deleteInterview: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useInterviewApi(): UseInterviewApiReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInterview = useCallback(
    async (interview: Omit<Interview, 'id' | 'user_id'>): Promise<Interview> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(interview),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to create interview');
        }

        return await response.json();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateInterview = useCallback(async (interview: Interview): Promise<Interview> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/interview', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interview),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update interview');
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteInterview = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/interview?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete interview');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createInterview,
    updateInterview,
    deleteInterview,
    isLoading,
    error,
  };
}
