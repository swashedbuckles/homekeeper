import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import fetchMock, { manageFetchMockGlobally } from '@fetch-mock/vitest';
import loglevel from 'loglevel';

// Mock environment variables
vi.stubEnv('NODE_ENV', 'test');
manageFetchMockGlobally();
// loglevel.disableAll();

// Clean up DOM after each test
afterEach(() => {
  cleanup();
});

beforeEach(() => {
  // Reset all mocks before each test
  fetchMock.mockReset();
  vi.clearAllMocks();
});

afterEach(() => {
  // Clean up fetch mocks after each test
  fetchMock.mockReset();
});

// Mock the API base URL to match your constants
vi.stubGlobal('API_BASE_URL', 'http://localhost:4000/api');

// Console overrides for cleaner test output (following backend pattern)
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    // Only show errors that aren't from React Testing Library or known test artifacts
    if (
      !args[0]?.toString().includes('Warning:') &&
      !args[0]?.toString().includes('validateDOMNesting')
    ) {
      originalConsoleError(...args);
    }
  };

  console.warn = (...args: unknown[]) => {
    // Suppress known warnings during tests
    if (!args[0]?.toString().includes('Warning:')) {
      originalConsoleWarn(...args);
    }
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Error handling for unhandled promises in tests (following backend pattern)
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection in test:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception in test:', error);
});