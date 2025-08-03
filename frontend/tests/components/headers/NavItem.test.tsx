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

// Helper function to render NavItem with router and mock location
const renderNavItem = (path: string, children: React.ReactNode, pathname: string, additionalProps = {}) => {
  mockLocation.mockReturnValue({ pathname });
  return render(
    <BrowserRouter>
      <NavItem path={path} {...additionalProps}>{children}</NavItem>
    </BrowserRouter>
  );
};

// Helper function to get nav button
const getNavButton = () => screen.getByRole('button');

// Helper function to check if nav item is active
const expectNavItemActive = (isActive: boolean) => {
  const button = getNavButton();
  if (isActive) {
    expect(button).toHaveClass('text-primary', 'border-b-primary', 'font-black');
  } else {
    expect(button).toHaveClass('text-text-secondary', 'border-b-transparent', 'font-bold');
  }
};

describe('NavItem', () => {
  beforeEach(() => {
    mockLocation.mockClear();
  });

  it('renders children content', () => {
    renderNavItem('/dashboard', 'Dashboard', '/dashboard');
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  const pathMatchingTests = [
    {
      name: 'applies active classes when path matches current location',
      path: '/dashboard',
      pathname: '/dashboard',
      children: 'Dashboard',
      isActive: true,
      additionalActiveClasses: ['bg-transparent', 'border-0', 'border-b-4', 'uppercase', 'tracking-wider', 'px-6', 'py-3', 'brutal-transition']
    },
    {
      name: 'applies inactive classes when path does not match current location',
      path: '/settings',
      pathname: '/dashboard',
      children: 'Settings',
      isActive: false,
      additionalInactiveClasses: ['bg-transparent', 'border-0', 'border-b-4', 'uppercase', 'tracking-wider', 'px-6', 'py-3', 'brutal-transition', 'hover:text-primary', 'hover:border-b-primary/30']
    }
  ];

  pathMatchingTests.forEach(({ name, path, pathname, children, isActive, additionalActiveClasses, additionalInactiveClasses }) => {
    it(name, () => {
      renderNavItem(path, children, pathname);
      expectNavItemActive(isActive);
      
      const button = getNavButton();
      const additionalClasses = isActive ? additionalActiveClasses : additionalInactiveClasses;
      if (additionalClasses) {
        additionalClasses.forEach(className => {
          expect(button).toHaveClass(className);
        });
      }
    });
  });

  it('handles nested paths correctly (activates parent when on child path)', () => {
    renderNavItem('/dashboard', 'Dashboard', '/dashboard/settings');
    expectNavItemActive(true);
  });

  it('does not activate for partial path matches', () => {
    renderNavItem('/dashboard', 'Dashboard', '/dashboard-admin');
    expectNavItemActive(false);
  });

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    
    renderNavItem('/dashboard', 'Dashboard', '/dashboard', { onClick: mockOnClick });
    
    await user.click(getNavButton());
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    renderNavItem('/dashboard', 'Dashboard', '/dashboard', { className: 'custom-nav-class' });
    const button = getNavButton();
    expect(button).toHaveClass('custom-nav-class');
  });

  it('sets testId when provided', () => {
    renderNavItem('/dashboard', 'Dashboard', '/dashboard', { testId: 'dashboard-nav' });
    expect(screen.getByTestId('dashboard-nav')).toBeInTheDocument();
  });

  it('supports complex children content', () => {
    renderNavItem('/dashboard', [<span key="icon">📊</span>, ' Dashboard'], '/dashboard');
    expect(screen.getByText('📊')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  describe('different paths and states', () => {
    const pathStateTests = [
      {
        name: 'activates correctly for root path',
        path: '/',
        pathname: '/',
        children: 'Home',
        shouldBeActive: true
      },
      {
        name: 'activates correctly for multi-segment paths',
        path: '/admin',
        pathname: '/admin/users',
        children: 'Admin',
        shouldBeActive: true
      },
      {
        name: 'does not activate for similar but different paths',
        path: '/user',
        pathname: '/user-settings',
        children: 'User',
        shouldBeActive: false
      }
    ];

    pathStateTests.forEach(({ name, path, pathname, children, shouldBeActive }) => {
      it(name, () => {
        renderNavItem(path, children, pathname);
        expectNavItemActive(shouldBeActive);
      });
    });
  });
});