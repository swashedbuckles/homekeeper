import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { AppNavigation, DefaultAppNavigation, DesktopAppNavigation, MobileAppNavigation } from '../../../src/components/headers/AppNavigation';
import { NavItem } from '../../../src/components/headers/NavItem';
import { expectElementToHaveClasses } from '../../helpers/testHelpers';

// Mock useLocation and useNavigate for testing
const mockLocation = vi.fn();
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLocation: () => mockLocation(),
    useNavigate: () => mockNavigate
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AppNavigation', () => {
  // Helper function to setup test with location
  const setupTest = (pathname = '/dashboard', component?: React.ReactElement) => {
    mockLocation.mockReturnValue({ pathname });
    if (component) {
      return renderWithRouter(component);
    }
  };

  // Helper function to create standard nav setup
  const createStandardNav = (additionalProps = {}) => (
    <AppNavigation {...additionalProps}>
      <NavItem path="/dashboard">Dashboard</NavItem>
      <NavItem path="/settings">Settings</NavItem>
    </AppNavigation>
  );

  beforeEach(() => {
    mockLocation.mockClear();
    mockNavigate.mockClear();
  });

  describe('Composition Pattern', () => {
    const compositionTests = [
      {
        name: 'renders custom navigation items',
        test: () => {
          setupTest('/dashboard', createStandardNav());
          
          ['Dashboard', 'Settings'].forEach(item => {
            expect(screen.getByText(item)).toBeInTheDocument();
          });
        }
      },
      {
        name: 'supports custom className',
        test: () => {
          setupTest('/dashboard', createStandardNav({ className: 'custom-nav-class' }));
          
          const nav = screen.getByTestId('app-navigation');
          expect(nav).toHaveClass('custom-nav-class');
        }
      },
      {
        name: 'handles empty children gracefully',
        test: () => {
          setupTest('/dashboard', <AppNavigation />);
          
          expect(screen.queryByRole('button')).not.toBeInTheDocument();
        }
      }
    ];

    compositionTests.forEach(({ name, test }) => {
      it(name, test);
    });

    it('applies correct direction classes based on direction prop', () => {
      setupTest();
      
      // Test horizontal direction (default)
      const { rerender } = renderWithRouter(
        <AppNavigation>
          <NavItem path="/dashboard">Dashboard</NavItem>
        </AppNavigation>
      );
      
      let nav = screen.getByTestId('app-navigation');
      expectElementToHaveClasses(nav, ['flex', 'flex-row']);
      
      // Test vertical direction
      rerender(
        <BrowserRouter>
          <AppNavigation direction="vertical">
            <NavItem path="/dashboard">Dashboard</NavItem>
          </AppNavigation>
        </BrowserRouter>
      );
      
      nav = screen.getByTestId('app-navigation');
      expectElementToHaveClasses(nav, ['flex', 'flex-col']);
    });

    it('validates children and filters out invalid components', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      setupTest('/dashboard', 
        <AppNavigation>
          <NavItem path="/dashboard">Valid NavItem</NavItem>
          <div>Invalid Child</div>
        </AppNavigation>
      );
      
      // Valid component should render
      expect(screen.getByText('Valid NavItem')).toBeInTheDocument();
      
      // Invalid component should not render
      expect(screen.queryByText('Invalid Child')).not.toBeInTheDocument();
      
      // Should warn about invalid child
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('AppNavigation: Invalid child component <div>')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('NavItem Component', () => {
    const navItemTests = [
      {
        name: 'applies active classes to current page',
        pathname: '/dashboard',
        element: 'Dashboard',
        expectedClasses: ['text-primary', 'border-b-primary', 'font-black']
      },
      {
        name: 'applies inactive classes to non-current pages',
        pathname: '/dashboard',
        element: 'Settings',
        expectedClasses: ['text-text-secondary', 'border-b-transparent', 'font-bold']
      },
      {
        name: 'handles nested paths correctly',
        pathname: '/dashboard/settings',
        element: 'Dashboard',
        expectedClasses: ['text-primary', 'border-b-primary']
      }
    ];

    navItemTests.forEach(({ name, pathname, element, expectedClasses }) => {
      it(name, () => {
        setupTest(pathname, createStandardNav());
        
        const button = screen.getByText(element);
        expectElementToHaveClasses(button, expectedClasses);
      });
    });

    it('applies brutal transition classes to all buttons', () => {
      setupTest('/dashboard', createStandardNav());
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expectElementToHaveClasses(button, ['brutal-transition', 'uppercase', 'tracking-wider']);
      });
    });

    it('includes hover states for inactive tabs', () => {
      setupTest('/dashboard', createStandardNav());
      
      const settingsButton = screen.getByText('Settings');
      expectElementToHaveClasses(settingsButton, ['hover:text-primary', 'hover:border-b-primary/30']);
    });
  });

  describe('Navigation Functionality', () => {
    const setupNavigationTest = async (pathname = '/dashboard', nav = createStandardNav()) => {
      const user = userEvent.setup();
      setupTest(pathname, nav);
      return { user };
    };

    const navigationTests = [
      {
        name: 'navigates to the specified path when nav item is clicked',
        test: async () => {
          const { user } = await setupNavigationTest();
          
          const settingsButton = screen.getByText('Settings');
          await user.click(settingsButton);
          
          expect(mockNavigate).toHaveBeenCalledWith('/settings');
        }
      },
      {
        name: 'navigates even when onClick is not provided',
        test: async () => {
          const { user } = await setupNavigationTest();
          
          const dashboardButton = screen.getByText('Dashboard');
          await user.click(dashboardButton);
          
          expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        }
      }
    ];

    navigationTests.forEach(({ name, test }) => {
      it(name, test);
    });

    it('calls onClick handler when provided before navigating', async () => {
      const mockOnClick = vi.fn();
      const navWithHandler = (
        <AppNavigation>
          <NavItem path="/dashboard">Dashboard</NavItem>
          <NavItem path="/settings" onClick={mockOnClick}>Settings</NavItem>
        </AppNavigation>
      );
      const { user } = await setupNavigationTest('/dashboard', navWithHandler);
      
      const settingsButton = screen.getByText('Settings');
      await user.click(settingsButton);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/settings');
    });

    it('handles multiple nav items with different onClick handlers', async () => {
      const mockOnClickSettings = vi.fn();
      const mockOnClickDashboard = vi.fn();
      const navWithMultipleHandlers = (
        <AppNavigation>
          <NavItem path="/dashboard" onClick={mockOnClickDashboard}>Dashboard</NavItem>
          <NavItem path="/settings" onClick={mockOnClickSettings}>Settings</NavItem>
        </AppNavigation>
      );
      const { user } = await setupNavigationTest('/dashboard', navWithMultipleHandlers);
      
      // Click settings
      const settingsButton = screen.getByText('Settings');
      await user.click(settingsButton);
      
      expect(mockOnClickSettings).toHaveBeenCalledTimes(1);
      expect(mockOnClickDashboard).not.toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/settings');
      
      // Reset and click dashboard
      mockNavigate.mockClear();
      mockOnClickSettings.mockClear();
      
      const dashboardButton = screen.getByText('Dashboard');
      await user.click(dashboardButton);
      
      expect(mockOnClickDashboard).toHaveBeenCalledTimes(1);
      expect(mockOnClickSettings).not.toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('Navigation Component Variants', () => {
    const expectedTabs = ['Dashboard', 'Manuals', 'Maintenance', 'Analytics'];
    
    const navigationVariants = [
      {
        name: 'DefaultAppNavigation',
        component: DefaultAppNavigation,
        expectedLayout: null // No specific layout requirement
      },
      {
        name: 'DesktopAppNavigation',
        component: DesktopAppNavigation,
        expectedLayout: ['flex', 'flex-row']
      },
      {
        name: 'MobileAppNavigation',
        component: MobileAppNavigation,
        expectedLayout: ['flex', 'flex-col']
      }
    ];

    navigationVariants.forEach(({ name, component: Component, expectedLayout }) => {
      describe(name, () => {
        it('renders all default navigation tabs', () => {
          setupTest('/dashboard', <Component />);
          
          expectedTabs.forEach(tab => {
            expect(screen.getByText(tab)).toBeInTheDocument();
          });
        });

        if (expectedLayout) {
          it(`renders with ${expectedLayout.includes('flex-row') ? 'horizontal' : 'vertical'} layout`, () => {
            setupTest('/dashboard', <Component />);
            
            const nav = screen.getByTestId('app-navigation');
            expectElementToHaveClasses(nav, expectedLayout);
          });
        }

        it('maintains active state correctly', () => {
          setupTest('/manuals', <Component />);
          
          const manualsButton = screen.getByText('Manuals');
          expectElementToHaveClasses(manualsButton, ['text-primary', 'font-black']);
          
          const dashboardButton = screen.getByText('Dashboard');
          expectElementToHaveClasses(dashboardButton, ['text-text-secondary', 'font-bold']);
        });
      });
    });

    const pathActivationTests = [
      { pathname: '/maintenance/schedule', activeTab: 'Maintenance' },
      { pathname: '/analytics', activeTab: 'Analytics' }
    ];

    pathActivationTests.forEach(({ pathname, activeTab }) => {
      it(`activates ${activeTab} tab when on ${pathname} page`, () => {
        setupTest(pathname, <DefaultAppNavigation />);
        
        const activeButton = screen.getByText(activeTab);
        expectElementToHaveClasses(activeButton, ['text-primary', 'font-black']);
      });
    });
  });

});