import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthInitializer } from '../../src/context/AuthInitializer';
import { useAuth } from '../../src/hooks/useAuth';

// Mock the useAuth hook
vi.mock('../../src/hooks/useAuth');

const mockCheckAuth = vi.fn();
const mockUseAuth = vi.mocked(useAuth);

// Helper function to create mock auth state
const createMockAuthState = (overrides = {}) => ({
  checkAuth: mockCheckAuth,
  authStatus: 'UNKNOWN' as const,
  user: null,
  isLoading: false,
  isAuthenticated: false,
  isKnown: false,
  login: vi.fn(),
  logout: vi.fn(),
  ...overrides
});

// Helper function to render AuthInitializer with children
const renderAuthInitializer = (children: React.ReactNode, authStateOverrides = {}) => {
  mockUseAuth.mockReturnValue(createMockAuthState(authStateOverrides));
  return render(<AuthInitializer>{children}</AuthInitializer>);
};

describe('AuthInitializer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const authInitializerTests = [
    {
      name: 'should call checkAuth on mount',
      children: <div data-testid="child">Test Child</div>,
      assertion: () => {
        expect(mockCheckAuth).toHaveBeenCalledTimes(1);
      }
    },
    {
      name: 'should render children',
      children: <div data-testid="child">Test Child</div>,
      assertion: (getByTestId: any) => {
        expect(getByTestId('child')).toHaveTextContent('Test Child');
      }
    }
  ];

  authInitializerTests.forEach(({ name, children, assertion }) => {
    it(name, () => {
      const result = renderAuthInitializer(children);
      assertion(result.getByTestId);
    });
  });

  it('should only call checkAuth once even if re-rendered', () => {
    const { rerender } = renderAuthInitializer(<div>Initial</div>);

    expect(mockCheckAuth).toHaveBeenCalledTimes(1);

    rerender(
      <AuthInitializer>
        <div>Updated</div>
      </AuthInitializer>
    );

    // Should still only be called once due to empty dependency array
    expect(mockCheckAuth).toHaveBeenCalledTimes(1);
  });
});