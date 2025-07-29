import { getHoverEffectClasses } from '../../lib/design-system/hover-effects';
import { findChildOfType, findChildrenOfType } from '../../lib/util/compound-components';
import { validateActionChildren, type AllowedActionChildren } from '../../lib/validation/children';
import type { ReactNode, FC, ComponentType } from 'react';

/**
 * NewListItem Component with Compound Component Pattern.
 * 
 * A flexible horizontal list item component that uses compound components for complex features
 * while keeping simple props for basic configuration. Perfect for member lists, task items,
 * notifications, and history entries.
 * 
 * Features compound components for optional elements:
 * - `NewListItem.Avatar` - Display user initials, icons, or images
 * - `NewListItem.Badge` - Show status indicators, labels, or categories  
 * - `NewListItem.Actions` - Container for Action/Button components
 * 
 * @example Basic usage with just title and actions
 * ```tsx
 * <NewListItem title="Simple Task" subtitle="Basic description">
 *   <NewListItem.Actions>
 *     <Action variant="primary">Complete</Action>
 *   </NewListItem.Actions>
 * </NewListItem>
 * ```
 * 
 * @example Complex usage with avatar and badges
 * ```tsx
 * <NewListItem title="John Smith" subtitle="john@example.com" status="urgent">
 *   <NewListItem.Avatar color="primary">J</NewListItem.Avatar>
 *   <NewListItem.Badge variant="danger">Overdue</NewListItem.Badge>
 *   <NewListItem.Badge variant="secondary">High Priority</NewListItem.Badge>
 *   <NewListItem.Actions>
 *     <Action variant="primary">Complete</Action>
 *     <Action variant="outline">Reschedule</Action>
 *   </NewListItem.Actions>
 * </NewListItem>
 * ```
 * 
 * @example Equipment/task usage with icon avatar
 * ```tsx
 * <NewListItem title="HVAC Filter Change" subtitle="Carrier Air Handler • Basement" status="urgent">
 *   <NewListItem.Avatar color="secondary">🔥</NewListItem.Avatar>
 *   <NewListItem.Badge variant="danger">5 Days Overdue</NewListItem.Badge>
 *   <NewListItem.Actions>
 *     <Action variant="primary">Mark Complete</Action>
 *     <Action variant="outline">Reschedule</Action>
 *   </NewListItem.Actions>
 * </NewListItem>
 * ```
 */

/**
 * Props for the main NewListItem component.
 */
export interface ListItemProps {
  /** The primary text displayed prominently at the top of the list item */
  title: string;
  
  /** Optional secondary text displayed below the title in smaller font */
  subtitle?: string;
  
  /** 
   * Visual status indicator that controls the left border color
   * - `default`: No special border styling
   * - `urgent`: Red left border for high-priority or overdue items
   * - `completed`: Green left border for finished items
   * - `info`: Blue left border for informational items
   */
  status?: 'default' | 'urgent' | 'completed' | 'info';
  
  /** 
   * Whether to show hover effects even when onClick is not provided.
   * Useful for indicating clickable items handled by parent components.
   */
  hover?: boolean;
  
  /** Click handler for the entire list item. Makes the item interactive with hover effects. */
  onClick?: () => void;
  
  /** Additional CSS classes to apply to the root element */
  className?: string;
  
  /** Test identifier for automated testing. Defaults to 'new-list-item' */
  testId?: string;
  
  /** 
   * Child components - should include NewListItem compound components:
   * - NewListItem.Avatar (optional)
   * - NewListItem.Badge (optional, multiple allowed)
   * - NewListItem.Actions (optional)
   */
  children?: ReactNode;
}

/**
 * Props for the Avatar compound component.
 * Used to display user initials, equipment icons, or other visual identifiers.
 */
export interface AvatarProps {
  /** 
   * Color theme for the avatar background
   * - `default`: Light background with dark text
   * - `primary`: Orange background (brand color)
   * - `secondary`: Blue background  
   * - `accent`: Green background
   * - `danger`: Red background for urgent/error states
   * - `dark`: Dark background with light text
   */
  color?: 'default' | 'primary' | 'secondary' | 'accent' | 'danger' | 'dark';
  
  /** Additional CSS classes to apply to the avatar element */
  className?: string;
  
  /** 
   * Avatar content - can be:
   * - Text initials (e.g., "JS" for John Smith)
   * - Emoji icons (e.g., "🔥" for HVAC equipment)
   * - React icons or other components
   */
  children: ReactNode;
}

/**
 * Props for the Badge compound component.
 * Used to display status indicators, categories, or labels.
 */
export interface BadgeProps {
  /** 
   * Visual style variant for the badge
   * - `default`: Light background with dark text
   * - `primary`: Orange background (brand color)
   * - `secondary`: Blue background
   * - `accent`: Green background (also used for success states)
   * - `danger`: Red background for urgent/error states
   * - `success`: Green background for positive states
   */
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'danger' | 'success';
  
  /** Additional CSS classes to apply to the badge element */
  className?: string;
  
  /** 
   * Badge text content - typically short labels like:
   * - Status: "Overdue", "Due Soon", "Completed"
   * - Priority: "High", "Medium", "Low"  
   * - Categories: "HVAC", "Kitchen", "Plumbing"
   * - Roles: "Owner", "Admin", "Member"
   */
  children: ReactNode;
}

/**
 * Props for the Actions compound component.
 * Container for Action and Button components with proper validation.
 */
export interface ActionsProps {
  /** Additional CSS classes to apply to the actions container */
  className?: string;
  
  /** 
   * Action/Button components - automatically validated to ensure only
   * Action and Button components are allowed as children
   */
  children?: AllowedActionChildren;
}


/**
 * Avatar compound component for NewListItem.
 * 
 * Displays a circular avatar with initials, icons, or other content.
 * Automatically sized and styled to fit within the list item layout.
 * 
 * @example User initials
 * ```tsx
 * <NewListItem.Avatar color="primary">JS</NewListItem.Avatar>
 * ```
 * 
 * @example Equipment icon
 * ```tsx
 * <NewListItem.Avatar color="secondary">🔥</NewListItem.Avatar>
 * ```
 */
const Avatar: FC<AvatarProps> = ({ color = 'default', className = '', children }) => {
  const colorStyles = {
    default: 'bg-background text-text-primary',
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    accent: 'bg-accent text-white',
    danger: 'bg-error text-white',
    dark: 'bg-text-primary text-white'
  };

  const avatarStyles = [
    'w-12 h-12 md:w-16 md:h-16', // Responsive sizing
    'border-3 md:border-4 border-text-primary', // Brutal border
    'flex items-center justify-center', // Center content
    'text-lg md:text-2xl font-black', // Bold text styling
    'flex-shrink-0', // Prevent squishing
    colorStyles[color],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={avatarStyles}>
      {children}
    </div>
  );
};
Avatar.displayName = 'NewListItem.Avatar';

/**
 * Badge compound component for NewListItem.
 * 
 * Displays small labeled indicators for status, priority, categories, etc.
 * Multiple badges can be used and will automatically wrap to new lines.
 * 
 * @example Status badge
 * ```tsx
 * <NewListItem.Badge variant="danger">Overdue</NewListItem.Badge>
 * ```
 * 
 * @example Category badge
 * ```tsx
 * <NewListItem.Badge variant="secondary">HVAC</NewListItem.Badge>
 * ```
 */
const Badge: FC<BadgeProps> = ({ variant = 'default', className = '', children }) => {
  const variantStyles = {
    default: 'bg-background text-text-primary',
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    accent: 'bg-accent text-white',
    danger: 'bg-error text-white',
    success: 'bg-accent text-white' // Using accent color for success
  };

  const badgeStyles = [
    'px-2 py-1', // Small padding
    'border-2 border-text-primary', // Brutal border
    'font-black text-xs', // Bold, small text
    'uppercase', // Consistent with design system
    'inline-block', // Allow wrapping
    variantStyles[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={badgeStyles}>
      {children}
    </span>
  );
};
Badge.displayName = 'NewListItem.Badge';

/**
 * Actions compound component for NewListItem.
 * 
 * Container for Action and Button components with automatic validation.
 * Layouts actions in a responsive flex container and validates that only
 * Action/Button components are used as children.
 * 
 * @example Single action
 * ```tsx
 * <NewListItem.Actions>
 *   <Action variant="primary">Complete</Action>
 * </NewListItem.Actions>
 * ```
 * 
 * @example Multiple actions
 * ```tsx
 * <NewListItem.Actions>
 *   <Action variant="primary">Complete</Action>
 *   <Action variant="outline">Reschedule</Action>
 *   <Button variant="danger" size="sm">Delete</Button>
 * </NewListItem.Actions>
 * ```
 */
const Actions: FC<ActionsProps> = ({ className = '', children }) => {
  // Validate that only Action/Button components are used
  const validatedActions = validateActionChildren(children, 'NewListItem.Actions');
  
  // Don't render if no valid actions
  if (validatedActions.length === 0) {
    return null;
  }

  const actionsStyles = [
    'ml-6 flex-shrink-0 flex gap-2', // Spacing and flex layout
    'flex-col sm:flex-row', // Stack on mobile, row on desktop
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={actionsStyles}>
      {validatedActions}
    </div>
  );
};
Actions.displayName = 'NewListItem.Actions';

/**
 * Main NewListItem component with compound component pattern.
 * 
 * A flexible list item that conditionally renders avatar, badges, and actions
 * based on which compound components are provided as children. Uses the brutal
 * design system with thick borders, bold typography, and status indicators.
 */
const ListItem: FC<ListItemProps> & {
  Avatar: typeof Avatar;
  Badge: typeof Badge;
  Actions: typeof Actions;
} = ({
  title,
  subtitle,
  status = 'default',
  hover = false,
  onClick,
  className = '',
  testId = 'new-list-item',
  children
}) => {
  // Extract compound components from children
  const avatar = findChildOfType(children, Avatar as ComponentType, 'NewListItem');
  const badges = findChildrenOfType(children, Badge as ComponentType, 'NewListItem');
  const actions = findChildOfType(children, Actions as ComponentType, 'NewListItem');

  const isClickable = onClick || hover;

  // Base styles with brutal design system
  const baseStyles = [
    'flex', 'items-center', 'justify-between', // Layout
    'p-4 md:p-6', // Responsive padding
    'bg-white', // Background
    'border-4 md:border-6 border-text-primary', // Brutal borders
    'font-mono' // Typography
  ];

  // Status-based left border colors for visual hierarchy
  const statusStyles = {
    default: '',
    urgent: 'border-l-8 md:border-l-12 border-l-error', // Red for urgent
    completed: 'border-l-8 md:border-l-12 border-l-accent', // Green for completed
    info: 'border-l-8 md:border-l-12 border-l-secondary' // Blue for info
  };

  // Interactive styles when clickable
  const interactiveStyles = isClickable ? [
    'cursor-pointer',
    ...getHoverEffectClasses('lift') // Subtle lift effect on hover
  ] : [];

  const itemStyles = [
    ...baseStyles,
    statusStyles[status],
    ...interactiveStyles,
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={itemStyles}
      onClick={onClick}
      data-testid={testId}
    >
      {/* Avatar section - only renders if avatar compound component provided */}
      {avatar && (
        <div className="mr-4 md:mr-6">
          {avatar}
        </div>
      )}

      {/* Main content section - always present */}
      <div className="flex-1">
        {/* Title - always present */}
        <div className="font-bold text-lg md:text-xl text-text-primary uppercase tracking-wide mb-2">
          {title}
        </div>
        
        {/* Subtitle - only renders if provided */}
        {subtitle && (
          <div className="text-text-secondary text-sm font-bold uppercase tracking-wide mb-2">
            {subtitle}
          </div>
        )}
        
        {/* Badges section - only renders if badge compound components provided */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {badges}
          </div>
        )}
      </div>

      {/* Actions section - only renders if actions compound component provided */}
      {actions}
    </div>
  );
};

// Attach compound components to main component
ListItem.Avatar = Avatar;
ListItem.Badge = Badge;
ListItem.Actions = Actions;

// Add displayName for better debugging
ListItem.displayName = 'NewListItem';

export { ListItem };