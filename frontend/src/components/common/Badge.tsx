import type { ReactNode } from 'react';

type BadgeVariant = 'status' | 'category' | 'count';
type BadgeColor = 'primary' | 'secondary' | 'accent' | 'dark' | 'error' | 'success' | 'warning';
type BadgeSize = 'small' | 'medium' | 'large';

/**
 * Badge Component.
 * 
 * Displays small status indicators, categories, and counts with brutal styling.
 * Uses thick borders, bold text, and semantic colors. Perfect for status labels,
 * category tags, and notification counts.
 * 
 * @example
 * ```tsx
 * // Status badge for urgent items
 * <Badge variant="status" color="error" size="medium">
 *   OVERDUE
 * </Badge>
 * 
 * // Category badge for equipment type
 * <Badge variant="category" color="primary">
 *   HVAC
 * </Badge>
 * 
 * // Count badge for notifications
 * <Badge variant="count" color="accent" size="small">
 *   3
 * </Badge>
 * ```
 */
export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  className?: string;
  testId?: string;
}

const baseStyles = [
  'font-mono',
  'font-black',
  'uppercase',
  'tracking-wider',
  'inline-flex',
  'items-center',
  'justify-center',
  'border-4',
  'border-text-primary',
  'whitespace-nowrap'
];

const variantStyles = {
  status: ['px-3', 'py-1', 'rounded-none'],
  category: ['px-2', 'py-1', 'rounded-none'],
  count: ['px-2', 'py-1', 'rounded-full', 'min-w-[2rem]']
};

const sizeStyles = {
  small: ['text-xs', 'px-2', 'py-0.5'],
  medium: ['text-sm', 'px-3', 'py-1'],
  large: ['text-base', 'px-4', 'py-1.5']
};

const colorStyles = {
  primary: {
    background: 'bg-primary',
    text: 'text-white',
    shadow: 'brutal-shadow-dark'
  },
  secondary: {
    background: 'bg-secondary',
    text: 'text-white',
    shadow: 'brutal-shadow-dark'
  },
  accent: {
    background: 'bg-accent',
    text: 'text-white',
    shadow: 'brutal-shadow-dark'
  },
  dark: {
    background: 'bg-text-primary',
    text: 'text-white',
    shadow: 'brutal-shadow-primary'
  },
  error: {
    background: 'bg-error',
    text: 'text-white',
    shadow: 'brutal-shadow-dark'
  },
  success: {
    background: 'bg-accent',
    text: 'text-white',
    shadow: 'brutal-shadow-dark'
  },
  warning: {
    background: 'bg-primary',
    text: 'text-white',
    shadow: 'brutal-shadow-dark'
  }
};

export const Badge = ({
  children,
  variant = 'status',
  color = 'primary',
  size = 'medium',
  className = '',
  testId = 'badge'
}: BadgeProps) => {
  const colorStyle = colorStyles[color];
  
  const badgeStyles = [
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    colorStyle.background,
    colorStyle.text,
    colorStyle.shadow,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={badgeStyles} data-testid={testId}>
      {children}
    </span>
  );
};