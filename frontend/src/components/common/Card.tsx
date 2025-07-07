import type { ReactNode } from 'react';

/**
 * Base Card Component.
 * 
 * Provides consistent theming with thick borders, bold shadows, and optional interactions.
 * All specialized card components should build on top of this base.
 * 
 * @example
 * ```tsx
 * // Simple content card
 * <Card variant="default" shadow="triple">
 *   <h2>Card Title</h2>
 *   <p>Card content here</p>
 * </Card>
 * 
 * // Interactive colored card with hover effect
 * <Card variant="primary" hover rotation="slight-left" onClick={() => navigate('/page')}>
 *   Featured content with interaction
 * </Card>
 * ```
 */
export interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'subtle' | 'primary' | 'secondary' | 'accent' | 'danger' | 'dark';
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'primary' | 'secondary' | 'accent' | 'dark' | 'error' | 'triple';
  rotation?: 'none' | 'left' | 'right' | 'slight-left' | 'slight-right';
  hover?: boolean;
  onClick?: () => void;
  className?: string;
  testId?: string;
}

export const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  shadow = 'dark',
  rotation = 'none',
  hover = false,
  onClick,
  className = '',
  testId = 'card',
}: CardProps) => {
  const isClickable = onClick || hover;
  
  // Base card styles
  const baseStyles = [
    'border-brutal-lg',
    'font-mono'
  ];

  // Padding variations
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8'
  };

  // Variant styles (background, text, border colors)
  const variantStyles = {
    default: [
      'bg-white',
      'text-text-primary',
      'border-text-primary'
    ],
    subtle: [
      'bg-background',
      'text-text-primary',
      'border-text-primary'
    ],
    primary: [
      'bg-primary',
      'text-white',
      'border-white'
    ],
    secondary: [
      'bg-secondary', 
      'text-white',
      'border-white'
    ],
    accent: [
      'bg-accent',
      'text-white', 
      'border-white'
    ],
    danger: [
      'bg-error',
      'text-white',
      'border-white'
    ],
    dark: [
      'bg-text-primary',
      'text-white',
      'border-white'
    ]
  };

  // Shadow variations
  const shadowStyles = {
    none: '',
    primary: 'brutal-shadow-primary',
    secondary: 'brutal-shadow-secondary', 
    accent: 'brutal-shadow-accent',
    dark: 'brutal-shadow-dark',
    error: 'brutal-shadow-error',
    triple: 'brutal-shadow-triple'
  };

  // Rotation variations
  const rotationStyles = {
    none: '',
    left: 'brutal-rotate-left',
    right: 'brutal-rotate-right',
    'slight-left': 'brutal-rotate-slight-left',
    'slight-right': 'brutal-rotate-slight-right'
  };

  // Hover/interaction styles
  const interactiveStyles = isClickable ? [
    'cursor-pointer',
    'brutal-transition'
  ] : [];

  const hoverStyles = hover ? ['brutal-hover-lift'] : [];

  const cardStyles = [
    ...baseStyles,
    paddingStyles[padding],
    ...variantStyles[variant],
    shadowStyles[shadow],
    rotationStyles[rotation],
    ...interactiveStyles,
    ...hoverStyles,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardStyles}
      onClick={onClick}
      data-testid={testId}
    >
      {children}
    </div>
  );
};