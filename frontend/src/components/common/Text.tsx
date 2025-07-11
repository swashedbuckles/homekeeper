import { type StandardSize, getSizeToken } from '../../lib/design-system/sizes';
import type { ReactNode } from 'react';

type TextVariant = 'body' | 'caption' | 'label';
type TextSize = StandardSize;
type TextWeight = 'normal' | 'bold' | 'black';
type TextColor = 'primary' | 'secondary' | 'accent' | 'dark' | 'error' | 'white';

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
  const baseText = getSizeToken(size, 'text');
  
  // Adjust size for different variants
  const variantAdjustments = {
    body: baseText,
    caption: size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-lg',
    label: size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-lg'
  };
  
  const styles = [variantAdjustments[variant]];
  if (variant === 'label') {
    styles.push('tracking-wide');
  }
  
  return styles;
};

const weightStyles = {
  normal: ['font-normal'],
  bold: ['font-bold'],
  black: ['font-black']
};

const colorStyles = {
  primary: ['text-primary'],
  secondary: ['text-text-secondary'],
  accent: ['text-accent'],
  dark: ['text-text-primary'],
  error: ['text-error'],
  white: ['text-white']
};

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
    ...colorStyles[color],
    uppercase ? 'uppercase' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={textStyles} data-testid={testId}>
      {children}
    </span>
  );
};