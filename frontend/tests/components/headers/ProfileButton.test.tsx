import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthStatus } from '../../../src/lib/types/authStatus';
import { ProfileButton } from '../../../src/components/headers/ProfileButton';
import { renderWithAuth } from '../../helpers/testProviderUtils';
import { createMockUser } from '../../helpers/testUtils';

// Helper function to render ProfileButton with auth context
const renderProfileButton = (props = {}, authOverrides = {}) => {
  const defaultProps = {
    isOpen: false,
    setIsOpen: vi.fn()
  };
  const defaultAuth = {
    authStatus: AuthStatus.LOGGED_IN,
    user: createMockUser()
  };
  
  return renderWithAuth(
    <ProfileButton {...defaultProps} {...props} />,
    { ...defaultAuth, ...authOverrides }
  );
};

// Helper function to get profile button
const getProfileButton = () => screen.getByLabelText('Toggle menu');

describe('ProfileButton', () => {
  const mockSetIsOpen = vi.fn();
  
  beforeEach(() => {
    mockSetIsOpen.mockClear();
  });

  const renderingTests = [
    {
      name: 'renders user initial when user is authenticated',
      authOverrides: { user: createMockUser({ name: 'John Doe' }) },
      expectation: () => expect(screen.getByText('J')).toBeInTheDocument()
    },
    {
      name: 'renders User icon when no user name available',
      authOverrides: { user: createMockUser({ name: '' }) },
      expectation: (container: HTMLElement) => expect(container.querySelector('svg')).toBeInTheDocument()
    },
    {
      name: 'renders User icon when user is not authenticated',
      authOverrides: { authStatus: AuthStatus.LOGGED_OUT, user: null },
      expectation: (container: HTMLElement) => expect(container.querySelector('svg')).toBeInTheDocument()
    }
  ];

  renderingTests.forEach(({ name, authOverrides, expectation }) => {
    it(name, () => {
      const { container } = renderProfileButton({}, authOverrides);
      expectation(container);
    });
  });

  const toggleTests = [
    {
      name: 'calls setIsOpen with true when clicked while closed',
      isOpen: false,
      expectedCall: true
    },
    {
      name: 'calls setIsOpen with false when clicked while open',
      isOpen: true,
      expectedCall: false
    }
  ];

  toggleTests.forEach(({ name, isOpen, expectedCall }) => {
    it(name, () => {
      renderProfileButton({ isOpen, setIsOpen: mockSetIsOpen });
      const button = getProfileButton();
      fireEvent.click(button);
      
      expect(mockSetIsOpen).toHaveBeenCalledTimes(1);
      expect(mockSetIsOpen).toHaveBeenCalledWith(expectedCall);
    });
  });

  const stylingTests = [
    {
      name: 'applies responsive size classes',
      expectedClasses: ['w-10', 'h-10', 'md:w-12', 'md:h-12']
    },
    {
      name: 'applies brutal styling classes',
      expectedClasses: [
        'brutal-rotate-right', 'brutal-transition', 'brutal-hover-press-small',
        'brutal-shadow-accent-sm', 'bg-primary', 'border-brutal-md', 'border-white'
      ]
    }
  ];

  stylingTests.forEach(({ name, expectedClasses }) => {
    it(name, () => {
      renderProfileButton();
      const button = getProfileButton();
      expectedClasses.forEach(className => {
        expect(button).toHaveClass(className);
      });
    });
  });

  it('has correct accessibility attributes', () => {
    renderProfileButton();
    const button = getProfileButton();
    expect(button).toHaveAttribute('aria-label', 'Toggle menu');
  });
});