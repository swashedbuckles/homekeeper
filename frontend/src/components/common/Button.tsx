import type { ReactNode } from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
  size?: 'small' | 'default' | 'large';
  disabled?: boolean;
  /** whether to display loading text / spinner */
  loading?: boolean;
  loadingText?: string;
  /** button usage */
  type?: 'button' | 'submit' | 'reset';
  /** set button to full-width of its parent? */
  full?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  testId?: string;
  className?: string;
  children: ReactNode;
}


const baseStyles = [
  'font-mono',
  'font-black',
  'uppercase',
  'tracking-wider',
  'brutal-transition',
  'focus:outline-none',
  'disabled:opacity-50',
  'disabled:cursor-not-allowed'
];

// Size variations
const sizeStyles = {
  small: [
    'px-4',
    'py-2',
    'text-sm',
    'border-brutal-sm',
    'brutal-shadow-primary',
    'brutal-hover-press-small'
  ],
  default: [
    'px-6',
    'py-3',
    'text-base',
    'border-brutal-md',
    'brutal-shadow-dark',
    'brutal-hover-press'
  ],
  large: [
    'px-8',
    'py-4',
    'text-lg',
    'border-brutal-lg',
    'brutal-shadow-dark',
    'brutal-hover-press'
  ]
};

// Variant styles - colors and borders
const variantStyles = {
  primary: [
    'bg-primary',
    'text-white',
    'border-text-primary'
  ],
  secondary: [
    'bg-secondary',
    'text-white',
    'border-text-primary'
  ],
  outline: [
    'bg-transparent',
    'text-text-primary',
    'border-text-primary',
    'hover:bg-text-primary',
    'hover:text-white'
  ],
  danger: [
    'bg-error',
    'text-white',
    'border-text-primary'
  ],
  text: [
    'bg-transparent',
    'text-primary',
    'border-transparent',
    'hover:bg-primary/8',
    'px-3',
    'py-1',
    'text-sm',
    // Override shadow and hover for text variant
    '!shadow-none',
    '!hover:transform-none'
  ]
};

/**
 * Standardized button type for use throughout the application. 
 * Handles loading state and provides additional variations. 
 * 
 */
export const Button = ({
  variant = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  loadingText = 'Loading...',
  type = 'button',
  full = false,
  children,
  onClick,
  className,
  testId
}: ButtonProps) => {
  const isDisabled = disabled || loading;


  // Handle disabled state - override hover effects
  const disabledStyles = isDisabled ? [
    '!hover:transform-none',
    '!hover:shadow-[var(--shadow-brutal-lg)_var(--shadow-dark)]'
  ] : [];

  const buttonStyles = [
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...disabledStyles,
    full ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={buttonStyles}
      data-testid={testId}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
};