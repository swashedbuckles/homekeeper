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
  fetchMock.route({
    url: 'path:/auth/csrf-token', 
    response: {
    status: 200,
    body: { csrfToken: 'mock-csrf-token'  },
  }});

  fetchMock.route({
    url: 'path:/auth/refresh', 
    response: {
      status: 401,
      body: { error: 'Session expired' }
    }
  });

  // Mock profile endpoint
  fetchMock.route({
    url: 'path:/auth/profile', 
    response: {
      status: 200,
      body: { data: createMockUser() },
    }
  });

  // Mock login endpoint
  fetchMock.route({
    url: 'path:/auth/login', 
    response: {
      status: 200,
      body: { data: createMockUser(), message: 'Login successful' },
    }
  });

  // Mock logout endpoint
  fetchMock.route({
    url: 'path:/auth/logout', 
    response: {
      status: 200,
      body: { message: 'Logout successful' },
  }});
};

// Wait for async operations to complete
export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0));

// Export everything from testing library for convenience
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';