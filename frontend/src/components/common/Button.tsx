import { type HoverEffect, getHoverEffectClass } from '../../lib/design-system/hover-effects';
import { type StandardSize, getSizeToken } from '../../lib/design-system/sizes';
import type { ReactNode } from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'text' | 'danger' | 'accent';
  size?: StandardSize;
  disabled?: boolean;
  /** whether to display loading text / spinner */
  loading?: boolean;
  loadingText?: string;
  /** button usage */
  type?: 'button' | 'submit' | 'reset';
  /** set button to full-width of its parent? */
  full?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  testId?: string;
  className?: string;
  children: ReactNode;
}

const baseStyles = [
  'font-mono',
  'font-black',
  'uppercase',
  'tracking-wider',
  'brutal-transition',
  'focus:outline-none',
  'disabled:opacity-50',
  'disabled:cursor-not-allowed'
];

// Size variations using standardized tokens
const getSizeStyles = (size: StandardSize): string[] => [
  getSizeToken(size, 'paddingX') + ' ' + getSizeToken(size, 'paddingY'),
  getSizeToken(size, 'text'),
  getSizeToken(size, 'border')
];

// Get hover effect based on button size
const getButtonHoverEffect = (size: StandardSize): HoverEffect => {
  // Smaller buttons use press-small, larger use press
  return (size === 'xs' || size === 'sm') ? 'press-small' : 'press';
};

// Variant styles - colors and borders
const variantStyles = {
  primary: [
    'bg-primary',
    'text-white',
    'border-text-primary',
    'brutal-shadow-dark'
  ],
  secondary: [
    'bg-secondary',
    'text-white',
    'border-text-primary',
    'brutal-shadow-dark'
  ],
  tertiary: [
    'bg-white',
    'text-text-primary',
    'border-text-primary',
    'brutal-shadow-dark',
  ],
  outline: [
    'bg-transparent',
    'text-text-primary',
    'border-text-primary',
    // 'brutal-shadow-dark',
    'hover:bg-text-primary',
    'hover:text-white'
  ],
  danger: [
    'bg-error',
    'text-white',
    'border-text-primary',
    'brutal-shadow-dark'
  ],
  accent: [
    'bg-accent',
    'text-white',
    'border-text-primary',
    'brutal-shadow-dark'
  ],
  text: [
    'bg-transparent',
    'text-primary',
    'border-transparent',
    'hover:bg-primary/8',
    'px-3',
    'py-1',
    'text-sm',
    // Override shadow and hover for text variant
    '!shadow-none',
    '!hover:transform-none'
  ]
};

/**
 * Button Component
 * 
 * A neobrutalist-styled button component with multiple variants, sizes, and states.
 * Features thick borders, dramatic shadows, and press animations for tactile interaction.
 * 
 * @example
 * ```tsx
 * // Primary action button
 * <Button variant="primary" size="large">
 *   Get Started
 * </Button>
 * 
 * // Loading state with custom text
 * <Button variant="secondary" loading loadingText="Saving...">
 *   Save Changes
 * </Button>
 * 
 * // Full-width submit button
 * <Button type="submit" variant="accent" full>
 *   Create Account
 * </Button>
 * 
 * // Destructive action
 * <Button variant="danger" onClick={handleDelete}>
 *   Delete Item
 * </Button>
 * 
 * // Minimal text button
 * <Button variant="text" size="small">
 *   Cancel
 * </Button>
 * ```
 * 
 * @param variant - Visual style variant
 *   - `primary`: Orange background, main call-to-action
 *   - `secondary`: Blue background, secondary actions  
 *   - `tertiary`: White background, neutral actions
 *   - `outline`: Transparent with border, subtle actions
 *   - `accent`: Green background, positive actions
 *   - `danger`: Red background, destructive actions
 *   - `text`: No background/border, minimal styling
 * @param size - Button size affecting padding and text size
 * @param loading - Shows spinner and loading text, disables interaction
 * @param loadingText - Custom text to show during loading state
 * @param full - Expands button to full width of container
 * @param type - HTML button type for form submission
 * @param disabled - Disables button interaction and applies opacity
 * @param onClick - Click handler function
 * @param className - Additional CSS classes to apply
 * @param testId - Test identifier for automated testing
 * @param children - Button content (text, icons, etc.)
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  loadingText = 'Loading...',
  type = 'button',
  full = false,
  children,
  onClick,
  className,
  testId
}: ButtonProps) => {
  const isDisabled = disabled || loading;


  // Handle disabled state - override hover effects
  const disabledStyles = isDisabled ? [
    '!hover:transform-none',
    '!hover:shadow-[var(--shadow-brutal-lg)_var(--shadow-dark)]'
  ] : [];

  const hoverEffect = getButtonHoverEffect(size);
  const hoverClass = !isDisabled ? getHoverEffectClass(hoverEffect) : '';
  
  const buttonStyles = [
    ...baseStyles,
    ...getSizeStyles(size),
    ...variantStyles[variant],
    ...disabledStyles,
    hoverClass,
    full ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={buttonStyles}
      data-testid={testId}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
};