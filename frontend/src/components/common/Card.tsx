import type { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'subtle';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  clickable?: boolean;
}

const variantStyles = {
  default: 'bg-white border-ui-border shadow-sm',
  subtle: 'bg-background border-ui-border'
};

const paddingStyles = {
  sm: 'p-4',
  md: 'p-6', 
  lg: 'p-8'
};

export const Card = ({ 
  children, 
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  clickable = false
}: CardProps) => {
  const baseStyles = 'rounded-xl border';
  const interactiveStyles = (onClick || clickable) 
    ? 'hover:shadow-sm transition-shadow cursor-pointer' 
    : '';
  
  const combinedStyles = [
    baseStyles,
    variantStyles[variant],
    paddingStyles[padding],
    interactiveStyles,
    className
  ].filter(Boolean).join(' ');
  
  const Element = onClick ? 'button' : 'div';
  const type = onClick ? 'button' : undefined;
  
  return (
    <Element 
      className={combinedStyles}
      onClick={onClick}
      type={type}
    >
      {children}
    </Element>
  );
};