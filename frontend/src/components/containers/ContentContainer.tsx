import type {ReactNode} from 'react';

export type ContentMaxWidth =  '4xl' | '5xl' | '6xl' | '7xl' | 'none';

/**
 * Content container with maximum width but allowing full-width children. 
 * 
 * @param children nested content
 * @param className additional classes to apply
 * @param maxWidth container max width, defaults to lg
 */
export const ContentContainer = ({ 
  children, 
  className = '',
  maxWidth = '7xl'
}: { 
  children: ReactNode;
  className?: string;
  maxWidth?: ContentMaxWidth
}) => {
  const maxWidthClass = maxWidth !== 'none' ? `max-w-${maxWidth}` : '';
  
  return (
    <div className={`${maxWidthClass} mx-auto px-5 ${className}`}>
      {children}
    </div>
  );
};