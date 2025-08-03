import fetchMock from '@fetch-mock/vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuth } from '../../src/hooks/useAuth';
import { ApiError } from '../../src/lib/types/apiError';
import { AuthStatus } from '../../src/lib/types/authStatus';
import { TestAuthProvider } from '../helpers/testProviderUtils';
import { createMockUser } from '../helpers/testUtils';
import { 
  createHookInitialStateTests, 
  createAuthWrapper, 
  AUTH_STATE_SCENARIOS,
  expectAuthState 
} from '../helpers/hookTestHelpers';
import { mockApiSuccess, mockApiError } from '../helpers/apiTestHelpers';

describe('useAuth', () => {
  beforeEach(() => {
    fetchMock.clearHistory();
    fetchMock.mockGlobal();
  });

  createHookInitialStateTests('useAuth', useAuth, [
    AUTH_STATE_SCENARIOS.unknown,
    AUTH_STATE_SCENARIOS.loggedOut,
    AUTH_STATE_SCENARIOS.loggedIn(createMockUser())
  ]);

  describe('checkAuth', () => {
    it('should successfully validate session and get user profile', async () => {
      const mockUser = createMockUser();
      
      mockApiSuccess('/auth/validate', { valid: true });
      mockApiSuccess('/auth/whoami', mockUser);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createAuthWrapper(AuthStatus.UNKNOWN)
      });

      await act(async () => {
        await result.current.checkAuth();
      });

      await waitFor(() => {
        expectAuthState(result, AuthStatus.LOGGED_IN, mockUser, true, false);
      });

      // Verify both calls were made
      const calls = fetchMock.callHistory.calls();
      expect(calls.some(call => call.url.includes('/auth/validate'))).toBe(true);
      expect(calls.some(call => call.url.includes('/auth/whoami'))).toBe(true);
    });

    it('should refresh token and retry when session validation fails with 401', async () => {
      const mockUser = createMockUser();
      let callCount = 0;

      // Mock first validation fails, second succeeds
      fetchMock.route({
        url: 'path:/auth/validate',
        allowRelativeUrls: true,
        response: () => {
          if (callCount === 0) {
            callCount++;
            return { status: 401, body: { error: 'Token expired' } };
          }
          return { status: 200, body: { response: 'ok' } };
        }
      });

      mockApiSuccess('/auth/refresh', { message: 'Token refreshed' });
      mockApiSuccess('/auth/whoami', mockUser);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createAuthWrapper(AuthStatus.UNKNOWN)
      });

      await act(async () => {
        await result.current.checkAuth();
      });

      await waitFor(() => {
        expectAuthState(result, AuthStatus.LOGGED_IN, mockUser, true, false);
      });

      const calls = fetchMock.callHistory.calls();
      expect(calls.filter(call => call.url.includes('/auth/validate'))).toHaveLength(2);
      expect(calls.some(call => call.url.includes('/auth/refresh'))).toBe(true);
    });

    it('should set LOGGED_OUT when session validation fails and refresh also fails', async () => {
      mockApiError('/auth/validate', 401, 'Token expired');
      mockApiError('/auth/refresh', 205, 'Session expired');

      const { result } = renderHook(() => useAuth(), {
        wrapper: createAuthWrapper(AuthStatus.UNKNOWN)
      });

      await act(async () => {
        await result.current.checkAuth();
      });

      await waitFor(() => {
        expectAuthState(result, AuthStatus.LOGGED_OUT, null, false, false);
      });

      const calls = fetchMock.callHistory.calls();
      expect(calls.some(call => call.url.includes('/auth/refresh'))).toBe(true);
    });

    it('should handle session valid but no user data', async () => {
      mockApiSuccess('/auth/validate', { valid: true });
      mockApiSuccess('/auth/whoami', {});

      const { result } = renderHook(() => useAuth(), {
        wrapper: createAuthWrapper(AuthStatus.UNKNOWN)
      });

      await act(async () => {
        await result.current.checkAuth();
      });

      await waitFor(() => {
        expectAuthState(result, AuthStatus.LOGGED_OUT, null, false, false);
      });
    });
  });

  describe('login', () => {
    it('should successfully login user', async () => {
      const mockUser = createMockUser();
      mockApiSuccess('/auth/login', mockUser, 'Login successful');

      const { result } = renderHook(() => useAuth(), {
        wrapper: createAuthWrapper(AuthStatus.LOGGED_OUT)
      });

      await act(async () => {
        await result.current.login({ email: 'test@example.com', password: 'password123' });
      });

      await waitFor(() => {
        expectAuthState(result, AuthStatus.LOGGED_IN, mockUser, true, false);
      });

      const loginCall = fetchMock.callHistory.calls().find(call => 
        call.url.includes('/auth/login')
      );
      expect(loginCall).toBeTruthy();
      expect(JSON.parse(loginCall?.options.body as string)).toEqual({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('should handle login failure', async () => {
      mockApiError('/auth/login', 401, 'Invalid credentials');
      mockApiError('/auth/refresh', 401, 'Session expired');

      const { result } = renderHook(() => useAuth(), {
        wrapper: createAuthWrapper(AuthStatus.LOGGED_OUT)
      });

      await act(async () => {
        await expect(result.current.login({ email: 'wrong@example.com', password: 'wrongpass' }))
          .rejects.toThrow(ApiError);
      });

      await waitFor(() => {
        expectAuthState(result, AuthStatus.LOGGED_OUT, null, false, false);
      });
    });

    it('should set loading state during login', async () => {
      const mockUser = createMockUser();
      
      fetchMock.route({
        url: 'path:/auth/login',
        allowRelativeUrls: true,
        delay: 100,
        response: { body: { data: mockUser } }
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createAuthWrapper(AuthStatus.LOGGED_OUT)
      });

      act(() => {
        result.current.login({ email: 'test@example.com', password: 'password123' });
      });

      expect(result.current.authStatus).toBe(AuthStatus.LOGGING_IN);
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expectAuthState(result, AuthStatus.LOGGED_IN, mockUser, true, false);
      });
    });
  });

  describe('logout', () => {
    it('should successfully logout user', async () => {
      const mockUser = createMockUser();
      mockApiSuccess('/auth/logout', { message: 'Logout successful' });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createAuthWrapper(AuthStatus.LOGGED_IN, mockUser)
      });

      await act(async () => {
        await result.current.logout();
      });

      await waitFor(() => {
        expectAuthState(result, AuthStatus.LOGGED_OUT, null, false, false);
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
      mockApiError('/auth/logout', 500, 'Server error');
      mockApiError('/auth/refresh', 401, 'Session expired');

      const { result } = renderHook(() => useAuth(), {
        wrapper: createAuthWrapper(AuthStatus.LOGGED_IN, mockUser)
      });

      await act(async () => {
        await result.current.logout().catch(() => {});
      });

      await waitFor(() => {
        expectAuthState(result, AuthStatus.LOGGED_IN, mockUser, true, false);
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
        wrapper: createAuthWrapper(AuthStatus.LOGGED_IN, mockUser)
      });

      act(() => {
        result.current.logout();
      });

      expect(result.current.authStatus).toBe(AuthStatus.LOGGING_OUT);
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expectAuthState(result, AuthStatus.LOGGED_OUT, null, false, false);
      });
    });
  });

  describe('computed properties', () => {
    it('should correctly calculate isLoading for different states', () => {
      const loadingStates = [
        AuthStatus.CHECKING,
        AuthStatus.LOGGING_IN,
        AuthStatus.LOGGING_OUT
      ];

      loadingStates.forEach(status => {
        const { result } = renderHook(() => useAuth(), {
          wrapper: createAuthWrapper(status)
        });

        expect(result.current.isLoading).toBe(true);
      });
    });

    const authenticationTests = [
      {
        name: 'should return true for isAuthenticated when logged in',
        status: AuthStatus.LOGGED_IN,
        user: createMockUser(),
        expectedAuth: true
      },
      {
        name: 'should return false for isAuthenticated when logged out',
        status: AuthStatus.LOGGED_OUT,
        user: null,
        expectedAuth: false
      }
    ];

    authenticationTests.forEach(({ name, status, user, expectedAuth }) => {
      it(name, () => {
        const { result } = renderHook(() => useAuth(), {
          wrapper: createAuthWrapper(status, user)
        });

        expect(result.current.isAuthenticated).toBe(expectedAuth);
      });
    });
  });
});