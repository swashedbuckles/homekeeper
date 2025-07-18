import { useLocation } from 'react-router';
import type { ReactNode } from 'react';

/**
 * NavItem Component for AppNavigation.
 * 
 * Represents a single navigation item with automatic active state detection
 * based on the current route. Provides neobrutalist styling with bold typography
 * and dramatic borders for active states.
 * 
 * @example Basic navigation item
 * ```tsx
 * <NavItem path="/dashboard">
 *   Dashboard
 * </NavItem>
 * ```
 * 
 * @example Custom onClick handler
 * ```tsx
 * <NavItem path="/settings" onClick={() => trackNavigation('settings')}>
 *   Settings
 * </NavItem>
 * ```
 * 
 * @example Custom styling
 * ```tsx
 * <NavItem path="/admin" className="text-error">
 *   Admin Panel
 * </NavItem>
 * ```
 */
export interface NavItemProps {
  /** The path this navigation item represents (used for active state detection) */
  path: string;
  /** The content to display in the navigation item */
  children: ReactNode;
  /** Optional click handler */
  onClick?: () => void;
  /** Additional CSS classes to apply */
  className?: string;
  /** Test identifier for automated testing */
  testId?: string;
}

export const NavItem = ({
  path,
  children,
  onClick,
  className = '',
  testId
}: NavItemProps) => {
  const location = useLocation();
  // More precise path matching: exact match or starts with path + '/'
  const isActive = location.pathname === path || 
    (path !== '/' && location.pathname.startsWith(path + '/'));

  const activeClasses = [
    'bg-transparent',
    'text-primary',
    'border-0',
    'border-b-4',
    'border-b-primary',
    'font-black',
    'uppercase',
    'tracking-wider',
    'px-6',
    'py-3',
    'brutal-transition',
  ].join(' ');

  const inactiveClasses = [
    'bg-transparent',
    'text-text-secondary',
    'border-0',
    'border-b-4',
    'border-b-transparent',
    'font-bold',
    'uppercase',
    'tracking-wider',
    'px-6',
    'py-3',
    'brutal-transition',
    'hover:text-primary',
    'hover:border-b-primary/30'
  ].join(' ');

  const buttonClasses = [
    isActive ? activeClasses : inactiveClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={buttonClasses}
      onClick={onClick}
      data-testid={testId}
    >
      {children}
    </button>
  );
};

// Add displayName for better debugging
NavItem.displayName = 'NavItem';