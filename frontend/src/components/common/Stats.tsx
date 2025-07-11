import { type StandardSize, getSizeToken } from '../../lib/design-system/sizes';
import type { ReactNode } from 'react';

type StatsSize = StandardSize;
type StatsColor = 'primary' | 'secondary' | 'accent' | 'dark' | 'error' | 'white';

/**
 * Stats Component.
 * 
 * Displays large numeric values with labels in brutal design style.
 * Perfect for dashboard statistics, counts, and key metrics.
 * Uses large, bold typography with optional color variants.
 * 
 * @example
 * ```tsx
 * // Large stat for dashboard
 * <Stats value={47} label="Total Manuals" size="large" />
 * 
 * // Currency stat with color
 * <Stats value="$2,340" label="Saved This Year" color="accent" />
 * 
 * // Small stat with subtitle
 * <Stats 
 *   value={12} 
 *   label="Due This Week" 
 *   subtitle="+3 from last week"
 *   size="small" 
 *   color="error" 
 * />
 * ```
 */
export interface StatsProps {
  value: ReactNode;
  label: string;
  subtitle?: string;
  size?: StatsSize;
  color?: StatsColor;
  className?: string;
  testId?: string;
}

const baseStyles = [
  'font-mono',
  'text-center'
];

const getValueStyles = (size: StandardSize): string[] => {
  const sizeMap = {
    xs: ['text-xl', 'md:text-2xl'],
    sm: ['text-2xl', 'md:text-3xl'],
    md: ['text-4xl', 'md:text-5xl'],
    lg: ['text-5xl', 'md:text-6xl', 'lg:text-7xl'],
    xl: ['text-6xl', 'md:text-7xl', 'lg:text-8xl']
  };
  return sizeMap[size];
};

const getLabelStyles = (size: StandardSize): string[] => {
  const textSize = getSizeToken(size, 'text');
  const spacing = size === 'xs' || size === 'sm' ? 'mt-1' : size === 'md' ? 'mt-2' : 'mt-3';
  return [textSize, spacing];
};

const getSubtitleStyles = (size: StandardSize): string[] => {
  const textSize = size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-lg';
  const spacing = size === 'lg' || size === 'xl' ? 'mt-2' : 'mt-1';
  return [textSize, spacing];
};

const colorStyles = {
  primary: {
    value: 'text-primary',
    label: 'text-text-primary',
    subtitle: 'text-text-secondary'
  },
  secondary: {
    value: 'text-secondary',
    label: 'text-text-primary',
    subtitle: 'text-text-secondary'
  },
  accent: {
    value: 'text-accent',
    label: 'text-text-primary',
    subtitle: 'text-text-secondary'
  },
  dark: {
    value: 'text-text-primary',
    label: 'text-text-primary',
    subtitle: 'text-text-secondary'
  },
  error: {
    value: 'text-error',
    label: 'text-text-primary',
    subtitle: 'text-text-secondary'
  },
  white: {
    value: 'text-white',
    label: 'text-white',
    subtitle: 'text-white/80'
  }
};

export const Stats = ({
  value,
  label,
  subtitle,
  size = 'md',
  color = 'primary',
  className = '',
  testId = 'stats'
}: StatsProps) => {
  const colorStyle = colorStyles[color];
  
  const containerStyles = [
    ...baseStyles,
    className
  ].filter(Boolean).join(' ');

  const valueClassName = [
    'font-black',
    'leading-none',
    'tracking-tight',
    ...getValueStyles(size),
    colorStyle.value
  ].join(' ');

  const labelClassName = [
    'font-bold',
    'uppercase',
    'tracking-wide',
    ...getLabelStyles(size),
    colorStyle.label
  ].join(' ');

  const subtitleClassName = subtitle ? [
    'font-bold',
    'uppercase',
    'tracking-wide',
    ...getSubtitleStyles(size),
    colorStyle.subtitle
  ].join(' ') : '';

  return (
    <div className={containerStyles} data-testid={testId}>
      <div className={valueClassName}>
        {value}
      </div>
      <div className={labelClassName}>
        {label}
      </div>
      {subtitle && (
        <div className={subtitleClassName}>
          {subtitle}
        </div>
      )}
    </div>
  );
};