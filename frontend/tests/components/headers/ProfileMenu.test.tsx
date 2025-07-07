import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthStatus } from '../../../src/lib/types/authStatus';
import { ProfileMenu } from '../../../src/components/headers/ProfileMenu';
import { renderWithAuth } from '../../helpers/testProviderUtils';
import { createMockUser } from '../../helpers/testUtils';

// Mock household hook
const mockUseHousehold = vi.fn();
vi.mock('../../../src/hooks/useHousehold', () => ({
  useHousehold: () => mockUseHousehold()
}));

describe('ProfileMenu', () => {
  beforeEach(() => {
    mockUseHousehold.mockClear();
  });

  it('displays user name and household when available', () => {
    const mockUser = createMockUser({ name: 'John Doe' });
    const mockHousehold = { id: 'house-1', name: 'The Doe Family' };
    
    mockUseHousehold.mockReturnValue({ activeHousehold: mockHousehold });
    
    renderWithAuth(
      <ProfileMenu />,
      { authStatus: AuthStatus.LOGGED_IN, user: mockUser }
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('The Doe Family')).toBeInTheDocument();
  });

  it('displays fallback text when user name is not available', () => {
    // const mockUser = createMockUser({ name: '' });
    
    mockUseHousehold.mockReturnValue({ activeHousehold: null });
    
    renderWithAuth(
      <ProfileMenu />,
      { authStatus: AuthStatus.LOGGED_IN, user: null }
    );
    
    expect(screen.getByText('NAME')).toBeInTheDocument();
    expect(screen.getByText('HOUSEHOLD')).toBeInTheDocument();
  });

  it('displays fallback text when no user is authenticated', () => {
    mockUseHousehold.mockReturnValue({ activeHousehold: null });
    
    renderWithAuth(
      <ProfileMenu />,
      { authStatus: AuthStatus.LOGGED_OUT, user: null }
    );
    
    expect(screen.getByText('NAME')).toBeInTheDocument();
    expect(screen.getByText('HOUSEHOLD')).toBeInTheDocument();
  });

  it('renders all menu items', () => {
    const mockUser = createMockUser();
    mockUseHousehold.mockReturnValue({ activeHousehold: null });
    
    renderWithAuth(
      <ProfileMenu />,
      { authStatus: AuthStatus.LOGGED_IN, user: mockUser }
    );
    
    expect(screen.getByText('Switch Household')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('renders icons for each menu item', () => {
    const mockUser = createMockUser();
    mockUseHousehold.mockReturnValue({ activeHousehold: null });
    
    const { container } = renderWithAuth(
      <ProfileMenu />,
      { authStatus: AuthStatus.LOGGED_IN, user: mockUser }
    );
    
    // Check that Lucide icons are rendered (they are SVG elements)
    const svgIcons = container.querySelectorAll('svg');
    expect(svgIcons.length).toBe(3); // House, Settings, LogOut icons
  });

  it('applies correct styling classes to container', () => {
    const mockUser = createMockUser();
    mockUseHousehold.mockReturnValue({ activeHousehold: null });
    
    const { container } = renderWithAuth(
      <ProfileMenu />,
      { authStatus: AuthStatus.LOGGED_IN, user: mockUser }
    );
    
    const menuContainer = container.firstChild as HTMLElement;
    expect(menuContainer).toHaveClass(
      'bg-white',
      'border-4',
      'border-text-primary',
      'md:brutal-shadow-secondary',
      'md:brutal-rotate-tiny-right',
      'md:min-w-60'
    );
  });

  it('applies correct styling to header section', () => {
    const mockUser = createMockUser({ name: 'Test User' });
    mockUseHousehold.mockReturnValue({ activeHousehold: { name: 'Test House' } });
    
    renderWithAuth(
      <ProfileMenu />,
      { authStatus: AuthStatus.LOGGED_IN, user: mockUser }
    );
    
    const header = screen.getByText('Test User').closest('div');
    expect(header).toHaveClass(
      'bg-primary',
      'text-white',
      'border-b-4',
      'border-b-text-primary',
      'p-4',
      'font-black',
      'uppercase'
    );
  });

  it('applies correct styling to menu items', () => {
    const mockUser = createMockUser();
    mockUseHousehold.mockReturnValue({ activeHousehold: null });
    
    renderWithAuth(
      <ProfileMenu />,
      { authStatus: AuthStatus.LOGGED_IN, user: mockUser }
    );
    
    const switchHouseholdItem = screen.getByText('Switch Household').closest('div');
    expect(switchHouseholdItem).toHaveClass(
      'px-4',
      'py-3.5',
      'border-b-2',
      'border-b-background',
      'font-bold',
      'uppercase',
      'text-text-primary',
      'cursor-pointer',
      'brutal-transition',
      'flex',
      'items-center',
      'gap-3'
    );
  });

  it('applies special styling to logout item', () => {
    const mockUser = createMockUser();
    mockUseHousehold.mockReturnValue({ activeHousehold: null });
    
    renderWithAuth(
      <ProfileMenu />,
      { authStatus: AuthStatus.LOGGED_IN, user: mockUser }
    );
    
    const logoutItem = screen.getByText('Logout').closest('div');
    expect(logoutItem).toHaveClass(
      'bg-error',
      'text-white',
      'border-t-4',
      'border-t-text-primary',
      'hover:bg-red-800'
    );
  });

  it('renders divider between menu sections', () => {
    const mockUser = createMockUser();
    mockUseHousehold.mockReturnValue({ activeHousehold: null });
    
    const { container } = renderWithAuth(
      <ProfileMenu />,
      { authStatus: AuthStatus.LOGGED_IN, user: mockUser }
    );
    
    const divider = container.querySelector('.h-1.bg-text-primary');
    expect(divider).toBeInTheDocument();
  });
});