import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';

import { AuthRouteGuard } from '../../../src/components/auth/AuthRouteGuard';
import { AuthStatus } from '../../../src/lib/types/authStatus';

// Mock Navigate component to track redirects
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    Navigate: ({ to, replace }: { to: string; replace?: boolean }) => {
      mockNavigate(to, replace);
      return <div data-testid="navigate">Redirecting to {to}</div>;
    },
  };
});

// Mock useAuth hook
const mockUseAuth = vi.fn();
vi.mock('../../../src/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

// Helper function to render AuthRouteGuard with props
const renderAuthRouteGuard = (authState: any, props: any = {}, children = <div>Content</div>) => {
  mockUseAuth.mockReturnValue(authState);
  return render(
    <MemoryRouter>
      <AuthRouteGuard {...props}>
        {children}
      </AuthRouteGuard>
    </MemoryRouter>
  );
};

// Helper function to create mock auth state
const createMockAuthState = (authStatus: string, isLoading = false) => ({
  authStatus,
  isLoading,
});

describe('AuthRouteGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('PROD', true);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  })

  describe('prop validation', () => {
    const propValidationTests = [
      {
        name: 'should throw error when neither requireAuth nor publicRoute is specified',
        props: {},
        expectedError: 'You did not configure route guard properly'
      },
      {
        name: 'should throw error when both requireAuth and publicRoute are specified',
        props: { requireAuth: true, publicRoute: true },
        expectedError: 'You did not configure route guard properly'
      }
    ];

    propValidationTests.forEach(({ name, props, expectedError }) => {
      it(name, () => {
        const authState = createMockAuthState(AuthStatus.LOGGED_IN, false);
        
        expect(() => {
          renderAuthRouteGuard(authState, props);
        }).toThrow(expectedError);
      });
    });
  });

  describe('loading states', () => {
    const loadingStates = [
      AuthStatus.CHECKING,
      AuthStatus.LOGGING_IN,
      AuthStatus.LOGGING_OUT,
    ];

    loadingStates.forEach(status => {
      it(`should show loading spinner for ${status} status`, () => {
        const authState = createMockAuthState(status, true);
        const protectedContent = <div>Protected Content</div>;
        
        renderAuthRouteGuard(authState, { requireAuth: true }, protectedContent);

        expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      });
    });
  });

  describe('requireAuth routes', () => {
    const requireAuthTests = [
      {
        name: 'should render children when authenticated',
        authStatus: AuthStatus.LOGGED_IN,
        expectRedirect: false,
        expectedContent: 'Protected Content'
      },
      {
        name: 'should redirect to home when not authenticated',
        authStatus: AuthStatus.LOGGED_OUT,
        expectRedirect: true,
        redirectTarget: '/',
        expectedRedirectText: 'Redirecting to /'
      }
    ];

    requireAuthTests.forEach(({ name, authStatus, expectRedirect, expectedContent, redirectTarget, expectedRedirectText }) => {
      it(name, () => {
        const authState = createMockAuthState(authStatus, false);
        const protectedContent = <div>Protected Content</div>;
        
        renderAuthRouteGuard(authState, { requireAuth: true }, protectedContent);

        if (expectRedirect) {
          expect(screen.getByTestId('navigate')).toBeInTheDocument();
          expect(screen.getByText(expectedRedirectText!)).toBeInTheDocument();
          expect(mockNavigate).toHaveBeenCalledWith(redirectTarget, true);
          expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
        } else {
          expect(screen.getByText(expectedContent!)).toBeInTheDocument();
          expect(mockNavigate).not.toHaveBeenCalled();
        }
      });
    });
  });

  describe('publicRoute routes', () => {
    const publicRouteTests = [
      {
        name: 'should render children when not authenticated',
        authStatus: AuthStatus.LOGGED_OUT,
        expectRedirect: false,
        expectedContent: 'Public Content'
      },
      {
        name: 'should redirect to dashboard when authenticated',
        authStatus: AuthStatus.LOGGED_IN,
        expectRedirect: true,
        redirectTarget: '/dashboard',
        expectedRedirectText: 'Redirecting to /dashboard'
      }
    ];

    publicRouteTests.forEach(({ name, authStatus, expectRedirect, expectedContent, redirectTarget, expectedRedirectText }) => {
      it(name, () => {
        const authState = createMockAuthState(authStatus, false);
        const publicContent = <div>Public Content</div>;
        
        renderAuthRouteGuard(authState, { publicRoute: true }, publicContent);

        if (expectRedirect) {
          expect(screen.getByTestId('navigate')).toBeInTheDocument();
          expect(screen.getByText(expectedRedirectText!)).toBeInTheDocument();
          expect(mockNavigate).toHaveBeenCalledWith(redirectTarget, true);
          expect(screen.queryByText('Public Content')).not.toBeInTheDocument();
        } else {
          expect(screen.getByText(expectedContent!)).toBeInTheDocument();
          expect(mockNavigate).not.toHaveBeenCalled();
        }
      });
    });
  });

  describe('edge cases', () => {
    it('should handle UNKNOWN status as loading', () => {
      const authState = createMockAuthState(AuthStatus.UNKNOWN, true);
      const protectedContent = <div>Protected Content</div>;
      
      renderAuthRouteGuard(authState, { requireAuth: true }, protectedContent);

      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });
});