import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthInitializer } from '../../src/context/AuthInitializer';
import { useAuth } from '../../src/hooks/useAuth';

// Mock the useAuth hook
vi.mock('../../src/hooks/useAuth');

const mockCheckAuth = vi.fn();
const mockUseAuth = vi.mocked(useAuth);

describe('AuthInitializer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      checkAuth: mockCheckAuth,
      authStatus: 'UNKNOWN',
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isKnown: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  it('should call checkAuth on mount', () => {
    render(
      <AuthInitializer>
        <div data-testid="child">Test Child</div>
      </AuthInitializer>
    );

    expect(mockCheckAuth).toHaveBeenCalledTimes(1);
  });

  it('should render children', () => {
    const { getByTestId } = render(
      <AuthInitializer>
        <div data-testid="child">Test Child</div>
      </AuthInitializer>
    );

    expect(getByTestId('child')).toHaveTextContent('Test Child');
  });

  it('should only call checkAuth once even if re-rendered', () => {
    const { rerender } = render(
      <AuthInitializer>
        <div>Initial</div>
      </AuthInitializer>
    );

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