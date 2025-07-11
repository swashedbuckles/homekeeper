import type { ReactNode } from 'react';

type TextVariant = 'body' | 'caption' | 'label';
type TextSize = 'small' | 'medium' | 'large';
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

const variantStyles = {
  body: ['text-base'],
  caption: ['text-sm'],
  label: ['text-sm', 'tracking-wide']
};

const sizeStyles = {
  small: {
    body: ['text-sm'],
    caption: ['text-xs'],
    label: ['text-xs']
  },
  medium: {
    body: ['text-base'],
    caption: ['text-sm'], 
    label: ['text-sm']
  },
  large: {
    body: ['text-lg'],
    caption: ['text-base'],
    label: ['text-base']
  }
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
  size = 'medium',
  weight = 'normal',
  color = 'dark',
  className = '',
  uppercase = false,
  testId = 'text'
}: TextProps) => {
  const textStyles = [
    ...baseStyles,
    ...sizeStyles[size][variant],
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