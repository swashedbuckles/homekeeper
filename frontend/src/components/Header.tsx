import { useEffect, useState } from 'react';
import { Link } from 'react-router';
// import LogoSvg from '../assets/logo.svg';
import { useAuth } from '../hooks/useAuth';
import { HeaderLogo } from './common/Logo';

interface HeaderButtonsProps {
  isMobile?: boolean;
  setMenuState?: React.Dispatch<React.SetStateAction<boolean>>;
};

function HeaderButtons({ isMobile, setMenuState }: HeaderButtonsProps) {
  const {isAuthenticated, logout} = useAuth();

  const buttonBaseClasses = 'text-center font-mono font-bold uppercase tracking-wide border-brutal-md brutal-transition focus:outline-none';
  const buttonPrimary = 'border-primary text-primary hover:bg-primary hover:text-white brutal-hover-press';
  const buttonSecondary = 'border-secondary text-secondary hover:bg-secondary hover:text-white brutal-hover-press';

  const mobile = 'block px-4 py-3 w-full text-sm';
  const desktop = 'px-4 py-2 text-sm';

  const loginLogout = [buttonBaseClasses, buttonPrimary, isMobile ? mobile : desktop].join(' ');
  const register = [buttonBaseClasses, buttonSecondary, isMobile ? mobile : desktop].join(' ');

  const handleLogout = () => {
    logout();
    if (isMobile && setMenuState) {
      setMenuState(false); // Close mobile menu
    }
  };

  if (isAuthenticated) {
    return (
      <button className={loginLogout} onClick={handleLogout}>Logout</button>
    );
  }
  return (
    <>
      <Link className={loginLogout} to="/login">Login</Link>
      <Link className={register} to="/register">Register</Link>
    </>
  );
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (isMobileMenuOpen && !target.closest('header')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (<header className="relative">
    <nav className="flex items-center justify-between p-4 w">
      <HeaderLogo />

      {/* Desktop */}
      <div className="hidden md:flex gap-2">
        <HeaderButtons />
      </div>

      {/* Mobile */}
      <button
        className="md:hidden p-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <div className="w-6 h-6 flex flex-col justify-center gap-1">
          <span className="w-full h-0.5 bg-text-primary block" />
          <span className="w-full h-0.5 bg-text-primary block" />
          <span className="w-full h-0.5 bg-text-primary block" />
        </div>
      </button>
    </nav>

    {/* Mobile dropdown overlay */}
    {isMobileMenuOpen && (
      <div className="md:hidden absolute top-full left-0 right-0 bg-background border-x border-b border-ui-border shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1)] z-50">
        <div className="p-4 space-y-3">
          <HeaderButtons isMobile setMenuState={setIsMobileMenuOpen} />
        </div>
      </div>
    )}
  </header>);
}
