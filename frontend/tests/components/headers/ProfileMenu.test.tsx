import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { AuthStatus } from '../../../src/lib/types/authStatus';
import { ProfileMenu } from '../../../src/components/headers/ProfileMenu';
import { renderWithAuth } from '../../helpers/testProviderUtils';
import { createMockUser } from '../../helpers/testUtils';
import { expectElementToHaveClasses } from '../../helpers/testHelpers';
import { useAuth } from '../../../src/hooks/useAuth';

// Mock household hook, react-router, and useAuth
const mockUseHousehold = vi.fn();
const mockNavigate = vi.fn();
const mockLogout = vi.fn();
const mockUseAuth = vi.mocked(useAuth);

vi.mock('../../../src/hooks/useHousehold', () => ({
  useHousehold: () => mockUseHousehold()
}));

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate
}));

// We'll mock useAuth to return our mock logout but still allow the test to control the user
vi.mock('../../../src/hooks/useAuth', () => ({
  useAuth: vi.fn()
}));

describe('ProfileMenu', () => {
  // Helper function to create consistent auth mock
  const createAuthMock = (user: any = null, authStatus: typeof AuthStatus[keyof typeof AuthStatus] = AuthStatus.LOGGED_OUT) => ({
    user,
    logout: mockLogout,
    authStatus,
    checkAuth: vi.fn(),
    login: vi.fn(),
    isLoading: false,
    isKnown: false,
    isAuthenticated: false
  });

  // Helper function to setup test with user and household
  const setupTest = ({
    user = null,
    authStatus = AuthStatus.LOGGED_OUT,
    household = null
  }: {
    user?: any;
    authStatus?: typeof AuthStatus[keyof typeof AuthStatus];
    household?: any;
  } = {}) => {
    mockUseHousehold.mockReturnValue({ activeHousehold: household });
    mockUseAuth.mockReturnValue(createAuthMock(user, authStatus));
    return renderWithAuth(
      <ProfileMenu />,
      { authStatus, user }
    );
  };

  beforeEach(() => {
    mockUseHousehold.mockClear();
    mockNavigate.mockClear();
    mockLogout.mockClear();
    
    // Default mock setup for useAuth
    mockUseAuth.mockReturnValue(createAuthMock());
  });

  describe('User Display', () => {
    const displayTests = [
      {
        name: 'displays user name and household when available',
        setup: {
          user: createMockUser({ name: 'John Doe' }),
          authStatus: AuthStatus.LOGGED_IN,
          household: { id: 'house-1', name: 'The Doe Family' }
        },
        expectedTexts: ['John Doe', 'The Doe Family']
      },
      {
        name: 'displays fallback text when user name is not available',
        setup: { authStatus: AuthStatus.LOGGED_IN, user: null },
        expectedTexts: ['NAME', 'HOUSEHOLD']
      },
      {
        name: 'displays fallback text when no user is authenticated',
        setup: {}, // Uses defaults: LOGGED_OUT, user: null
        expectedTexts: ['NAME', 'HOUSEHOLD']
      }
    ];

    displayTests.forEach(({ name, setup, expectedTexts }) => {
      it(name, () => {
        setupTest(setup);
        
        expectedTexts.forEach(text => {
          expect(screen.getByText(text)).toBeInTheDocument();
        });
      });
    });
  });

  describe('Menu Items', () => {
    const menuTests = [
      {
        name: 'renders all menu items',
        test: () => {
          const mockUser = createMockUser();
          setupTest({ user: mockUser, authStatus: AuthStatus.LOGGED_IN });
          
          ['Switch Household', 'Settings', 'Logout'].forEach(item => {
            expect(screen.getByText(item)).toBeInTheDocument();
          });
        }
      },
      {
        name: 'renders icons for each menu item',
        test: () => {
          const mockUser = createMockUser();
          const { container } = setupTest({ user: mockUser, authStatus: AuthStatus.LOGGED_IN });
          
          // Check that Lucide icons are rendered (they are SVG elements)
          const svgIcons = container.querySelectorAll('svg');
          expect(svgIcons.length).toBe(3); // House, Settings, LogOut icons
        }
      }
    ];

    menuTests.forEach(({ name, test }) => {
      it(name, test);
    });

    it('renders divider between menu sections', () => {
      const mockUser = createMockUser();
      const { container } = setupTest({ user: mockUser, authStatus: AuthStatus.LOGGED_IN });
      
      const divider = container.querySelector('.h-1.bg-text-primary');
      expect(divider).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    const stylingTests = [
      {
        name: 'applies correct styling classes to container',
        selector: (container: HTMLElement) => container.firstChild as HTMLElement,
        expectedClasses: [
          'bg-white', 'border-4', 'border-text-primary', 
          'md:brutal-shadow-secondary', 'md:brutal-rotate-tiny-right', 'md:min-w-60'
        ]
      },
      {
        name: 'applies correct styling to header section',
        selector: () => screen.getByText('Test User').closest('div') as HTMLElement,
        setupData: { name: 'Test User', householdName: 'Test House' },
        expectedClasses: [
          'bg-primary', 'text-white', 'border-b-4', 'border-b-text-primary', 
          'p-4', 'font-black', 'uppercase'
        ]
      },
      {
        name: 'applies correct styling to menu items',
        selector: () => screen.getByText('Switch Household').closest('div') as HTMLElement,
        expectedClasses: [
          'px-4', 'py-3.5', 'border-b-2', 'border-b-background',
          'font-bold', 'uppercase', 'text-text-primary', 'cursor-pointer',
          'brutal-transition', 'flex', 'items-center', 'gap-3'
        ]
      },
      {
        name: 'applies special styling to logout item',
        selector: () => screen.getByText('Logout').closest('div') as HTMLElement,
        expectedClasses: [
          'bg-error', 'text-white', 'border-t-4', 
          'border-t-text-primary', 'hover:bg-red-800'
        ]
      }
    ];

    stylingTests.forEach(({ name, selector, expectedClasses, setupData }) => {
      it(name, () => {
        const mockUser = createMockUser(setupData ? { name: setupData.name } : {});
        const household = setupData?.householdName ? { name: setupData.householdName } : null;
        
        const { container } = setupTest({
          user: mockUser,
          authStatus: AuthStatus.LOGGED_IN,
          household
        });
        
        const element = typeof selector === 'function' && selector.length === 0 
          ? (selector as () => HTMLElement)() 
          : (selector as (container: HTMLElement) => HTMLElement)(container);
        expectElementToHaveClasses(element, expectedClasses);
      });
    });
  });

  describe('Navigation Functionality', () => {
    it('navigates to settings when settings item is clicked', async () => {
      const user = userEvent.setup();
      const mockUser = createMockUser();
      
      setupTest({ user: mockUser, authStatus: AuthStatus.LOGGED_IN });
      
      const settingsItem = screen.getByText('Settings');
      await user.click(settingsItem);
      
      expect(mockNavigate).toHaveBeenCalledWith('/settings');
    });
  });

  describe('Logout Modal Functionality', () => {
    const setupModalTest = async () => {
      const user = userEvent.setup();
      const mockUser = createMockUser();
      
      setupTest({ user: mockUser, authStatus: AuthStatus.LOGGED_IN });
      
      const logoutItem = screen.getByText('Logout');
      await user.click(logoutItem);
      
      return { user, mockUser };
    };

    const modalTests = [
      {
        name: 'shows modal when logout is clicked',
        test: async () => {
          await setupModalTest();
          
          expect(screen.getByText('Confirm Logout')).toBeInTheDocument();
          expect(screen.getByText('Are you sure you want to logout? We\'ll miss you!')).toBeInTheDocument();
          expect(screen.getByText('Cancel')).toBeInTheDocument();
          expect(screen.getByText('Confirm')).toBeInTheDocument();
        }
      },
      {
        name: 'closes modal when cancel is clicked',
        test: async () => {
          const { user } = await setupModalTest();
          
          expect(screen.getByText('Confirm Logout')).toBeInTheDocument();
          
          const cancelButton = screen.getByText('Cancel');
          await user.click(cancelButton);
          
          expect(screen.queryByText('Confirm Logout')).not.toBeInTheDocument();
        }
      },
      {
        name: 'calls logout and closes modal when confirm is clicked',
        test: async () => {
          const { user } = await setupModalTest();
          
          expect(screen.getByText('Confirm Logout')).toBeInTheDocument();
          
          const confirmButton = screen.getByText('Confirm');
          await user.click(confirmButton);
          
          expect(mockLogout).toHaveBeenCalledTimes(1);
          expect(screen.queryByText('Confirm Logout')).not.toBeInTheDocument();
        }
      },
      {
        name: 'modal has correct accessibility attributes',
        test: async () => {
          await setupModalTest();
          
          const modal = screen.getByRole('dialog');
          expect(modal).toHaveAttribute('aria-modal', 'true');
          expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
        }
      }
    ];

    modalTests.forEach(({ name, test }) => {
      it(name, test);
    });
  });
});