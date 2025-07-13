import { type StandardColor, getBackgroundColor, getTextColor, getShadowColor } from '../../lib/design-system/colors';
import { type StandardSize, getSizeToken } from '../../lib/design-system/sizes';
import type { ReactNode } from 'react';

type BadgeVariant = 'status' | 'category' | 'count';
type BadgeColor = StandardColor;
type BadgeSize = StandardSize;

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
  'border-text-primary',
  'whitespace-nowrap'
];

const variantStyles = {
  status: ['rounded-none'],
  category: ['rounded-none'],
  count: ['rounded-full', 'min-w-[2rem]']
};

const getSizeStyles = (size: StandardSize): string[] => {
  return [
    getSizeToken(size, 'text'),
    getSizeToken(size, 'paddingX'),
    getSizeToken(size, 'paddingY'),
    getSizeToken(size, 'border')
  ];
};

const getColorStyles = (color: StandardColor) => ({
  background: getBackgroundColor(color),
  text: getTextColor('white'),
  shadow: color === 'dark' ? getShadowColor('primary') : getShadowColor('error')
});

export const Badge = ({
  children,
  variant = 'status',
  color = 'primary',
  size = 'sm',
  className = '',
  testId = 'badge'
}: BadgeProps) => {
  const colorStyle = getColorStyles(color);
  
  const badgeStyles = [
    ...baseStyles,
    ...variantStyles[variant],
    ...getSizeStyles(size),
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