import { getHoverEffectClasses } from '../../lib/design-system/hover-effects';
import { findChildOfType, findChildrenOfType } from '../../lib/util/compound-components';
import { validateActionChildren, type AllowedActionChildren } from '../../lib/validation/children';
import type { ReactNode, FC, ComponentType } from 'react';

/**
 * ListItem Component with Compound Component Pattern.
 * 
 * A flexible horizontal list item component that uses compound components for complex features
 * while keeping simple props for basic configuration. Perfect for member lists, task items,
 * notifications, and history entries.
 * 
 * Features compound components for optional elements:
 * - `ListItem.Avatar` - Display user initials, icons, or images
 * - `ListItem.Badge` - Show status indicators, labels, or categories  
 * - `ListItem.Actions` - Container for Action/Button components
 * 
 * @example Basic usage with just title and actions
 * ```tsx
 * <ListItem title="Simple Task" subtitle="Basic description">
 *   <ListItem.Actions>
 *     <Action variant="primary">Complete</Action>
 *   </ListItem.Actions>
 * </ListItem>
 * ```
 * 
 * @example Complex usage with avatar and badges
 * ```tsx
 * <ListItem title="John Smith" subtitle="john@example.com" status="urgent">
 *   <ListItem.Avatar color="primary">J</ListItem.Avatar>
 *   <ListItem.Badge variant="danger">Overdue</ListItem.Badge>
 *   <ListItem.Badge variant="secondary">High Priority</ListItem.Badge>
 *   <ListItem.Actions>
 *     <Action variant="primary">Complete</Action>
 *     <Action variant="outline">Reschedule</Action>
 *   </ListItem.Actions>
 * </ListItem>
 * ```
 * 
 * @example Equipment/task usage with icon avatar
 * ```tsx
 * <ListItem title="HVAC Filter Change" subtitle="Carrier Air Handler • Basement" status="urgent">
 *   <ListItem.Avatar color="secondary">🔥</ListItem.Avatar>
 *   <ListItem.Badge variant="danger">5 Days Overdue</ListItem.Badge>
 *   <ListItem.Actions>
 *     <Action variant="primary">Mark Complete</Action>
 *     <Action variant="outline">Reschedule</Action>
 *   </ListItem.Actions>
 * </ListItem>
 * ```
 */

/**
 * Props for the main ListItem component.
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

  variant?: 'default' | 'subtle' | 'primary' | 'secondary' | 'accent' | 'danger' | 'dark';  
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
   * Child components - should include ListItem compound components:
   * - ListItem.Avatar (optional)
   * - ListItem.Badge (optional, multiple allowed)
   * - ListItem.Actions (optional)
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
 * Avatar compound component for ListItem.
 * 
 * Displays a circular avatar with initials, icons, or other content.
 * Automatically sized and styled to fit within the list item layout.
 * 
 * @example User initials
 * ```tsx
 * <ListItem.Avatar color="primary">JS</ListItem.Avatar>
 * ```
 * 
 * @example Equipment icon
 * ```tsx
 * <ListItem.Avatar color="secondary">🔥</ListItem.Avatar>
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
Avatar.displayName = 'ListItem.Avatar';

/**
 * Badge compound component for ListItem.
 * 
 * Displays small labeled indicators for status, priority, categories, etc.
 * Multiple badges can be used and will automatically wrap to new lines.
 * 
 * @example Status badge
 * ```tsx
 * <ListItem.Badge variant="danger">Overdue</ListItem.Badge>
 * ```
 * 
 * @example Category badge
 * ```tsx
 * <ListItem.Badge variant="secondary">HVAC</ListItem.Badge>
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
Badge.displayName = 'ListItem.Badge';

/**
 * Actions compound component for ListItem.
 * 
 * Container for Action and Button components with automatic validation.
 * Layouts actions in a responsive flex container and validates that only
 * Action/Button components are used as children.
 * 
 * @example Single action
 * ```tsx
 * <ListItem.Actions>
 *   <Action variant="primary">Complete</Action>
 * </ListItem.Actions>
 * ```
 * 
 * @example Multiple actions
 * ```tsx
 * <ListItem.Actions>
 *   <Action variant="primary">Complete</Action>
 *   <Action variant="outline">Reschedule</Action>
 *   <Button variant="danger" size="sm">Delete</Button>
 * </ListItem.Actions>
 * ```
 */
const Actions: FC<ActionsProps> = ({ className = '', children }) => {
  // Validate that only Action/Button components are used
  const validatedActions = validateActionChildren(children, 'ListItem.Actions');
  
  // Don't render if no valid actions
  if (validatedActions.length === 0) {
    return null;
  }

  const actionsStyles = [
    'ml-6 flex-shrink-0 flex gap-2', // Spacing and flex layout
    'flex-col sm:flex-row', // Stack on mobile, row on desktop
    'w-full md:w-auto',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={actionsStyles}>
      {validatedActions}
    </div>
  );
};
Actions.displayName = 'ListItem.Actions';

const Content: FC<ActionsProps> = ({ className = '', children }) => {

  const contentStyles = [
    'ml-6 flex-shrink-0 flex gap-2', // Spacing and flex layout
    'flex-col sm:flex-row', // Stack on mobile, row on desktop
    'w-full md:w-auto',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={contentStyles}>
      {children}
    </div>
  );
};
Content.displayName = 'ListItem.Content';

/**
 * Main ListItem component with compound component pattern.
 * 
 * A flexible list item that conditionally renders avatar, badges, and actions
 * based on which compound components are provided as children. Uses the brutal
 * design system with thick borders, bold typography, and status indicators.
 */
const ListItem: FC<ListItemProps> & {
  Avatar: typeof Avatar;
  Badge: typeof Badge;
  Actions: typeof Actions;
  Content: typeof Content;
} = ({
  title,
  subtitle,
  variant = 'default',
  status = 'default',
  hover = false,
  onClick,
  className = '',
  testId = 'new-list-item',
  children
}) => {
  // Extract compound components from children
  const avatar = findChildOfType(children, Avatar as ComponentType, 'ListItem');
  const badges = findChildrenOfType(children, Badge as ComponentType, 'ListItem');
  const actions = findChildOfType(children, Actions as ComponentType, 'ListItem');
  const content = findChildOfType(children, Content as ComponentType, 'ListItem');

  const isClickable = onClick || hover;

  // Base styles with brutal design system
  const baseStyles = [
    'flex', 'flex-col', 'md:flex-row', 'items-start md:items-center', 'justify-between', // Layout
    'p-4 md:p-6', // Responsive padding
    // 'bg-white', // Background
    'border-4 md:border-6 border-text-primary', // Brutal borders
    'font-mono' // Typography
  ];

  const variantStyles = {
    default:   ['bg-white', 'text-text-primary'],
    subtle:    ['bg-background', 'text-text-primary'],
    primary:   ['bg-primary', 'text-white'],
    secondary: ['bg-secondary', 'text-white'],
    accent:    ['bg-accent', 'text-white'],
    danger:    ['bg-error', 'text-white'],
    dark:      ['bg-text-primary', 'text-white'],
  };

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
    ...variantStyles[variant],
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
        <div className="mb-3 md:mb-0 md:mr-6">
          {avatar}
        </div>
      )}

      {/* Main content section - always present */}
      <div className="flex-1">
        {/* Title - always present */}
        <div className="font-bold text-lg md:text-xl uppercase tracking-wide mb-2">
          {title}
        </div>
        
        {/* Subtitle - only renders if provided */}
        {subtitle && (
          <div className=" text-sm font-bold uppercase tracking-wide mb-2">
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

      <div className="mt-3 md:mt-0 w-full md:w-auto">
      {content}
      {/* Actions section - only renders if actions compound component provided */}
      {actions}
      </div>
    </div>
  );
};

// Attach compound components to main component
ListItem.Avatar = Avatar;
ListItem.Badge = Badge;
ListItem.Actions = Actions;
ListItem.Content = Content;

// Add displayName for better debugging
ListItem.displayName = 'ListItem';

export { ListItem };