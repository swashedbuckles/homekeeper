import { type StandardColor, getTextColor } from '../../lib/design-system/colors';
import { type StandardSize, getSizeToken } from '../../lib/design-system/sizes';
import type { ReactNode } from 'react';

type StatsSize = StandardSize;
type StatsColor = StandardColor;

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
  let textSize;
  let spacing;
  
  switch(size) {
    case 'xs': textSize = 'text-xs'; spacing = 'mt-1'; break;
    case 'sm': textSize = 'text-xs'; spacing = 'mt-1'; break;
    case 'md': textSize = 'text-sm'; spacing = 'mt-1'; break;
    case 'lg': textSize = 'text-base'; spacing = 'mt-2'; break;
    case 'xl': textSize = 'text-lg';   spacing = 'mt-2'; break;
    default:   textSize = 'text-base'; spacing = 'mt-1';  
  }
  
  return [textSize, spacing];
};

const getColorStyles = (color: StandardColor) => ({
  value:    getTextColor(color),
  label:    color === 'white' ? getTextColor('white'): getTextColor('dark'),
  subtitle: color === 'white' ? 'text-white/80': getTextColor('secondary')
});

export const Stats = ({
  value,
  label,
  subtitle,
  size = 'md',
  color = 'primary',
  className = '',
  testId = 'stats'
}: StatsProps) => {
  const colorStyle = getColorStyles(color);
  
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