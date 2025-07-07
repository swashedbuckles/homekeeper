import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router';
import { AppNavigation } from '../../../src/components/headers/AppNavigation';

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

  it('renders all navigation tabs', () => {
    mockLocation.mockReturnValue({ pathname: '/dashboard' });
    
    renderWithRouter(<AppNavigation />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Manuals')).toBeInTheDocument();
    expect(screen.getByText('Maintenance')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('applies active classes to current page', () => {
    mockLocation.mockReturnValue({ pathname: '/dashboard' });
    
    renderWithRouter(<AppNavigation />);
    
    const dashboardButton = screen.getByText('Dashboard');
    expect(dashboardButton).toHaveClass('text-primary', 'border-b-primary', 'font-black');
  });

  it('applies inactive classes to non-current pages', () => {
    mockLocation.mockReturnValue({ pathname: '/dashboard' });
    
    renderWithRouter(<AppNavigation />);
    
    const manualsButton = screen.getByText('Manuals');
    expect(manualsButton).toHaveClass('text-text-secondary', 'border-b-transparent', 'font-bold');
  });

  it('handles nested paths correctly', () => {
    mockLocation.mockReturnValue({ pathname: '/dashboard/settings' });
    
    renderWithRouter(<AppNavigation />);
    
    const dashboardButton = screen.getByText('Dashboard');
    expect(dashboardButton).toHaveClass('text-primary', 'border-b-primary');
  });

  it('applies responsive flex direction classes', () => {
    mockLocation.mockReturnValue({ pathname: '/dashboard' });
    
    renderWithRouter(<AppNavigation />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('flex', 'flex-col', 'md:flex-row');
  });

  it('applies brutal transition classes to all buttons', () => {
    mockLocation.mockReturnValue({ pathname: '/dashboard' });
    
    renderWithRouter(<AppNavigation />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveClass('brutal-transition', 'uppercase', 'tracking-wider');
    });
  });

  it('includes hover states for inactive tabs', () => {
    mockLocation.mockReturnValue({ pathname: '/dashboard' });
    
    renderWithRouter(<AppNavigation />);
    
    const manualsButton = screen.getByText('Manuals');
    expect(manualsButton).toHaveClass('hover:text-primary', 'hover:border-b-primary/30');
  });

  describe('different current paths', () => {
    it('activates Manuals tab when on manuals page', () => {
      mockLocation.mockReturnValue({ pathname: '/manuals' });
      
      renderWithRouter(<AppNavigation />);
      
      const manualsButton = screen.getByText('Manuals');
      expect(manualsButton).toHaveClass('text-primary', 'font-black');
      
      const dashboardButton = screen.getByText('Dashboard');
      expect(dashboardButton).toHaveClass('text-text-secondary', 'font-bold');
    });

    it('activates Maintenance tab when on maintenance page', () => {
      mockLocation.mockReturnValue({ pathname: '/maintenance/schedule' });
      
      renderWithRouter(<AppNavigation />);
      
      const maintenanceButton = screen.getByText('Maintenance');
      expect(maintenanceButton).toHaveClass('text-primary', 'font-black');
    });

    it('activates Analytics tab when on analytics page', () => {
      mockLocation.mockReturnValue({ pathname: '/analytics' });
      
      renderWithRouter(<AppNavigation />);
      
      const analyticsButton = screen.getByText('Analytics');
      expect(analyticsButton).toHaveClass('text-primary', 'font-black');
    });
  });
});