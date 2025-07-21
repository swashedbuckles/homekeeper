import { getBackgroundColor } from '../../lib/design-system/colors';
import { getSizeToken } from '../../lib/design-system/sizes';

import type { StandardColor } from '../../lib/design-system/colors';
import type { StandardSize } from '../../lib/design-system/sizes';

/**
 * Progress bar component with neobrutalist styling
 * 
 * Provides visual feedback for task completion, file uploads, and system status.
 * Based on design mockup specifications with smart text handling.
 * 
 * @example Basic usage
 * ```tsx
 * <ProgressBar value={75} />
 * ```
 * 
 * @example Equipment status with label and percentage
 * ```tsx
 * <ProgressBar 
 *   value={65} 
 *   label="HVAC Maintenance" 
 *   showPercentage 
 *   variant="warning"
 *   size="lg"
 * />
 * ```
 * 
 * @example File upload progress
 * ```tsx
 * <ProgressBar 
 *   value={uploadProgress} 
 *   max={100}
 *   label="manual_hvac.pdf - Uploading..."
 *   showPercentage
 * />
 * ```
 */
export interface ProgressBarProps {
  /** Progress value between 0 and max. Values outside range are automatically clamped. */
  value: number;
  /** Maximum value for progress calculation. @default 100 */
  max?: number;
  /** Color variant following design system. @default 'primary' */
  variant?: StandardColor;
  /** 
   * Size variant with fixed heights:
   * - xs: 4px (no text)
   * - sm: 6px (no text) 
   * - md: 20px (with text)
   * - lg: 24px (with text)
   * - xl: 32px (with text)
   * @default 'md'
   */
  size?: StandardSize;
  /** Optional label displayed above progress bar for accessibility */
  label?: string;
  /** 
   * Show percentage text inside progress bar.
   * Text automatically suppressed on xs/sm sizes for readability.
   * @default false 
   */
  showPercentage?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Maps size variants to fixed Tailwind height classes
 * Ensures consistent heights regardless of text presence
 */
const getProgressHeight = (size: StandardSize): string => {
  const heights = {
    xs: 'h-1',      // 4px - thin, no text
    sm: 'h-1.5',    // 6px - thin, no text
    md: 'h-5',      // 20px - fits text + padding
    lg: 'h-6',      // 24px - fits text + padding  
    xl: 'h-8'       // 32px - fits text + padding
  };
  return heights[size];
};

/**
 * Maps size variants to appropriate border thickness
 * Uses thin borders to maximize progress fill visibility
 */
const getProgressBorder = (size: StandardSize): string => {
  const borders = {
    xs: 'border',         // 1px - thin but visible
    sm: 'border',         // 1px - maintains readability  
    md: 'border-2',       // 2px - matches mockup standard
    lg: 'border-2',       // 2px - good proportion
    xl: 'border-2'        // 2px - consistent with mockup
  };
  return borders[size];
};

/**
 * Maps size variants to appropriate text sizes for percentage display
 * Scales down text to fit comfortably within progress bar height
 */
const getProgressTextSize = (size: StandardSize): string => {
  const textSizes = {
    xs: 'text-xs',      // Not used - text suppressed
    sm: 'text-xs',      // Not used - text suppressed
    md: 'text-xs',      // 12px - small but readable in 20px container
    lg: 'text-sm',      // 14px - good fit in 24px container  
    xl: 'text-base'     // 16px - comfortable in 32px container
  };
  return textSizes[size];
};

/**
 * Determines if percentage text should be displayed based on size readability
 * Automatically suppresses text on xs/sm sizes to prevent unreadable display
 */
const shouldShowPercentageText = (size: StandardSize, showPercentage: boolean): boolean => {
  if (!showPercentage) return false;
  
  const readableSizes: StandardSize[] = ['md', 'lg', 'xl'];
  return readableSizes.includes(size);
};

export const ProgressBar = ({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  label,
  showPercentage = false,
  className
}: ProgressBarProps) => {
  const clampedValue = Math.min(Math.max(value, 0), max);
  const percentage = (clampedValue / max) * 100;
  
  const shouldShowText = shouldShowPercentageText(size, showPercentage);

  const containerStyles = [
    'relative',
    'overflow-hidden',
    'bg-subtle',
    getProgressBorder(size),
    'border-text-primary',
    getProgressHeight(size),
    'brutal-transition'
  ].filter(Boolean).join(' ');

  const progressStyles = [
    getBackgroundColor(variant),
    'h-full',
    'brutal-transition',
    'transition-all duration-300 ease-out'
  ].filter(Boolean).join(' ');

  const textStyles = [
    'absolute inset-0',
    'flex items-center justify-center',
    'font-mono font-black',
    getProgressTextSize(size),
    'text-text-primary',
    'pointer-events-none'
  ].join(' ');

  return (
    <div className={className}>
      {label && (
        <div className={`font-mono font-bold text-xs text-text-primary mb-1 ${getSizeToken(size, 'text')}`}>
          {label}
        </div>
      )}
      <div 
        className={containerStyles}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div 
          className={progressStyles}
          style={{ width: `${percentage}%` }}
        />
        {shouldShowText && (
          <div className={textStyles}>
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    </div>
  );
};
