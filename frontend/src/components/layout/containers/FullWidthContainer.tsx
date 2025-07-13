import { WideContainer } from './WideContainer';
import type { ReactNode } from 'react';

/**
 * Full-width container for hero sections, headers, and edge-to-edge content
 * 
 * Can be used in two modes:
 * 1. Basic full-width wrapper (hero=false)
 * 2. Hero section with centered content (hero=true)
 * 
 * @param children nested content
 * @param className additional classes to apply
 * @param hero if true, creates a hero section with min-height, centering, and padding
 */
export const FullWidthContainer = ({ 
  children, 
  className = '',
  hero = false
}: { 
  children: ReactNode;
  className?: string;
  hero?: boolean;
}) => {
  if (hero) {
    // Hero mode: full-width with centered content
    return (
      <div className={`w-full min-h-screen flex items-center ${className}`}>
        <WideContainer className="py-20">
          {children}
        </WideContainer>
      </div>
    );
  }

  // Basic mode: simple full-width wrapper
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
};