import { validateNavChildren, type AllowedNavChildren } from '../../lib/validation/children';
import { NavItem } from './NavItem';

/**
 * AppNavigation Component.
 * 
 * Main navigation component that uses composition to allow flexible navigation items.
 * Automatically handles active state detection, responsive layout, and neobrutalist styling.
 * Uses NavItem child components for maximum flexibility while maintaining type safety.
 * 
 * @example Horizontal navigation for desktop
 * ```tsx
 * <AppNavigation direction="horizontal">
 *   <NavItem path="/dashboard">Dashboard</NavItem>
 *   <NavItem path="/manuals">Manuals</NavItem>
 *   <NavItem path="/maintenance">Maintenance</NavItem>
 *   <NavItem path="/analytics">Analytics</NavItem>
 * </AppNavigation>
 * ```
 * 
 * @example Vertical navigation for mobile menus
 * ```tsx
 * <AppNavigation direction="vertical">
 *   <NavItem path="/dashboard">Dashboard</NavItem>
 *   <NavItem path="/manuals">Manuals</NavItem>
 *   <NavItem path="/maintenance">Maintenance</NavItem>
 * </AppNavigation>
 * ```
 * 
 * @example Custom navigation items with handlers
 * ```tsx
 * <AppNavigation direction="horizontal">
 *   <NavItem path="/dashboard" onClick={() => trackNavigation('dashboard')}>
 *     Dashboard
 *   </NavItem>
 *   <NavItem path="/settings" className="text-error">
 *     Admin Settings
 *   </NavItem>
 * </AppNavigation>
 * ```
 */
export interface AppNavigationProps {
  /** NavItem components to render in the navigation */
  children?: AllowedNavChildren;
  /** Layout direction for the navigation items */
  direction?: 'horizontal' | 'vertical';
  /** Additional CSS classes to apply to the nav container */
  className?: string;
  /** Test identifier for automated testing */
  testId?: string;
}

export const AppNavigation = ({
  children,
  direction = 'horizontal',
  className = '',
  testId = 'app-navigation'
}: AppNavigationProps) => {
  // Validate and extract navigation children
  const validatedNavItems = validateNavChildren(children, 'AppNavigation');

  const directionClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  };

  const navClasses = [
    'flex',
    directionClasses[direction],
    className
  ].filter(Boolean).join(' ');

  return (
    <nav className={navClasses} data-testid={testId}>
      {validatedNavItems}
    </nav>
  );
};

// Add displayName for better debugging
AppNavigation.displayName = 'AppNavigation';

// Export default navigation items for backward compatibility and common usage
export const DefaultAppNavigation = () => (
  <AppNavigation>
    <NavItem path="/dashboard">Dashboard</NavItem>
    <NavItem path="/manuals">Manuals</NavItem>
    <NavItem path="/maintenance">Maintenance</NavItem>
    <NavItem path="/analytics">Analytics</NavItem>
  </AppNavigation>
);

// Desktop-specific navigation (horizontal layout)
export const DesktopAppNavigation = () => (
  <AppNavigation direction="horizontal">
    <NavItem path="/dashboard">Dashboard</NavItem>
    <NavItem path="/manuals">Manuals</NavItem>
    <NavItem path="/maintenance">Maintenance</NavItem>
    <NavItem path="/analytics">Analytics</NavItem>
  </AppNavigation>
);

// Mobile-specific navigation (vertical layout)
export const MobileAppNavigation = () => (
  <AppNavigation direction="vertical">
    <NavItem path="/dashboard">Dashboard</NavItem>
    <NavItem path="/manuals">Manuals</NavItem>
    <NavItem path="/maintenance">Maintenance</NavItem>
    <NavItem path="/analytics">Analytics</NavItem>
  </AppNavigation>
);