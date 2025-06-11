// src/components/common/Button.tsx
import type { ReactNode } from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
  onClick?: () => void;
  className?: string; 
  full?: boolean;
}

export const Button = ({
  variant = 'primary',
  disabled = false,
  loading = false,
  loadingText = 'Loading...',
  type = 'button',
  full = false,
  children,
  onClick,
  className,
}: ButtonProps) => {
  const isDisabled = disabled || loading;
  
  const baseStyles = [
    'px-6',
    'py-3', 
    'rounded-lg',
    'font-semibold',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed'
  ];

  const variantStyles = {
    primary: [
      'bg-primary',
      'text-white',
      'hover:bg-opacity-90',
      'focus:ring-primary'
    ],
    secondary: [
      'bg-secondary', 
      'text-white',
      'hover:bg-opacity-90',
      'focus:ring-secondary'
    ],
    outline: [
      'bg-transparent',
      'text-text-primary',
      'border-2',
      'border-text-primary', 
      'hover:bg-text-primary',
      'hover:text-white',
      'focus:ring-text-primary'
    ]
  };

  const buttonStyles = [
    ...baseStyles,
    ...variantStyles[variant],
    full ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={buttonStyles}
    >
      {loading ? <span>{loadingText}</span> : children}
    </button>
  );
};