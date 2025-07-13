import { type StandardColor, getTextColor } from '../../lib/design-system/colors';
import { type StandardSize, getResponsiveTextToken } from '../../lib/design-system/sizes';
import type { ReactNode } from 'react';

type TextVariant = 'body' | 'caption' | 'label';
type TextSize = StandardSize;
type TextWeight = 'normal' | 'bold' | 'black';
type TextColor = StandardColor;

/**
 * Text Component.
 * 
 * Provides consistent typography for body text, captions, and labels with
 * monospace fonts and brutal design styling. Handles general text content
 * that doesn't require the semantic weight of Title components.
 * 
 * @example
 * ```tsx
 * // Body text for descriptions
 * <Text variant="body" size="large">
 *   This is the main description text for the manual.
 * </Text>
 * 
 * // Caption text for metadata
 * <Text variant="caption" color="secondary">
 *   Last updated 2 days ago
 * </Text>
 * 
 * // Label text for forms and fields
 * <Text variant="label" weight="bold">
 *   Equipment Type
 * </Text>
 * ```
 */
export interface TextProps {
  children: ReactNode;
  variant?: TextVariant;
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  className?: string;
  uppercase?: boolean;
  testId?: string;
}

const baseStyles = [
  'font-mono',
  'leading-relaxed'
];


const getSizeStyles = (size: StandardSize, variant: TextVariant): string[] => {
  // Get smaller size for caption and label variants
  const getSmallerSize = (currentSize: StandardSize): StandardSize => {
    const sizeOrder: StandardSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    const currentIndex = sizeOrder.indexOf(currentSize);
    return currentIndex > 0 ? sizeOrder[currentIndex - 1] : currentSize;
  };
  
  const variantAdjustments = {
    body:    [getResponsiveTextToken(size)],                   // Use responsive scaling
    caption: [getResponsiveTextToken(getSmallerSize(size))],   // One size smaller
    label:   [getResponsiveTextToken(getSmallerSize(size))] 
  };
  
  const styles = [...variantAdjustments[variant]];
  if (variant === 'label') {
    styles.push('tracking-wide');
  }
  
  return styles;
};

const weightStyles = {
  normal: ['font-normal'],
  bold:   ['font-bold'],
  black:  ['font-black']
};

const getColorStyles = (color: StandardColor): string[] => [
  getTextColor(color)
];

export const Text = ({
  children,
  variant = 'body',
  size = 'md',
  weight = 'normal',
  color = 'dark',
  className = '',
  uppercase = false,
  testId = 'text'
}: TextProps) => {
  const textStyles = [
    ...baseStyles,
    ...getSizeStyles(size, variant),
    ...weightStyles[weight],
    ...getColorStyles(color),
    uppercase ? 'uppercase' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={textStyles} data-testid={testId}>
      {children}
    </span>
  );
};