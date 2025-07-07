import { useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';

import { MainHeader } from './headers/MainHeader';
import { UnauthenticatedHeader } from './headers/UnauthenticatedHeader';

/**
 * Header component that renders the main navigation header with logo and authentication buttons
 * Includes responsive mobile menu functionality
 * @returns JSX element containing the complete header navigation
 * @example
 * <Header />
 */
export function Header() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  console.log('location pathname', location.pathname);

  if(location.pathname.startsWith('/onboarding')) {
    return null;
  }

  if(location.pathname.startsWith('/settings')) {
    // return minimal header 
  }

  if(isAuthenticated || location.pathname.startsWith('/dashboard')) {
    return <MainHeader />;
  }

  return <UnauthenticatedHeader />;
}
