import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Z_INDEX_CLASSES } from '../../lib/constants/zIndex';
import { Button } from '../common/Button';
import { LightBgHeader } from '../common/Logo';
import { MobileMenu } from '../containers/MobileMenu';
import { MobileMenuToggle } from './MobileMenuToggle';
/**
 * AuthButtons component that renders authentication buttons for unauthenticated users
 * @param isMobile - Whether the buttons are displayed in mobile view
 * @param onClose - Function to close mobile menu when action is taken
 * @returns JSX element containing authentication buttons
 */
function AuthButtons({ isMobile, onClose }: { isMobile?: boolean; onClose?: () => void }) {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
    if (onClose) onClose();
  };

  const handleSignIn = () => {
    navigate('/login');
    if (onClose) onClose();
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        <Button 
          variant="primary" 
          size="large"
          full
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
        <Button 
          variant="tertiary"
          size="large" 
          full
          onClick={handleSignIn}
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden md:flex gap-4">
      <Button variant="primary" size="large" onClick={handleGetStarted}>
        Get Started
      </Button>
      <Button variant="tertiary" size="large" onClick={handleSignIn}>
        Sign In
      </Button>
    </div>
  );
}

/**
 * UnauthenticatedHeader component for landing, login, and register pages
 * Features light theme with primary colors on light background
 * @returns JSX element containing the unauthenticated header
 */
export function UnauthenticatedHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={`relative ${Z_INDEX_CLASSES.HEADER}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-5 py-4 md:py-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <LightBgHeader />
          
          {/* Desktop Auth Buttons */}
          <AuthButtons />
          
          {/* Mobile Menu Toggle */}
          <MobileMenuToggle isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu}>
        <AuthButtons isMobile onClose={closeMobileMenu} />
      </MobileMenu>
    </header>
  );
}