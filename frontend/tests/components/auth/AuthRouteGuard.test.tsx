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

// Mock useAuth hook
const mockUseAuth = vi.fn();
vi.mock('../../../src/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('AuthRouteGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('prop validation', () => {
    it('should throw error when neither requireAuth nor publicRoute is specified', () => {
      mockUseAuth.mockReturnValue({
        authStatus: AuthStatus.LOGGED_IN,
        isLoading: false,
      });

      expect(() => {
        render(
          <MemoryRouter>
            <AuthRouteGuard>
              <div>Content</div>
            </AuthRouteGuard>
          </MemoryRouter>
        );
      }).toThrow('You did not configure route guard properly');
    });

    it('should throw error when both requireAuth and publicRoute are specified', () => {
      mockUseAuth.mockReturnValue({
        authStatus: AuthStatus.LOGGED_IN,
        isLoading: false,
      });

      expect(() => {
        render(
          <MemoryRouter>
            <AuthRouteGuard requireAuth publicRoute>
              <div>Content</div>
            </AuthRouteGuard>
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
        mockUseAuth.mockReturnValue({
          authStatus: status,
          isLoading: true,
        });

        render(
          <MemoryRouter>
            <AuthRouteGuard requireAuth>
              <div>Protected Content</div>
            </AuthRouteGuard>
          </MemoryRouter>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      });
    });
  });

  describe('requireAuth routes', () => {
    it('should render children when authenticated', () => {
      mockUseAuth.mockReturnValue({
        authStatus: AuthStatus.LOGGED_IN,
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <AuthRouteGuard requireAuth>
            <div>Protected Content</div>
          </AuthRouteGuard>
        </MemoryRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should redirect to home when not authenticated', () => {
      mockUseAuth.mockReturnValue({
        authStatus: AuthStatus.LOGGED_OUT,
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <AuthRouteGuard requireAuth>
            <div>Protected Content</div>
          </AuthRouteGuard>
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
      mockUseAuth.mockReturnValue({
        authStatus: AuthStatus.LOGGED_OUT,
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <AuthRouteGuard publicRoute>
            <div>Public Content</div>
          </AuthRouteGuard>
        </MemoryRouter>
      );

      expect(screen.getByText('Public Content')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should redirect to dashboard when authenticated', () => {
      mockUseAuth.mockReturnValue({
        authStatus: AuthStatus.LOGGED_IN,
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <AuthRouteGuard publicRoute>
            <div>Public Content</div>
          </AuthRouteGuard>
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
      mockUseAuth.mockReturnValue({
        authStatus: AuthStatus.UNKNOWN,
        isLoading: true, // UNKNOWN should be treated as loading
      });

      render(
        <MemoryRouter>
          <AuthRouteGuard requireAuth>
            <div>Protected Content</div>
          </AuthRouteGuard>
        </MemoryRouter>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });
});