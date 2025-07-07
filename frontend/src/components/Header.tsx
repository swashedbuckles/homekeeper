import { useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';

import { UnauthenticatedHeader } from './UnauthenticatedHeader';


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

  if(location.pathname.startsWith('/onboarding')) {
    return null;
  }

  if(location.pathname.startsWith('/settings')) {
    // return minimal header 
  }

  if(isAuthenticated) {
    // return "main" header
  }

  return <UnauthenticatedHeader />;
}
