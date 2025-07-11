import { ContentContainer } from './ContentContainer';
import { FullWidthContainer } from './HeroContainer';

/**
 * Container used with landing pages (Hero elements)
 * 
 * @param children nested content
 * @param className additional classes to apply
 */
export const HeroContainer = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <FullWidthContainer className={`min-h-screen flex items-center ${className}`}>
      <ContentContainer className="py-20">
        {children}
      </ContentContainer>
    </FullWidthContainer>
  );
};