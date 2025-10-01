import { NextRequest } from 'next/server';

// Mock Supabase client
export const mockSupabaseClient = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  or: jest.fn().mockReturnThis(),
  ilike: jest.fn().mockReturnThis(),
  auth: {
    getUser: jest.fn(),
  },
};

// Mock successful Supabase responses
export const mockSuccessResponse = {
  data: [],
  error: null,
};

export const mockErrorResponse = {
  data: null,
  error: { message: 'Database error' },
};

// Mock authenticated user
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  aud: 'authenticated',
  role: 'authenticated',
};

// Mock JWT token
export const mockAccessToken = 'mock-jwt-token';

// Mock request helper
export function createMockRequest(options: {
  method: string;
  url?: string;
  body?: any;
  headers?: Record<string, string>;
  searchParams?: Record<string, string>;
}): NextRequest {
  const url = options.url || 'http://localhost:3000/api/test';
  const searchParams = new URLSearchParams(options.searchParams || {});
  const fullUrl = `${url}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const request = new NextRequest(fullUrl, {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  return request;
}

// Mock getAccessToken
export const mockGetAccessToken = jest.fn();

// Mock getSupabaseForUser
export const mockGetSupabaseForUser = jest.fn();

// Reset all mocks
export function resetAllMocks() {
  jest.clearAllMocks();
  mockSupabaseClient.from.mockReturnThis();
  mockSupabaseClient.select.mockReturnThis();
  mockSupabaseClient.insert.mockReturnThis();
  mockSupabaseClient.update.mockReturnThis();
  mockSupabaseClient.delete.mockReturnThis();
  mockSupabaseClient.eq.mockReturnThis();
  mockSupabaseClient.or.mockReturnThis();
  mockSupabaseClient.ilike.mockReturnThis();
}
