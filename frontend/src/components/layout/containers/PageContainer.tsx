
import { type ContainerWidthSize, getContainerWidth } from '../../../lib/design-system/sizes';
import type {ReactNode} from 'react';

export type MaxPageWidth = ContainerWidthSize;

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
  const maxWidthClass = getContainerWidth(maxWidth);
  
  return (
    <div className={`${maxWidthClass} mx-auto px-6 py-12 ${className}`}>
      {children}
    </div>
  );
};