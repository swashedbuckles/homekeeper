
import type {ReactNode} from 'react';

export type MaxPageWidth = 'md' | 'lg' | 'xl' | '2xl'

/**
 * Page container for forms and narrow-content
 * 
 * @param children nested content
 * @param className additional classes to apply
 * @param maxWidth container max width, defaults to lg
 */
export const PageContainer = ({ 
  children, 
  className = '',
  maxWidth = 'lg'
}: { 
  children: ReactNode;
  className?: string;
  maxWidth?: MaxPageWidth
}) => {
  return (
    <div className={`max-w-${maxWidth} mx-auto px-6 py-12 ${className}`}>
      {children}
    </div>
  );
};