import { type StandardColor, getTextColor } from '../../lib/design-system/colors';
import { type StandardSize, getSizeToken } from '../../lib/design-system/sizes';
import { ProgressBar } from './ProgressBar';
import type { ReactNode } from 'react';

type StatsSize = StandardSize;
type StatsColor = StandardColor;

/**
 * Stats Component.
 * 
 * Displays large numeric values with labels in brutal design style.
 * Perfect for dashboard statistics, counts, and key metrics.
 * Uses large, bold typography with optional color variants and progress indicators.
 * 
 * @example Basic stat
 * ```tsx
 * <Stats value={47} label="Total Manuals" size="large" />
 * ```
 * 
 * @example Stat with progress bar
 * ```tsx
 * <Stats 
 *   value="94%" 
 *   label="Equipment Health" 
 *   progressValue={94}
 *   progressColor="accent"
 * />
 * ```
 * 
 * @example Complex stat with subtitle and progress
 * ```tsx
 * <Stats 
 *   value={12} 
 *   label="Due This Week" 
 *   subtitle="+3 from last week"
 *   size="small" 
 *   color="error"
 *   progressValue={75}
 *   progressColor="primary"
 * />
 * ```
 */
export interface StatsProps {
  /** The main value to display (number, string, or React component) */
  value: ReactNode;
  
  /** Label text displayed below the value */
  label: string;
  
  /** Optional subtitle text displayed below the label */
  subtitle?: string;
  
  /** Size variant controlling text size and spacing */
  size?: StatsSize;
  
  /** Color theme for the value text */
  color?: StatsColor;
  
  /** 
   * Optional progress value (0-100) to display a progress bar below the content.
   * When provided, shows a progress indicator for completion percentages,
   * health scores, or other metrics that have a completion state.
   */
  progressValue?: number;
  
  /** 
   * Color theme for the progress bar
   * - `accent`: Green progress bar for positive metrics (health, completion)
   * - `primary`: Orange progress bar for caution metrics (due soon, medium health)
   * - `error`: Red progress bar for urgent metrics (overdue, critical health)  
   * - `secondary`: Blue progress bar for informational metrics
   */
  progressColor?: StandardColor;
  
  /** Additional CSS classes to apply to the root element */
  className?: string;
  
  /** Test identifier for automated testing. Defaults to 'stats' */
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
  progressValue,
  progressColor = 'primary',
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
      {progressValue !== undefined && (
        <div className="mt-4">
          <ProgressBar 
            value={progressValue}
            variant={progressColor}
            size="xs"
            showPercentage={false}
          />
        </div>
      )}
    </div>
  );
};