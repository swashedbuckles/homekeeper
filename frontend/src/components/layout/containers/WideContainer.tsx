import { type WideContainerSize, getContainerWidth } from '../../../lib/design-system/sizes';
import type {ReactNode} from 'react';

export type MaxWideWidth = WideContainerSize;
export interface WideContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: MaxWideWidth
}
/**
 * Wide container for dashboards, multi-column layouts, and expansive content
 * 
 * @param children nested content
 * @param className additional classes to apply
 * @param maxWidth container max width, defaults to 7xl
 */
export const WideContainer = ({ 
  children, 
  className = '',
  maxWidth = '7xl'
}: WideContainerProps) => {
  const maxWidthClass = getContainerWidth(maxWidth);
  
  return (
    <div className={`${maxWidthClass} mx-auto px-5 ${className}`}>
      {children}
    </div>
  );
};