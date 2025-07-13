import { type StandardSize, getSizeToken } from '../../lib/design-system/sizes';
import type { ReactNode } from 'react';

/**
 * Flex Component - Simplified
 * 
 * Minimal flexbox utility that focuses on consistent spacing from the design system.
 * For alignment, direction, and other flex properties, use Tailwind classes directly.
 * 
 * @example
 * ```tsx
 * // Header with consistent spacing - use Tailwind for alignment
 * <Flex spacing="md" className="justify-between items-center">
 *   <Title>Dashboard</Title>
 *   <Button>Add New</Button>
 * </Flex>
 * 
 * // Vertical stack with design system spacing
 * <Flex spacing="lg" className="flex-col">
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </Flex>
 * 
 * // Button group with wrapping and responsive classes
 * <Flex spacing="sm" className="flex-wrap justify-center md:justify-start">
 *   <Button>Action 1</Button>
 *   <Button>Action 2</Button>
 *   <Button>Action 3</Button>
 * </Flex>
 * ```
 */
export interface FlexProps {
  children: ReactNode;
  spacing?: StandardSize;
  className?: string;
  testId?: string;
}

export const Flex = ({
  children,
  spacing = 'md',
  className = '',
  testId = 'flex',
  ...props
}: FlexProps & React.HTMLAttributes<HTMLDivElement>) => {
  const spacingClass = getSizeToken(spacing, 'spacing');
  
  const flexClasses = [
    'flex',
    spacingClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={flexClasses} data-testid={testId} {...props}>
      {children}
    </div>
  );
};

// Stack component - vertical flex with design system spacing
interface StackProps extends Omit<FlexProps, 'className'> {
  className?: string;
}

export const Stack = ({ className = '', ...props }: StackProps) => (
  <Flex className={`flex-col ${className}`} {...props} />
);

// Inline component - horizontal flex with design system spacing
interface InlineProps extends Omit<FlexProps, 'className'> {
  className?: string;
}

export const Inline = ({ className = '', ...props }: InlineProps) => (
  <Flex className={`flex-row ${className}`} {...props} />
);