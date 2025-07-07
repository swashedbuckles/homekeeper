import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthStatus } from '../../../src/lib/types/authStatus';
import { ProfileButton } from '../../../src/components/headers/ProfileButton';
import { renderWithAuth } from '../../helpers/testProviderUtils';
import { createMockUser } from '../../helpers/testUtils';

describe('ProfileButton', () => {
  const mockSetIsOpen = vi.fn();
  
  beforeEach(() => {
    mockSetIsOpen.mockClear();
  });

  it('renders user initial when user is authenticated', () => {
    const mockUser = createMockUser({ name: 'John Doe' });
    
    renderWithAuth(
      <ProfileButton isOpen={false} setIsOpen={mockSetIsOpen} />,
      { authStatus: AuthStatus.LOGGED_IN, user: mockUser }
    );
    
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders User icon when no user name available', () => {
    const mockUser = createMockUser({ name: '' });
    
    const { container } = renderWithAuth(
      <ProfileButton isOpen={false} setIsOpen={mockSetIsOpen} />,
      { authStatus: AuthStatus.LOGGED_IN, user: mockUser }
    );
    
    // Lucide User icon should be rendered (it's an SVG)
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders User icon when user is not authenticated', () => {
    const { container } = renderWithAuth(
      <ProfileButton isOpen={false} setIsOpen={mockSetIsOpen} />,
      { authStatus: AuthStatus.LOGGED_OUT, user: null }
    );
    
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('calls setIsOpen when clicked', () => {
    const mockUser = createMockUser();
    
    renderWithAuth(
      <ProfileButton isOpen={false} setIsOpen={mockSetIsOpen} />,
      { authStatus: AuthStatus.LOGGED_IN, user: mockUser }
    );
    
    const button = screen.getByLabelText('Toggle menu');
    fireEvent.click(button);
    
    expect(mockSetIsOpen).toHaveBeenCalledTimes(1);
    expect(mockSetIsOpen).toHaveBeenCalledWith(true);
  });

  it('toggles isOpen state correctly', () => {
    const mockUser = createMockUser();
    
    renderWithAuth(
      <ProfileButton isOpen={true} setIsOpen={mockSetIsOpen} />,
      { authStatus: AuthStatus.LOGGED_IN, user: mockUser }
    );
    
    const button = screen.getByLabelText('Toggle menu');
    fireEvent.click(button);
    
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it('applies responsive size classes', () => {
    const mockUser = createMockUser();
    
    renderWithAuth(
      <ProfileButton isOpen={false} setIsOpen={mockSetIsOpen} />,
      { authStatus: AuthStatus.LOGGED_IN, user: mockUser }
    );
    
    const button = screen.getByLabelText('Toggle menu');
    expect(button).toHaveClass('w-10', 'h-10', 'md:w-12', 'md:h-12');
  });

  it('applies brutal styling classes', () => {
    const mockUser = createMockUser();
    
    renderWithAuth(
      <ProfileButton isOpen={false} setIsOpen={mockSetIsOpen} />,
      { authStatus: AuthStatus.LOGGED_IN, user: mockUser }
    );
    
    const button = screen.getByLabelText('Toggle menu');
    expect(button).toHaveClass(
      'brutal-rotate-right',
      'brutal-transition',
      'brutal-hover-press-small',
      'brutal-shadow-accent-sm',
      'bg-primary',
      'border-3',
      'md:border-4',
      'border-white'
    );
  });

  it('has correct accessibility attributes', () => {
    const mockUser = createMockUser();
    
    renderWithAuth(
      <ProfileButton isOpen={false} setIsOpen={mockSetIsOpen} />,
      { authStatus: AuthStatus.LOGGED_IN, user: mockUser }
    );
    
    const button = screen.getByLabelText('Toggle menu');
    expect(button).toHaveAttribute('aria-label', 'Toggle menu');
  });
});