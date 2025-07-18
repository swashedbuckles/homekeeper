import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router';
import { AppNavigation, DefaultAppNavigation, DesktopAppNavigation, MobileAppNavigation } from '../../../src/components/headers/AppNavigation';
import { NavItem } from '../../../src/components/headers/NavItem';

// Mock useLocation to control current path
const mockLocation = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLocation: () => mockLocation()
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
  beforeEach(() => {
    mockLocation.mockClear();
  });

  describe('Composition Pattern', () => {
    it('renders custom navigation items', () => {
      mockLocation.mockReturnValue({ pathname: '/dashboard' });
      
      renderWithRouter(
        <AppNavigation>
          <NavItem path="/dashboard">Dashboard</NavItem>
          <NavItem path="/settings">Settings</NavItem>
        </AppNavigation>
      );
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('applies correct direction classes based on direction prop', () => {
      mockLocation.mockReturnValue({ pathname: '/dashboard' });
      
      // Test horizontal direction (default)
      const { rerender } = renderWithRouter(
        <AppNavigation>
          <NavItem path="/dashboard">Dashboard</NavItem>
        </AppNavigation>
      );
      
      let nav = screen.getByTestId('app-navigation');
      expect(nav).toHaveClass('flex', 'flex-row');
      
      // Test vertical direction
      rerender(
        <BrowserRouter>
          <AppNavigation direction="vertical">
            <NavItem path="/dashboard">Dashboard</NavItem>
          </AppNavigation>
        </BrowserRouter>
      );
      
      nav = screen.getByTestId('app-navigation');
      expect(nav).toHaveClass('flex', 'flex-col');
    });

    it('supports custom className', () => {
      mockLocation.mockReturnValue({ pathname: '/dashboard' });
      
      renderWithRouter(
        <AppNavigation className="custom-nav-class">
          <NavItem path="/dashboard">Dashboard</NavItem>
        </AppNavigation>
      );
      
      const nav = screen.getByTestId('app-navigation');
      expect(nav).toHaveClass('custom-nav-class');
    });

    it('validates children and filters out invalid components', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockLocation.mockReturnValue({ pathname: '/dashboard' });
      
      renderWithRouter(
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

    it('handles empty children gracefully', () => {
      mockLocation.mockReturnValue({ pathname: '/dashboard' });
      
      renderWithRouter(<AppNavigation />);
      
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('NavItem Component', () => {
    it('applies active classes to current page', () => {
      mockLocation.mockReturnValue({ pathname: '/dashboard' });
      
      renderWithRouter(
        <AppNavigation>
          <NavItem path="/dashboard">Dashboard</NavItem>
          <NavItem path="/settings">Settings</NavItem>
        </AppNavigation>
      );
      
      const dashboardButton = screen.getByText('Dashboard');
      expect(dashboardButton).toHaveClass('text-primary', 'border-b-primary', 'font-black');
    });

    it('applies inactive classes to non-current pages', () => {
      mockLocation.mockReturnValue({ pathname: '/dashboard' });
      
      renderWithRouter(
        <AppNavigation>
          <NavItem path="/dashboard">Dashboard</NavItem>
          <NavItem path="/settings">Settings</NavItem>
        </AppNavigation>
      );
      
      const settingsButton = screen.getByText('Settings');
      expect(settingsButton).toHaveClass('text-text-secondary', 'border-b-transparent', 'font-bold');
    });

    it('handles nested paths correctly', () => {
      mockLocation.mockReturnValue({ pathname: '/dashboard/settings' });
      
      renderWithRouter(
        <AppNavigation>
          <NavItem path="/dashboard">Dashboard</NavItem>
        </AppNavigation>
      );
      
      const dashboardButton = screen.getByText('Dashboard');
      expect(dashboardButton).toHaveClass('text-primary', 'border-b-primary');
    });

    it('applies brutal transition classes to all buttons', () => {
      mockLocation.mockReturnValue({ pathname: '/dashboard' });
      
      renderWithRouter(
        <AppNavigation>
          <NavItem path="/dashboard">Dashboard</NavItem>
          <NavItem path="/settings">Settings</NavItem>
        </AppNavigation>
      );
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('brutal-transition', 'uppercase', 'tracking-wider');
      });
    });

    it('includes hover states for inactive tabs', () => {
      mockLocation.mockReturnValue({ pathname: '/dashboard' });
      
      renderWithRouter(
        <AppNavigation>
          <NavItem path="/dashboard">Dashboard</NavItem>
          <NavItem path="/settings">Settings</NavItem>
        </AppNavigation>
      );
      
      const settingsButton = screen.getByText('Settings');
      expect(settingsButton).toHaveClass('hover:text-primary', 'hover:border-b-primary/30');
    });
  });

  describe('DefaultAppNavigation', () => {
    it('renders all default navigation tabs', () => {
      mockLocation.mockReturnValue({ pathname: '/dashboard' });
      
      renderWithRouter(<DefaultAppNavigation />);
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Manuals')).toBeInTheDocument();
      expect(screen.getByText('Maintenance')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });

    it('activates correct tab for different paths', () => {
      mockLocation.mockReturnValue({ pathname: '/manuals' });
      
      renderWithRouter(<DefaultAppNavigation />);
      
      const manualsButton = screen.getByText('Manuals');
      expect(manualsButton).toHaveClass('text-primary', 'font-black');
      
      const dashboardButton = screen.getByText('Dashboard');
      expect(dashboardButton).toHaveClass('text-text-secondary', 'font-bold');
    });

    it('activates Maintenance tab when on maintenance page', () => {
      mockLocation.mockReturnValue({ pathname: '/maintenance/schedule' });
      
      renderWithRouter(<DefaultAppNavigation />);
      
      const maintenanceButton = screen.getByText('Maintenance');
      expect(maintenanceButton).toHaveClass('text-primary', 'font-black');
    });

    it('activates Analytics tab when on analytics page', () => {
      mockLocation.mockReturnValue({ pathname: '/analytics' });
      
      renderWithRouter(<DefaultAppNavigation />);
      
      const analyticsButton = screen.getByText('Analytics');
      expect(analyticsButton).toHaveClass('text-primary', 'font-black');
    });
  });

  describe('DesktopAppNavigation', () => {
    it('renders with horizontal layout', () => {
      mockLocation.mockReturnValue({ pathname: '/dashboard' });
      
      renderWithRouter(<DesktopAppNavigation />);
      
      const nav = screen.getByTestId('app-navigation');
      expect(nav).toHaveClass('flex', 'flex-row');
      
      // Should render all navigation items
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Manuals')).toBeInTheDocument();
      expect(screen.getByText('Maintenance')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });
  });

  describe('MobileAppNavigation', () => {
    it('renders with vertical layout', () => {
      mockLocation.mockReturnValue({ pathname: '/dashboard' });
      
      renderWithRouter(<MobileAppNavigation />);
      
      const nav = screen.getByTestId('app-navigation');
      expect(nav).toHaveClass('flex', 'flex-col');
      
      // Should render all navigation items
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Manuals')).toBeInTheDocument();
      expect(screen.getByText('Maintenance')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });

    it('maintains active state in vertical layout', () => {
      mockLocation.mockReturnValue({ pathname: '/manuals' });
      
      renderWithRouter(<MobileAppNavigation />);
      
      const manualsButton = screen.getByText('Manuals');
      expect(manualsButton).toHaveClass('text-primary', 'font-black');
      
      const dashboardButton = screen.getByText('Dashboard');
      expect(dashboardButton).toHaveClass('text-text-secondary', 'font-bold');
    });
  });
});