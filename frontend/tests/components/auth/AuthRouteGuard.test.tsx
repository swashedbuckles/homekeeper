import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';

import { AuthRouteGuard } from '../../../src/components/auth/AuthRouteGuard';
import { AuthStatus } from '../../../src/lib/types/authStatus';
import { TestAuthProvider } from '../../helpers/testProviderUtils';
import { createMockUser } from '../../helpers/testUtils';

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

describe('AuthRouteGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('prop validation', () => {
    it('should throw error when neither requireAuth nor publicRoute is specified', () => {
      expect(() => {
        render(
          <MemoryRouter>
            <TestAuthProvider initialAuthStatus={AuthStatus.LOGGED_IN}>
              <AuthRouteGuard>
                <div>Content</div>
              </AuthRouteGuard>
            </TestAuthProvider>
          </MemoryRouter>
        );
      }).toThrow('You did not configure route guard properly');
    });

    it('should throw error when both requireAuth and publicRoute are specified', () => {
      expect(() => {
        render(
          <MemoryRouter>
            <TestAuthProvider initialAuthStatus={AuthStatus.LOGGED_IN}>
              <AuthRouteGuard requireAuth publicRoute>
                <div>Content</div>
              </AuthRouteGuard>
            </TestAuthProvider>
          </MemoryRouter>
        );
      }).toThrow('You did not configure route guard properly');
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
        render(
          <MemoryRouter>
            <TestAuthProvider initialAuthStatus={status}>
              <AuthRouteGuard requireAuth>
                <div>Protected Content</div>
              </AuthRouteGuard>
            </TestAuthProvider>
          </MemoryRouter>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      });
    });
  });

  describe('requireAuth routes', () => {
    it('should render children when authenticated', () => {
      const mockUser = createMockUser();

      render(
        <MemoryRouter>
          <TestAuthProvider 
            initialAuthStatus={AuthStatus.LOGGED_IN}
            initialUser={mockUser}
          >
            <AuthRouteGuard requireAuth>
              <div>Protected Content</div>
            </AuthRouteGuard>
          </TestAuthProvider>
        </MemoryRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should redirect to home when not authenticated', () => {
      render(
        <MemoryRouter>
          <TestAuthProvider initialAuthStatus={AuthStatus.LOGGED_OUT}>
            <AuthRouteGuard requireAuth>
              <div>Protected Content</div>
            </AuthRouteGuard>
          </TestAuthProvider>
        </MemoryRouter>
      );

      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      expect(screen.getByText('Redirecting to /')).toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith('/', true);
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('publicRoute routes', () => {
    it('should render children when not authenticated', () => {
      render(
        <MemoryRouter>
          <TestAuthProvider initialAuthStatus={AuthStatus.LOGGED_OUT}>
            <AuthRouteGuard publicRoute>
              <div>Public Content</div>
            </AuthRouteGuard>
          </TestAuthProvider>
        </MemoryRouter>
      );

      expect(screen.getByText('Public Content')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should redirect to dashboard when authenticated', () => {
      const mockUser = createMockUser();

      render(
        <MemoryRouter>
          <TestAuthProvider 
            initialAuthStatus={AuthStatus.LOGGED_IN}
            initialUser={mockUser}
          >
            <AuthRouteGuard publicRoute>
              <div>Public Content</div>
            </AuthRouteGuard>
          </TestAuthProvider>
        </MemoryRouter>
      );

      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      expect(screen.getByText('Redirecting to /dashboard')).toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', true);
      expect(screen.queryByText('Public Content')).not.toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle UNKNOWN status as loading', () => {
      render(
        <MemoryRouter>
          <TestAuthProvider initialAuthStatus={AuthStatus.UNKNOWN}>
            <AuthRouteGuard requireAuth>
              <div>Protected Content</div>
            </AuthRouteGuard>
          </TestAuthProvider>
        </MemoryRouter>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });
});