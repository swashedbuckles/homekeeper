import fetchMock from '@fetch-mock/vitest';
import type { SafeUser } from '@homekeeper/shared';

// Mock user data factory
export const createMockUser = (overrides: Partial<SafeUser> = {}): SafeUser => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  preferences: {
    theme: 'light',
    notifications: {
      email: true,
      push: false,
    },
  },
  householdRoles: {
    'household-1': 'owner',
  },
  ...overrides,
});

// API mocking helpers
export const mockApiSuccess = <T>(data: T, endpoint = '*') => {
  return fetchMock.route(endpoint, {
    status: 200,
    body: { data, message: 'Success' },
  });
};

export const mockApiError = (statusCode: number, error: string, endpoint = '*') => {
  return fetchMock.route(endpoint, {
    status: statusCode,
    body: { error, statusCode },
  });
};

export const mockAuthEndpoints = () => {
  // Mock CSRF token endpoint
  fetchMock.get('express:/api/auth/csrf', {
    status: 200,
    body: { data: { csrfToken: 'mock-csrf-token' } },
  });

  // Mock profile endpoint
  fetchMock.get('express:/api/auth/profile', {
    status: 200,
    body: { data: createMockUser() },
  });

  // Mock login endpoint
  fetchMock.post('express:/api/auth/login', {
    status: 200,
    body: { data: createMockUser(), message: 'Login successful' },
  });

  // Mock logout endpoint
  fetchMock.post('express:/api/auth/logout', {
    status: 200,
    body: { message: 'Logout successful' },
  });
};

// Wait for async operations to complete
export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0));

// Export everything from testing library for convenience
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';