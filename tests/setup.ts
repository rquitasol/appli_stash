import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/test-path',
}));

import '@testing-library/jest-dom';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.JWT_SECRET = 'test-jwt-secret';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Global test timeout
jest.setTimeout(10000);

// Mock Web API globals for Node environment
if (typeof Request === 'undefined') {
  global.Request = class Request {
    constructor(
      public url: string,
      public init?: any
    ) {}
    json() {
      return Promise.resolve({});
    }
    text() {
      return Promise.resolve('');
    }
    headers = new Map();
    method = 'GET';
  } as any;
}

if (typeof Response === 'undefined') {
  global.Response = class Response {
    constructor(
      public body?: any,
      public init?: any
    ) {}
    static json(data: any, init?: any) {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      });
    }
    json() {
      return Promise.resolve(JSON.parse(this.body || '{}'));
    }
    text() {
      return Promise.resolve(this.body || '');
    }
    ok = true;
    status = 200;
    statusText = 'OK';
    headers = new Map();
  } as any;
}

if (typeof Headers === 'undefined') {
  global.Headers = Map as any;
}

// Global test timeout
jest.setTimeout(10000);
