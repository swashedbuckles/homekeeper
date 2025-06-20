import type { ReactNode } from 'react';

type TitleVariant = 'page' | 'section' | 'subsection';

export interface PageTitleProps {
  children: ReactNode;
  variant?: TitleVariant;
  className?: string;
  description?: string;
}

const variantStyles = {
  page: 'text-2xl md:text-3xl font-bold text-text-primary',
  section: 'text-lg md:text-xl font-semibold text-text-primary', 
  subsection: 'text-base md:text-lg font-semibold text-text-primary'
};

const variantTags = {
  page: 'h1',
  section: 'h2', 
  subsection: 'h3'
} as const;

export const PageTitle = ({ 
  children, 
  variant = 'page', 
  className = '', 
  description 
}: PageTitleProps) => {
  const Tag = variantTags[variant];
  const baseStyles = variantStyles[variant];
  const combinedStyles = `${baseStyles} ${className}`.trim();
  
  return (
    <div className={variant === 'page' ? 'mb-6' : 'mb-4'}>
      <Tag className={combinedStyles}>
        {children}
      </Tag>
      {description && (
        <p className="text-text-secondary mt-2">
          {description}
        </p>
      )}
    </div>
  );
};
