import { type StandardSize, getSizeToken } from '../../lib/design-system/sizes';
import type { ReactNode } from 'react';

type CodeVariant = 'inline' | 'block';
type CodeSize = StandardSize;

/**
 * Code Component.
 * 
 * Displays code, model numbers, serial numbers, and technical specifications
 * with monospace font and brutal styling. Supports inline and block variants
 * with different sizes and styling options.
 * 
 * @example
 * ```tsx
 * // Inline code for model numbers
 * <Code>Model: ABC-123-XYZ</Code>
 * 
 * // Block code for longer technical specs
 * <Code variant="block" size="large">
 *   Serial: 987654321
 *   Manufactured: 2023-01-15
 *   Warranty: 5 years
 * </Code>
 * 
 * // Small inline code for IDs
 * <Code size="small">ID: #12345</Code>
 * ```
 */
export interface CodeProps {
  children: ReactNode;
  variant?: CodeVariant;
  size?: CodeSize;
  className?: string;
  testId?: string;
}

const baseStyles = [
  'font-mono',
  'font-bold',
  'bg-background',
  'border-text-primary',
  'text-text-primary'
];

const variantStyles = {
  inline: [
    'inline-block',
    'px-2',
    'py-1',
    'mx-1'
  ],
  block: [
    'block',
    'p-4',
    'my-2',
    'whitespace-pre-wrap',
    'brutal-shadow-primary'
  ]
};

const getSizeStyles = (size: StandardSize, variant: CodeVariant): string[] => {
  const baseText = getSizeToken(size, 'text');
  const paddingX = getSizeToken(size, 'paddingX');
  const paddingY = getSizeToken(size, 'paddingY');
  const padding = getSizeToken(size, 'padding');
  const border = getSizeToken(size, 'border');
  
  if (variant === 'inline') {
    return [baseText, paddingX, paddingY, border];
  } else {
    return [baseText, padding, border];
  }
};

export const Code = ({
  children,
  variant = 'inline',
  size = 'md',
  className = '',
  testId = 'code'
}: CodeProps) => {
  const codeStyles = [
    ...baseStyles,
    ...variantStyles[variant],
    ...getSizeStyles(size, variant),
    className
  ].filter(Boolean).join(' ');

  const Component = variant === 'block' ? 'pre' : 'code';

  return (
    <Component className={codeStyles} data-testid={testId}>
      {children}
    </Component>
  );
};