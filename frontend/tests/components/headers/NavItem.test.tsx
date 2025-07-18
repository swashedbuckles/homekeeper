import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router';
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

describe('NavItem', () => {
  beforeEach(() => {
    mockLocation.mockClear();
  });

  it('renders children content', () => {
    mockLocation.mockReturnValue({ pathname: '/dashboard' });
    
    renderWithRouter(<NavItem path="/dashboard">Dashboard</NavItem>);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('applies active classes when path matches current location', () => {
    mockLocation.mockReturnValue({ pathname: '/dashboard' });
    
    renderWithRouter(<NavItem path="/dashboard">Dashboard</NavItem>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'text-primary',
      'border-b-primary', 
      'font-black',
      'bg-transparent',
      'border-0',
      'border-b-4',
      'uppercase',
      'tracking-wider',
      'px-6',
      'py-3',
      'brutal-transition'
    );
  });

  it('applies inactive classes when path does not match current location', () => {
    mockLocation.mockReturnValue({ pathname: '/dashboard' });
    
    renderWithRouter(<NavItem path="/settings">Settings</NavItem>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'text-text-secondary',
      'border-b-transparent',
      'font-bold',
      'bg-transparent',
      'border-0',
      'border-b-4',
      'uppercase',
      'tracking-wider',
      'px-6',
      'py-3',
      'brutal-transition',
      'hover:text-primary',
      'hover:border-b-primary/30'
    );
  });

  it('handles nested paths correctly (activates parent when on child path)', () => {
    mockLocation.mockReturnValue({ pathname: '/dashboard/settings' });
    
    renderWithRouter(<NavItem path="/dashboard">Dashboard</NavItem>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-primary', 'border-b-primary', 'font-black');
  });

  it('does not activate for partial path matches', () => {
    mockLocation.mockReturnValue({ pathname: '/dashboard-admin' });
    
    renderWithRouter(<NavItem path="/dashboard">Dashboard</NavItem>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-text-secondary', 'border-b-transparent', 'font-bold');
  });

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    mockLocation.mockReturnValue({ pathname: '/dashboard' });
    
    renderWithRouter(
      <NavItem path="/dashboard" onClick={mockOnClick}>
        Dashboard
      </NavItem>
    );
    
    await user.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    mockLocation.mockReturnValue({ pathname: '/dashboard' });
    
    renderWithRouter(
      <NavItem path="/dashboard" className="custom-nav-class">
        Dashboard
      </NavItem>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-nav-class');
  });

  it('sets testId when provided', () => {
    mockLocation.mockReturnValue({ pathname: '/dashboard' });
    
    renderWithRouter(
      <NavItem path="/dashboard" testId="dashboard-nav">
        Dashboard
      </NavItem>
    );
    
    expect(screen.getByTestId('dashboard-nav')).toBeInTheDocument();
  });

  it('supports complex children content', () => {
    mockLocation.mockReturnValue({ pathname: '/dashboard' });
    
    renderWithRouter(
      <NavItem path="/dashboard">
        <span>📊</span> Dashboard
      </NavItem>
    );
    
    expect(screen.getByText('📊')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  describe('different paths and states', () => {
    it('activates correctly for root path', () => {
      mockLocation.mockReturnValue({ pathname: '/' });
      
      renderWithRouter(<NavItem path="/">Home</NavItem>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-primary', 'font-black');
    });

    it('activates correctly for multi-segment paths', () => {
      mockLocation.mockReturnValue({ pathname: '/admin/users' });
      
      renderWithRouter(<NavItem path="/admin">Admin</NavItem>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-primary', 'font-black');
    });

    it('does not activate for similar but different paths', () => {
      mockLocation.mockReturnValue({ pathname: '/user-settings' });
      
      renderWithRouter(<NavItem path="/user">User</NavItem>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-text-secondary', 'font-bold');
    });
  });
});