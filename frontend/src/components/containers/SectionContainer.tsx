import { type ContainerSpacingSize, getContainerSpacing } from '../../lib/design-system/sizes';
import { ContentContainer } from './ContentContainer';
import type { ReactNode } from 'react';

export type ContainerSpacing = ContainerSpacingSize;

/**
 *  Container used with main content areas
 * 
 * @param children nested content
 * @param className additional classes to apply
 * @param spacing container vertical padding
 */
export const SectionContainer = ({
  children,
  className = '',
  spacing = 'md',
  hero = false,
}: {
  children: ReactNode;
  className?: string;
  spacing?: ContainerSpacing
  hero?: boolean;
}) => {
  const spacingClass = getContainerSpacing(spacing);

  return (
    <ContentContainer className={`${spacingClass} ${className}`} maxWidth={hero ? 'none' : '7xl'}>
      {children}
    </ContentContainer>
  );
};
