import { ContentContainer } from './ContentContainer';
import type { ReactNode } from 'react';

export type ContainerSpacing = 'tight' | 'default' | 'loose';

const SPACING_CLASSES = {
  tight: 'py-8',
  default: 'py-10',
  loose: 'py-16'
};

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
  spacing = 'default'
}: {
  children: ReactNode;
  className?: string;
  spacing?: ContainerSpacing
}) => {


  return (
    <ContentContainer className={`${SPACING_CLASSES[spacing]} ${className}`}>
      {children}
    </ContentContainer>
  );
};
