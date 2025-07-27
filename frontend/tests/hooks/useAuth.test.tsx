import fetchMock from '@fetch-mock/vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuth } from '../../src/hooks/useAuth';
import { ApiError } from '../../src/lib/types/apiError';
import { AuthStatus } from '../../src/lib/types/authStatus';
import { TestAuthProvider } from '../helpers/testProviderUtils';
import { createMockUser } from '../helpers/testUtils';

describe('useAuth', () => {
  beforeEach(() => {
    fetchMock.clearHistory();
    fetchMock.mockGlobal();
  });

  describe('initial state', () => {
    it('should initialize with UNKNOWN status', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <TestAuthProvider initialAuthStatus={AuthStatus.UNKNOWN}>
            {children}
          </TestAuthProvider>
        ),
      });

      expect(result.current.authStatus).toBe(AuthStatus.UNKNOWN);
      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should initialize with LOGGED_OUT status', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <TestAuthProvider initialAuthStatus={AuthStatus.LOGGED_OUT}>
            {children}
          </TestAuthProvider>
        ),
      });

      expect(result.current.authStatus).toBe(AuthStatus.LOGGED_OUT);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should initialize with LOGGED_IN status and user', () => {
      const mockUser = createMockUser();
      
      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <TestAuthProvider 
            initialAuthStatus={AuthStatus.LOGGED_IN}
            initialUser={mockUser}
          >
            {children}
          </TestAuthProvider>
        ),
      });

      expect(result.current.authStatus).toBe(AuthStatus.LOGGED_IN);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('checkAuth', () => {
    it('should successfully validate session and get user profile', async () => {
      const mockUser = createMockUser();
      
      // Mock successful session validation
      fetchMock.route({
        url: 'path:/auth/validate',
        allowRelativeUrls: true,
        response: { data: { valid: true } }
      });

      // Mock successful profile fetch
      fetchMock.route({
        url: 'path:/auth/whoami',
        allowRelativeUrls: true,
        response: { data: mockUser }
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <TestAuthProvider initialAuthStatus={AuthStatus.UNKNOWN}>
            {children}
          </TestAuthProvider>
        ),
      });

      await act(async () => {
        await result.current.checkAuth();
      });

      await waitFor(() => {
        expect(result.current.authStatus).toBe(AuthStatus.LOGGED_IN);
        expect(result.current.user).toEqual(mockUser);
      });

      // Verify both calls were made
      const validateCall = fetchMock.callHistory.calls().find(call => 
        call.url.includes('/auth/validate')
      );
      const profileCall = fetchMock.callHistory.calls().find(call => 
        call.url.includes('/auth/whoami')
      );
      expect(validateCall).toBeTruthy();
      expect(profileCall).toBeTruthy();
    });

    it('should refresh token and retry when session validation fails with 401', async () => {
      const mockUser = createMockUser();
      
      // Mock first validation call fails with 401
      fetchMock.route({
        url: 'path:/auth/validate',
        allowRelativeUrls: true,
        response: [
          { status: 401, body: { error: 'Token expired' } }, // First call fails
          { data: { valid: true } } // Second call (after refresh) succeeds
        ]
      });

      // Mock successful token refresh
      fetchMock.route({
        url: 'path:/auth/refresh',
        allowRelativeUrls: true,
        response: { message: 'Token refreshed' }
      });

      // Mock successful profile fetch
      fetchMock.route({
        url: 'path:/auth/whoami',
        allowRelativeUrls: true,
        response: { data: mockUser }
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <TestAuthProvider initialAuthStatus={AuthStatus.UNKNOWN}>
            {children}
          </TestAuthProvider>
        ),
      });

      await act(async () => {
        await result.current.checkAuth();
      });

      await waitFor(() => {
        expect(result.current.authStatus).toBe(AuthStatus.LOGGED_IN);
        expect(result.current.user).toEqual(mockUser);
      });

      // Verify refresh was called
      const refreshCall = fetchMock.callHistory.calls().find(call => 
        call.url.includes('/auth/refresh')
      );
      expect(refreshCall).toBeTruthy();

      // Verify validation was called twice (before and after refresh)
      const validateCalls = fetchMock.callHistory.calls().filter(call => 
        call.url.includes('/auth/validate')
      );
      expect(validateCalls).toHaveLength(2);
    });

    it('should set LOGGED_OUT when session validation fails and refresh also fails', async () => {
      // Mock failed session validation
      fetchMock.route({
        url: 'path:/auth/validate',
        allowRelativeUrls: true,
        response: {
          status: 401,
          body: { error: 'Token expired' }
        }
      });

      // Mock failed refresh (session completely expired)
      fetchMock.route({
        url: 'path:/auth/refresh',
        allowRelativeUrls: true,
        response: {
          status: 205,
          body: { error: 'Session expired' }
        }
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <TestAuthProvider initialAuthStatus={AuthStatus.UNKNOWN}>
            {children}
          </TestAuthProvider>
        ),
      });

      await act(async () => {
        await result.current.checkAuth();
      });

      await waitFor(() => {
        expect(result.current.authStatus).toBe(AuthStatus.LOGGED_OUT);
        expect(result.current.user).toBeNull();
      });

      // Verify refresh was attempted
      const refreshCall = fetchMock.callHistory.calls().find(call => 
        call.url.includes('/auth/refresh')
      );
      expect(refreshCall).toBeTruthy();
    });

    it('should handle session valid but no user data', async () => {
      // Mock successful session validation
      fetchMock.route({
        url: 'path:/auth/validate',
        allowRelativeUrls: true,
        response: { data: { valid: true } }
      });

      // Mock profile with empty data
      fetchMock.route({
        url: 'path:/auth/whoami',
        allowRelativeUrls: true,
        response: { data: {} }
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <TestAuthProvider initialAuthStatus={AuthStatus.UNKNOWN}>
            {children}
          </TestAuthProvider>
        ),
      });

      await act(async () => {
        await result.current.checkAuth();
      });

      await waitFor(() => {
        expect(result.current.authStatus).toBe(AuthStatus.LOGGED_OUT);
        expect(result.current.user).toBeNull();
      });
    });
  });

  describe('login', () => {
    it('should successfully login user', async () => {
      const mockUser = createMockUser();
      fetchMock.route({
        url: 'path:/auth/login',
        allowRelativeUrls: true,
        response: { data: mockUser, message: 'Login successful' }
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <TestAuthProvider initialAuthStatus={AuthStatus.LOGGED_OUT}>
            {children}
          </TestAuthProvider>
        ),
      });

      await act(async () => {
        await result.current.login({email: 'test@example.com', password: 'password123'});
      });

      await waitFor(() => {
        expect(result.current.authStatus).toBe(AuthStatus.LOGGED_IN);
        expect(result.current.user).toEqual(mockUser);
      });

      // Verify the request was made correctly
      const loginCall = fetchMock.callHistory.calls().find(call => 
        call.url.includes('/auth/login')
      );
      expect(loginCall).toBeTruthy();
      expect(JSON.parse(loginCall?.options.body as string)).toEqual({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should handle login failure', async () => {
      fetchMock.route({
        url: 'path:/auth/login',
        allowRelativeUrls: true,
        response: {
          status: 401,
          body: { error: 'Invalid credentials' }
        }
      });
      
      fetchMock.route({
        url: 'path:/auth/refresh',
        allowRelativeUrls: true,
        response: {
          status: 401,
          body: { error: 'Session expired' }
        }
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <TestAuthProvider initialAuthStatus={AuthStatus.LOGGED_OUT}>
            {children}
          </TestAuthProvider>
        ),
      });

      await act(async () => {
        await expect(result.current.login({email: 'wrong@example.com', password: 'wrongpass'}))
          .rejects.toThrow(ApiError);
      });

      await waitFor(() => {
        expect(result.current.authStatus).toBe(AuthStatus.LOGGED_OUT);
        expect(result.current.user).toBeNull();
      });
    });

    it('should set loading state during login', async () => {
      const mockUser = createMockUser();
      
      // Add a delay to the response so we can check loading state
      fetchMock.route({
        url: 'path:/auth/login',
        allowRelativeUrls: true,
        delay: 100,
        response: {body: {data: mockUser}}
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <TestAuthProvider initialAuthStatus={AuthStatus.LOGGED_OUT}>
            {children}
          </TestAuthProvider>
        ),
      });

      act(() => {
        result.current.login({email: 'test@example.com', password: 'password123'});
      });

      // Should be in loading state immediately
      expect(result.current.authStatus).toBe(AuthStatus.LOGGING_IN);
      expect(result.current.isLoading).toBe(true);

      // Wait for completion
      await waitFor(() => {
        expect(result.current.authStatus).toBe(AuthStatus.LOGGED_IN);
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('logout', () => {
    it('should successfully logout user', async () => {
      const mockUser = createMockUser();
      
      fetchMock.route({
        url: 'path:/auth/logout',
        allowRelativeUrls: true,
        response: { message: 'Logout successful' }
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <TestAuthProvider 
            initialAuthStatus={AuthStatus.LOGGED_IN}
            initialUser={mockUser}
          >
            {children}
          </TestAuthProvider>
        ),
      });

      await act(async () => {
        await result.current.logout();
      });

      await waitFor(() => {
        expect(result.current.authStatus).toBe(AuthStatus.LOGGED_OUT);
        expect(result.current.user).toBeNull();
      });
    });

    /** @todo this test is for if/when we determine to force logout when logout fails */
    it.skip('should handle logout failure but still clear local state', async () => {
      const mockUser = createMockUser();
      
      fetchMock.route({
        url: 'path:/auth/logout',
        allowRelativeUrls: true,
        response: {
          status: 500,
          body: { error: 'Server error' }
        }
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <TestAuthProvider 
            initialAuthStatus={AuthStatus.LOGGED_IN}
            initialUser={mockUser}
          >
            {children}
          </TestAuthProvider>
        ),
      });

      await act(async () => {
        await result.current.logout().catch(() => {});
      });

      // Should clear local state even if server call fails
      await waitFor(() => {
        expect(result.current.authStatus).toBe(AuthStatus.LOGGED_OUT);
        expect(result.current.user).toBeNull();
      });
    });

    it('should handle logout failure and not clear local state', async () => {
      const mockUser = createMockUser();
      
      fetchMock.route({
        url: 'path:/auth/logout',
        allowRelativeUrls: true,
        response: {
          status: 500,
          body: { error: 'Server error' }
        }
      });
      
      fetchMock.route({
        url: 'path:/auth/refresh',
        allowRelativeUrls: true,
        response: {
          status: 401,
          body: { error: 'Session expired' }
        }
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <TestAuthProvider 
            initialAuthStatus={AuthStatus.LOGGED_IN}
            initialUser={mockUser}
          >
            {children}
          </TestAuthProvider>
        ),
      });

      await act(async () => {
        await result.current.logout().catch(() => {});
      });

      // Should clear local state even if server call fails
      await waitFor(() => {
        expect(result.current.authStatus).toBe(AuthStatus.LOGGED_IN);
        expect(result.current.user).toBe(mockUser);
      });
    });

    it('should set loading state during logout', async () => {
      const mockUser = createMockUser();
      
      fetchMock.route({
        url: 'path:/auth/logout',
        allowRelativeUrls: true,
        response: new Promise(resolve => 
          setTimeout(() => resolve({ message: 'Logout successful' }), 100)
        )
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <TestAuthProvider 
            initialAuthStatus={AuthStatus.LOGGED_IN}
            initialUser={mockUser}
          >
            {children}
          </TestAuthProvider>
        ),
      });

      act(() => {
        result.current.logout();
      });

      // Should be in loading state immediately
      expect(result.current.authStatus).toBe(AuthStatus.LOGGING_OUT);
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.authStatus).toBe(AuthStatus.LOGGED_OUT);
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('computed properties', () => {
    it('should correctly calculate isLoading for different states', () => {
      const loadingStates = [
        AuthStatus.CHECKING,
        AuthStatus.LOGGING_IN,
        AuthStatus.LOGGING_OUT,
      ];

      loadingStates.forEach(status => {
        const { result } = renderHook(() => useAuth(), {
          wrapper: ({ children }) => (
            <TestAuthProvider initialAuthStatus={status}>
              {children}
            </TestAuthProvider>
          ),
        });

        expect(result.current.isLoading).toBe(true);
      });
    });

    it('should correctly calculate isAuthenticated', () => {
      const mockUser = createMockUser();
      
      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <TestAuthProvider 
            initialAuthStatus={AuthStatus.LOGGED_IN}
            initialUser={mockUser}
          >
            {children}
          </TestAuthProvider>
        ),
      });

      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should return false for isAuthenticated when logged out', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <TestAuthProvider initialAuthStatus={AuthStatus.LOGGED_OUT}>
            {children}
          </TestAuthProvider>
        ),
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});