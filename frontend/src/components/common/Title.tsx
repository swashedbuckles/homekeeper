import type { ReactNode } from 'react';

type TitleVariant = 'hero' | 'page' | 'section' | 'subsection';

/**
 * Title Component.
 * 
 * Provides consistent typography hierarchy with monospace fonts,
 * bold weights, uppercase text, and optional text shadows. Supports semantic HTML tags
 * and optional descriptions.
 * 
 * @example
 * ```tsx
 * // Page title with orange shadow
 * <Title variant="page" textShadow="orange" description="Manage your household efficiently">
 *   Household Dashboard
 * </Title>
 * 
 * // Section title with dark shadow
 * <Title variant="section" textShadow="dark">
 *   Recent Activity
 * </Title>
 * 
 * // Subsection title with orange-dark double shadow and rotation
 * <Title variant="subsection" textShadow="orange-dark" rotation="slight-left">
 *   Task Details
 * </Title>
 * 
 * // Title with dark-orange double shadow
 * <Title variant="page" textShadow="dark-orange">
 *   Alternative Style
 * </Title>
 * 
 * // Title with no shadow
 * <Title variant="page" textShadow="none">
 *   Clean Title
 * </Title>
 * ```
 */

/**
 * Props for Title component
 * 
 * @public
 */
export interface TitleProps {
  /** Content to display in the title element */
  children: ReactNode;
  /** Title variant that determines sizing and semantic HTML tag */
  variant?: TitleVariant;
  /** Additional CSS classes to apply */
  className?: string;
  /** Optional description text to display below the title */
  description?: string;
  /** Text shadow style to apply for visual emphasis */
  textShadow?: 'none' | 'orange' | 'dark' | 'orange-dark' | 'dark-orange';
  /** Rotation angle for visual interest */
  rotation?: 'none' | 'left' | 'right' | 'slight-left' | 'slight-right';
  /** Test identifier for automated testing */
  testId?: string;
}

const baseStyles = [
  'font-mono',
  'font-black',
  'uppercase',
  'tracking-wide',
  'text-text-primary',
  'leading-none'
];

const variantStyles = {
  hero: [
    'text-5xl',
    'md:text-7xl',
    'lg:text-8xl',
    'mb-6'
  ],
  page: [
    'text-4xl',
    'sm:text-5xl',
    'md:text-6xl',
    'lg:text-7xl',
    'mb-4',
    'md:mb-6'
  ],
  section: [
    'text-3xl',
    'md:text-5xl',
    'mb-4'
  ],
  subsection: [
    'text-2xl',
    'md:text-3xl',
    'lg:text-4xl',
    'mb-3'
  ]
};

// Simple text shadow mapping
const getTextShadowClass = (
  variant: TitleVariant,
  shadowType: 'none' | 'orange' | 'dark' | 'orange-dark' | 'dark-orange'
) => {
  if (shadowType === 'none') return '';
  
  // Use size-appropriate shadows for each variant
  const shadowMap = {
    orange: {
      hero:       'brutal-text-shadow',         // 4px orange
      page:       'brutal-text-shadow',         // 4px orange
      section:    'brutal-text-shadow-small',   // 2px orange  
      subsection: 'brutal-text-shadow-tiny'     // 1px orange
    },
    dark: {
      hero:       'brutal-text-shadow-simple',   // 2px dark
      page:       'brutal-text-shadow-simple',   // 2px dark
      section:    'brutal-text-shadow-simple',   // 2px dark
      subsection: 'brutal-text-shadow-simple'    // 2px dark
    },
    'orange-dark': {
      hero:       'brutal-text-shadow-double',   // 4px orange + 8px dark
      page:       'brutal-text-shadow-double',   // 4px orange + 8px dark
      section:    'brutal-text-shadow-double',   // 4px orange + 8px dark  
      subsection: 'brutal-text-shadow-double'    // 4px orange + 8px dark
    },
    'dark-orange': {
      hero:       'brutal-text-shadow-double-reverse',   // 4px dark + 8px orange
      page:       'brutal-text-shadow-double-reverse',   // 4px dark + 8px orange
      section:    'brutal-text-shadow-double-reverse',   // 4px dark + 8px orange
      subsection: 'brutal-text-shadow-double-reverse'    // 4px dark + 8px orange
    }
  };
  
  // Error handling for invalid shadowType
  if (!shadowMap[shadowType]) {
    console.warn(`Invalid shadowType: "${shadowType}". Using default orange shadow.`);
    return shadowMap.orange[variant];
  }
  
  return shadowMap[shadowType][variant];
};

const rotationStyles = {
  none:           '',
  left:           'brutal-rotate-left',
  right:          'brutal-rotate-right',
  'slight-left':  'brutal-rotate-slight-left',
  'slight-right': 'brutal-rotate-slight-right'
};

const variantTags = {
  hero: 'h1',
  page: 'h1',
  section: 'h2', 
  subsection: 'h3'
} as const;

export const Title = ({ 
  children, 
  variant = 'page', 
  className = '',
  description,
  textShadow = 'none',
  rotation = 'none',
  testId = 'title'
}: TitleProps) => {
  const Tag = variantTags[variant];
  
  const titleStyles = [
    ...baseStyles,
    ...variantStyles[variant],
    getTextShadowClass(variant, textShadow),
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
