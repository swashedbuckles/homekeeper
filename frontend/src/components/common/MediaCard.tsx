import { findChildOfType, findChildrenOfType, findNonCompoundChildren } from '../../lib/util/compound-components';
import type { ReactNode, FC, ComponentType } from 'react';

/**
 * MediaCard Component with Compound Component Pattern.
 * 
 * A flexible card component designed for grid layouts and card-based content display.
 * Uses compound components for optional elements while maintaining clean props for basic configuration.
 * Perfect for manual cards, equipment selection, dashboard widgets, and grid-based content.
 * 
 * Features compound components for optional elements:
 * - `MediaCard.Avatar` - Display icons, initials, or category indicators
 * - `MediaCard.Badge` - Show status indicators, categories, or labels
 * 
 * MediaCard is a container component - interactive elements should be placed inside it.
 * 
 * @example Manual card in grid
 * ```tsx
 * <MediaCard title="Samsung Refrigerator" subtitle="Model: RF28T5001SR" variant="primary">
 *   <MediaCard.Badge variant="secondary">Kitchen</MediaCard.Badge>
 *   <Button variant="primary">View Manual</Button>
 * </MediaCard>
 * ```
 * 
 * @example Equipment display card
 * ```tsx
 * <MediaCard title="Carrier HVAC" subtitle="FV4CNF006 • Basement">
 *   <MediaCard.Avatar color="secondary">🔥</MediaCard.Avatar>
 *   <p className="text-sm">Last maintenance: 3 months ago</p>
 *   <Button variant="outline">View Details</Button>
 * </MediaCard>
 * ```
 * 
 * @example Dashboard widget with rotation
 * ```tsx
 * <MediaCard 
 *   title="Total Manuals" 
 *   subtitle="47 documents" 
 *   variant="accent"
 *   rotation="slight-left"
 *   shadow="primary"
 * >
 *   <MediaCard.Avatar color="primary">📚</MediaCard.Avatar>
 *   <div className="text-3xl font-black">47</div>
 * </MediaCard>
 * ```
 */

/**
 * Props for the main MediaCard component.
 */
export interface MediaCardProps {
  /** The primary text displayed prominently in the card header */
  title: string;
  
  /** Optional secondary text displayed below the title */
  subtitle?: string;
  
  /** 
   * Visual style variant that controls the card's background and text colors
   * - `default`: White background with dark text
   * - `primary`: Orange background with white text (brand color)
   * - `secondary`: Blue background with white text
   * - `accent`: Green background with white text
   * - `danger`: Red background with white text
   * - `dark`: Dark background with light text
   */
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'danger' | 'dark';
  
  /** 
   * Slight rotation effect for visual interest
   * - `none`: No rotation (default)
   * - `left`: Slight counter-clockwise rotation (~2deg)
   * - `right`: Slight clockwise rotation (~2deg)  
   * - `slight-left`: Very subtle counter-clockwise rotation (~0.5deg)
   * - `slight-right`: Very subtle clockwise rotation (~0.5deg)
   */
  rotation?: 'none' | 'left' | 'right' | 'slight-left' | 'slight-right';
  
  /** 
   * Box shadow effect for depth and emphasis
   * - `default`: Standard shadow
   * - `primary`: Orange shadow (brand color)
   * - `secondary`: Blue shadow
   * - `accent`: Green shadow
   * - `dark`: Dark shadow
   * - `error`: Red shadow
   */
  shadow?: 'default' | 'primary' | 'secondary' | 'accent' | 'dark' | 'error';
  
  /** Additional CSS classes to apply to the root element */
  className?: string;
  
  /** Test identifier for automated testing. Defaults to 'media-card' */
  testId?: string;
  
  /** 
   * Card content - can include:
   * - MediaCard compound components (Avatar, Badge)
   * - Any other React components or content
   * - Text, buttons, forms, etc.
   */
  children?: ReactNode;
}

/**
 * Props for the Avatar compound component.
 * Used to display category icons, equipment symbols, or brand indicators in cards.
 */
export interface MediaCardAvatarProps {
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
   * Avatar content - typically:
   * - Category icons (e.g., "📚" for manuals, "🔥" for HVAC)
   * - Equipment symbols (e.g., "❄️" for refrigeration, "🚿" for plumbing)
   * - Brand initials (e.g., "S" for Samsung)
   * - React icons or other components
   */
  children: ReactNode;
}

/**
 * Props for the Badge compound component.
 * Used to display categories, status indicators, or labels in cards.
 */
export interface MediaCardBadgeProps {
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
   * Badge text content - typically:
   * - Categories: "Kitchen", "HVAC", "Plumbing", "Electronics"
   * - File types: "PDF", "Manual", "Warranty"
   * - Status: "New", "Updated", "Archived"
   * - Time indicators: "2 hours ago", "Last week"
   */
  children: ReactNode;
}

/**
 * Avatar compound component for MediaCard.
 * 
 * Displays a square avatar with icons, symbols, or initials.
 * Sized appropriately for card layouts and visual hierarchy.
 * 
 * @example Category icon
 * ```tsx
 * <MediaCard.Avatar color="primary">📚</MediaCard.Avatar>
 * ```
 * 
 * @example Equipment symbol
 * ```tsx
 * <MediaCard.Avatar color="secondary">🔥</MediaCard.Avatar>
 * ```
 */
const Avatar: FC<MediaCardAvatarProps> = ({ color = 'default', className = '', children }) => {
  const colorStyles = {
    default: 'bg-background text-text-primary',
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    accent: 'bg-accent text-white',
    danger: 'bg-error text-white',
    dark: 'bg-text-primary text-white'
  };

  const avatarStyles = [
    'w-10 h-10 md:w-12 md:h-12', // Square, responsive sizing
    'border-3 md:border-4 border-text-primary', // Brutal border
    'flex items-center justify-center', // Center content
    'text-base md:text-xl font-black', // Icon/text sizing
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
Avatar.displayName = 'MediaCard.Avatar';

/**
 * Badge compound component for MediaCard.
 * 
 * Displays labeled indicators for categories, status, file types, etc.
 * Multiple badges can be used and will be positioned at the top of the card.
 * 
 * @example Category badge
 * ```tsx
 * <MediaCard.Badge variant="secondary">Kitchen</MediaCard.Badge>
 * ```
 * 
 * @example File type badge
 * ```tsx
 * <MediaCard.Badge variant="accent">PDF</MediaCard.Badge>
 * ```
 */
const Badge: FC<MediaCardBadgeProps> = ({ variant = 'default', className = '', children }) => {
  const variantStyles = {
    default: 'bg-background text-text-primary',
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    accent: 'bg-accent text-white',
    danger: 'bg-error text-white',
    success: 'bg-accent text-white' // Using accent color for success
  };

  const badgeStyles = [
    'px-3 py-1', // Comfortable padding for cards
    'border-3 border-text-primary', // Brutal border
    'font-black text-xs', // Bold, small text
    'uppercase', // Consistent with design system
    'inline-block', // Allow multiple badges
    variantStyles[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={badgeStyles}>
      {children}
    </span>
  );
};
Badge.displayName = 'MediaCard.Badge';

/**
 * Main MediaCard component with compound component pattern.
 * 
 * A flexible card component that conditionally renders avatar and badges
 * based on which compound components are provided as children. Designed as
 * a container for other interactive elements rather than being interactive itself.
 */
const MediaCard: FC<MediaCardProps> & {
  Avatar: typeof Avatar;
  Badge: typeof Badge;
} = ({
  title,
  subtitle,
  variant = 'default',
  rotation = 'none',
  shadow = 'default',
  className = '',
  testId = 'media-card',
  children
}) => {
  // Extract compound components from children using shared utilities
  const avatar = findChildOfType(children, Avatar as ComponentType, 'MediaCard');
  const badges = findChildrenOfType(children, Badge as ComponentType, 'MediaCard');
  const otherChildren = findNonCompoundChildren(children, [Avatar as ComponentType, Badge as ComponentType]);

  // Base styles with brutal design system
  const baseStyles = [
    'block', // Block display for card layout
    'p-4 md:p-6', // Responsive padding
    'border-4 md:border-6 border-text-primary', // Brutal borders
    'font-mono' // Typography
  ];

  // Variant styles for background and text colors
  const variantStyles = {
    default: 'bg-white text-text-primary',
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    accent: 'bg-accent text-white',
    danger: 'bg-error text-white',
    dark: 'bg-text-primary text-white'
  };

  // Rotation effects for visual interest
  const rotationStyles = {
    none: '',
    left: 'brutal-rotate-left', // ~2deg counter-clockwise
    right: 'brutal-rotate-right', // ~2deg clockwise
    'slight-left': 'brutal-rotate-slight-left', // ~0.5deg counter-clockwise
    'slight-right': 'brutal-rotate-slight-right' // ~0.5deg clockwise
  };

  // Shadow effects for depth
  const shadowStyles = {
    default: 'brutal-shadow-dark',
    primary: 'brutal-shadow-primary',
    secondary: 'brutal-shadow-secondary',
    accent: 'brutal-shadow-accent',
    dark: 'brutal-shadow-dark',
    error: 'brutal-shadow-error'
  };

  const cardStyles = [
    ...baseStyles,
    variantStyles[variant],
    rotationStyles[rotation],
    shadowStyles[shadow],
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardStyles}
      data-testid={testId}
    >
      {/* Badges section - positioned at top if provided */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {badges}
        </div>
      )}

      {/* Header section with avatar and title/subtitle */}
      <div className="flex gap-3 md:gap-4 mb-4">
        {/* Avatar column - only renders if avatar provided */}
        {avatar && (
          <div className="flex-shrink-0">
            {avatar}
          </div>
        )}
        
        {/* Title/subtitle column - always present */}
        <div className="flex-1 min-w-0">
          {/* Title - always present */}
          <h3 className="font-black text-lg md:text-xl uppercase tracking-wide mb-1">
            {title}
          </h3>
          
          {/* Subtitle - only renders if provided */}
          {subtitle && (
            <p className="font-bold text-sm opacity-75">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Other content - renders any non-compound children */}
      {otherChildren.length > 0 && (
        <div className="space-y-3">
          {otherChildren}
        </div>
      )}
    </div>
  );
};

// Attach compound components to main component
MediaCard.Avatar = Avatar;
MediaCard.Badge = Badge;

// Add displayName for better debugging
MediaCard.displayName = 'MediaCard';

export { MediaCard };