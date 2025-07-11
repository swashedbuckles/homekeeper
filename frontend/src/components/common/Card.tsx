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
  shadow?: 'none' | 'primary' | 'secondary' | 'accent' | 'dark' | 'error' | 'double' | 'double-white' | 'triple';
  border?: 'default' | 'white' | 'primary' | 'secondary' | 'accent' | 'dark' | 'error';
  rotation?: 'none' | 'left' | 'right' | 'slight-left' | 'slight-right';
  hover?: boolean;
  hoverEffect?: 'lift' | 'raise' | 'press' | 'press-small';
  onClick?: () => void;
  className?: string;
  testId?: string;
}

type variant_t = NonNullable<CardProps['variant']>;
type border_t  = NonNullable<CardProps['border']>;
type shadow_t  = NonNullable<CardProps['shadow']>;

export const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  shadow,
  border,
  rotation = 'none',
  hover = false,
  hoverEffect = 'lift',
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

  // Variant styles (background and text colors)
  const variantStyles = {
    default: [
      'bg-white',
      'text-text-primary'
    ],
    subtle: [
      'bg-background',
      'text-text-primary'
    ],
    primary: [
      'bg-primary',
      'text-white'
    ],
    secondary: [
      'bg-secondary', 
      'text-white'
    ],
    accent: [
      'bg-accent',
      'text-white'
    ],
    danger: [
      'bg-error',
      'text-white'
    ],
    dark: [
      'bg-text-primary',
      'text-white'
    ]
  };

  // Variant defaults for border and shadow
  const variantDefaults: {[key in variant_t]: {border: border_t, shadow: shadow_t}} = {
    default: { border: 'default', shadow: 'dark' },
    subtle: { border: 'default', shadow: 'primary' },
    primary: { border: 'default', shadow: 'dark' },
    secondary: { border: 'default', shadow: 'dark' },
    accent: { border: 'default', shadow: 'dark' },
    danger: { border: 'default', shadow: 'dark' },
    dark: { border: 'default', shadow: 'dark' }
  };

  // Border color options
  const borderStyles = {
    default: 'border-text-primary',
    white: 'border-white',
    primary: 'border-primary',
    secondary: 'border-secondary',
    accent: 'border-accent',
    dark: 'border-text-primary',
    error: 'border-error'
  };

  // Shadow variations
  const shadowStyles = {
    none: '',
    primary: 'brutal-shadow-primary',
    secondary: 'brutal-shadow-secondary', 
    accent: 'brutal-shadow-accent',
    dark: 'brutal-shadow-dark',
    error: 'brutal-shadow-error',
    double: 'brutal-shadow-double',
    'double-white': 'brutal-shadow-double-white',
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

  // Hover effect variations
  const hoverEffectStyles = {
    lift: 'brutal-hover-lift',
    raise: 'brutal-hover',
    press: 'brutal-hover-press',
    'press-small': 'brutal-hover-press-small'
  };

  const hoverStyles = hover ? [hoverEffectStyles[hoverEffect]] : [];

  // Use provided props or fall back to variant defaults
  const finalBorder = border || variantDefaults[variant].border;
  const finalShadow = shadow || variantDefaults[variant].shadow;

  const cardStyles = [
    ...baseStyles,
    paddingStyles[padding],
    ...variantStyles[variant],
    borderStyles[finalBorder],
    shadowStyles[finalShadow],
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