import { type WideContainerSize, getContainerWidth } from '../../../lib/design-system/sizes';
import type {ReactNode} from 'react';

export type ContentMaxWidth = WideContainerSize;

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
  const maxWidthClass = getContainerWidth(maxWidth);
  
  return (
    <div className={`${maxWidthClass} mx-auto px-5 ${className}`}>
      {children}
    </div>
  );
};