import { Link } from 'react-router';
import type { ReactNode } from 'react';

type TextLinkVariant = 'primary' | 'secondary' | 'subtle' | 'danger';
type TextLinkSize = 'small' | 'medium' | 'large';

/**
 * TextLink Component.
 * 
 * Styled links with brutal design aesthetics. Automatically uses React Router's Link
 * for internal routes and <a> tags for external URLs. Supports different variants,
 * sizes, and hover states.
 * 
 * @example
 * ```tsx
 * // Internal link (uses React Router Link)
 * <TextLink to="/manuals" variant="primary">
 *   View All Manuals
 * </TextLink>
 * 
 * // External link (uses <a> tag)
 * <TextLink href="https://example.com" variant="secondary" target="_blank">
 *   External Resource
 * </TextLink>
 * 
 * // Link with onClick handler
 * <TextLink onClick={() => alert('clicked')} variant="subtle" size="small">
 *   Click Handler
 * </TextLink>
 * ```
 */
export interface TextLinkProps {
  children: ReactNode;
  to?: string;           // For internal React Router navigation
  href?: string;         // For external URLs
  onClick?: () => void;
  variant?: TextLinkVariant;
  size?: TextLinkSize;
  className?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  testId?: string;
}

const baseStyles = [
  'font-mono',
  'font-bold',
  'uppercase',
  'tracking-wide',
  'cursor-pointer',
  'transition-all',
  'duration-100',
  'ease-in-out',
  'border-b-4',
  'hover:transform',
  'hover:translate-y-[-2px]',
  'active:transform',
  'active:translate-y-[1px]'
];

const variantStyles = {
  primary: [
    'text-primary',
    'border-primary',
    'hover:text-text-primary',
    'hover:border-text-primary'
  ],
  secondary: [
    'text-secondary',
    'border-secondary',
    'hover:text-text-primary',
    'hover:border-text-primary'
  ],
  subtle: [
    'text-text-secondary',
    'border-text-secondary',
    'hover:text-text-primary',
    'hover:border-text-primary'
  ],
  danger: [
    'text-error',
    'border-error',
    'hover:text-text-primary',
    'hover:border-text-primary'
  ]
};

const sizeStyles = {
  small: ['text-sm', 'border-b-2'],
  medium: ['text-base', 'border-b-4'],
  large: ['text-lg', 'border-b-4']
};

export const TextLink = ({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  size = 'medium',
  className = '',
  target = '_self',
  testId = 'text-link'
}: TextLinkProps) => {
  const linkStyles = [
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  // Internal routing with React Router Link
  if (to) {
    return (
      <Link
        to={to}
        onClick={handleClick}
        className={linkStyles}
        data-testid={testId}
      >
        {children}
      </Link>
    );
  }

  // External URLs or onClick handlers with <a> tag
  return (
    <a
      href={href}
      onClick={handleClick}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={linkStyles}
      data-testid={testId}
    >
      {children}
    </a>
  );
};