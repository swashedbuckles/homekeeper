import type { ReactNode } from 'react';

type TitleVariant = 'page' | 'section' | 'subsection';

/**
 * Title Component.
 * 
 * Provides consistent typography hierarchy with monospace fonts,
 * bold weights, uppercase text, and optional text shadows. Supports semantic HTML tags
 * and optional descriptions.
 * 
 * @example
 * ```tsx
 * // Page title with description
 * <Title variant="page" description="Manage your household efficiently">
 *   Household Dashboard
 * </Title>
 * 
 * // Section title with text shadow
 * <Title variant="section" textShadow>
 *   Recent Activity
 * </Title>
 * 
 * // Subsection title with rotation
 * <Title variant="subsection" rotation="slight-left">
 *   Task Details
 * </Title>
 * ```
 */
export interface TitleProps {
  children: ReactNode;
  variant?: TitleVariant;
  className?: string;
  description?: string;
  textShadow?: boolean;
  rotation?: 'none' | 'left' | 'right' | 'slight-left' | 'slight-right';
  testId?: string;
}

const baseStyles = [
  'font-mono',
  'font-black',
  'uppercase',
  'tracking-wide',
  'text-text-primary',
  'leading-tight'
];

const variantStyles = {
  page: [
    'text-4xl',
    'md:text-6xl',
    'mb-6'
  ],
  section: [
    'text-2xl',
    'md:text-4xl',
    'mb-4'
  ],
  subsection: [
    'text-xl',
    'md:text-2xl',
    'mb-3'
  ]
};

const textShadowStyles = {
  page: 'brutal-text-shadow md:brutal-text-shadow-double',
  section: 'brutal-text-shadow-small',
  subsection: 'brutal-text-shadow-tiny'
};

const rotationStyles = {
  none: '',
  left: 'brutal-rotate-left',
  right: 'brutal-rotate-right',
  'slight-left': 'brutal-rotate-slight-left',
  'slight-right': 'brutal-rotate-slight-right'
};

const variantTags = {
  page: 'h1',
  section: 'h2', 
  subsection: 'h3'
} as const;

export const Title = ({ 
  children, 
  variant = 'page', 
  className = '',
  description,
  textShadow = false,
  rotation = 'none',
  testId = 'title'
}: TitleProps) => {
  const Tag = variantTags[variant];
  
  const titleStyles = [
    ...baseStyles,
    ...variantStyles[variant],
    textShadow ? textShadowStyles[variant] : '',
    rotationStyles[rotation],
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div data-testid={testId}>
      <Tag className={titleStyles}>
        {children}
      </Tag>
      {description && (
        <p className="text-text-secondary font-mono font-bold uppercase text-sm tracking-wide mt-4 max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
};

// Keep PageTitle as alias for backward compatibility
export const PageTitle = Title;
export type PageTitleProps = TitleProps;
