
import { type ContainerWidthSize, getContainerWidth } from '../../../lib/design-system/sizes';
import type {ReactNode} from 'react';

export type MaxNarrowWidth = ContainerWidthSize;

/**
 * Narrow container for forms, single-column content, and focused layouts
 * 
 * @param children nested content
 * @param className additional classes to apply
 * @param maxWidth container max width, defaults to lg
 */
export const NarrowContainer = ({ 
  children, 
  className = '',
  maxWidth = 'lg'
}: { 
  children: ReactNode;
  className?: string;
  maxWidth?: MaxNarrowWidth
}) => {
  const maxWidthClass = getContainerWidth(maxWidth);
  
  return (
    <div className={`${maxWidthClass} mx-auto px-6 py-12 ${className}`}>
      {children}
    </div>
  );
};