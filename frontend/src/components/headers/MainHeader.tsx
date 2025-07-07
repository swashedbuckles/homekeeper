import { User, Settings, House, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import { useAuth } from '../../hooks/useAuth';
import { useHousehold } from '../../hooks/useHousehold';
import { Z_INDEX_CLASSES } from '../../lib/constants/zIndex';
import { DarkBgHeader } from '../common/Logo';
import { MobileMenu } from '../containers/MobileMenu';
import { MobileMenuToggle } from './MobileMenuToggle';

export interface MainHeaderProps {

}

export interface ToggleableMenuProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export const HeaderGradient = () => (<div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary via-accent to-error" />);

export function AppNavigation() {
  const location = useLocation();

  const activeClasses = [
    'bg-transparent',
    'text-primary',
    'border-0',
    'border-b-4',
    'border-b-primary',
    'font-black',
    'uppercase',
    'tracking-wider',
    'px-6',
    'py-3',
    'brutal-transition',
  ].join(' ');

  const inactiveClasses = [
    'bg-transparent',
    'text-text-secondary',
    'border-0',
    'border-b-4',
    'border-b-transparent',
    'font-bold',
    'uppercase',
    'tracking-wider',
    'px-6',
    'py-3',
    'brutal-transition',
    'hover:text-primary',
    'hover:border-b-primary/30'
  ].join(' ');

  const locations = [
    {
      name: 'Dashboard',
      path: '/dashboard'
    },
    {
      name: 'Manuals',
      path: '/manuals'
    },
    {
      name: 'Maintenance',
      path: '/maintenance'
    },
    {
      name: 'Analytics',
      path: '/analytics',
    },
  ].map(path => {
    const classes = location.pathname.startsWith(path.path) ? activeClasses : inactiveClasses;
    return (
      <button className={classes} key={path.path}>{path.name}</button>
    );
  });
  return (
    <nav className="flex flex-col md:flex-row">
      {...locations}
    </nav>
  );
}

export function ProfileMenu() {
  const { user } = useAuth();
  const { activeHousehold } = useHousehold();
  const profileDropdownClasses = [
    'bg-white',
    'border-4 border-text-primary',
    'md:brutal-shadow-secondary',
    'md:brutal-rotate-tiny-right',
    'md:min-w-60'
  ].join(' ');

  const dropdownHeaderClasses = [
    'bg-primary text-white',
    'border-b-4 border-b-text-primary',
    'p-4',
    'font-black uppercase text-sm tracking-wider'
  ].join(' ');

  const dropdownItemClasses = [
    'px-4 py-3.5',
    'border-b-2 border-b-background',
    'font-bold uppercase text-sm tracking-wider',
    'text-text-primary',
    'cursor-pointer',
    'brutal-transition',
    'flex items-center gap-3',
    'hover:bg-background hover:text-primary',
    'last:border-b-0'
  ].join(' ');

  const logoutItemClasses = [
    'px-4 py-3.5',
    'font-bold uppercase text-sm tracking-wider',
    'cursor-pointer',
    'brutal-transition',
    'flex items-center gap-3',
    'bg-error text-white',
    'border-t-4 border-t-text-primary',
    'hover:bg-red-800 hover:text-white'
  ].join(' ');

  const dropdownDividerClasses = 'h-1 bg-text-primary m-0';

  return (
    <div className={`${Z_INDEX_CLASSES.MOBILE_MENU} ${profileDropdownClasses}`}>
      <div className={dropdownHeaderClasses}>
        {user?.name ?? 'NAME'} <br />
        <span className="text-xs opacity-80">{activeHousehold?.name ?? 'HOUSEHOLD'}</span>
      </div>

      <div className={dropdownItemClasses}>
        <span className="text-lg"><House /></span>
        Switch Household
      </div>

      <div className={dropdownDividerClasses}></div>

      <div className={dropdownItemClasses}>
        <span className="text-lg"><Settings /></span>
        Settings
      </div>

      <div className={logoutItemClasses}>
        <span className="text-lg"><LogOut /></span>
        Logout
      </div>
    </div>
  );
}


export function ProfileButton({ isOpen, setIsOpen }: ToggleableMenuProps) {
  const { user } = useAuth();
  const initial = user?.name.charAt(0).toUpperCase();

  const classes = [
    'w-10 h-10 md:w-12 md:h-12 brutal-rotate-right',
    'brutal-transition brutal-hover-press-small brutal-shadow-accent-sm',
    'bg-primary',
    'border-3 md:border-4 border-white',
    'flex items-center justify-center',
    'text-sm md:text-lg font-black text-white'
  ].join(' ');

  return (
    <div className={classes} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
      {initial ? initial : <User />}
    </div>);
}

export function MainHeader(_props: MainHeaderProps) {
  const [isMobileNavMenuOpen, setIsMobileNavMenuOpen] = useState(false);
  const [isMobileProfileMenuOpen, setIsMobileProfileMenuOpen] = useState(false);
  const [isDesktopProfileMenuOpen, setIsDesktopProfileMenuOpen] = useState(false);

  const closeMobileNavMenu = () => setIsMobileNavMenuOpen(false);
  const closeMobileProfileMenu = () => setIsMobileProfileMenuOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (isDesktopProfileMenuOpen && !target.closest('[data-profile-menu]')) {
        setIsDesktopProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDesktopProfileMenuOpen]);

  return (
    <header className={`relative ${Z_INDEX_CLASSES.HEADER} bg-text-primary`}>
      <HeaderGradient />

      { /* Desktop */}
      <div className="hidden md:block">
        <div className="max-w-full mx-auto px-3 py-5">
          <div className="flex justify-between items-center gap-12">
            <DarkBgHeader />
            <AppNavigation />

            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="SEARCH MANUALS..."
                className="w-48 px-4 py-3 bg-text-primary text-white border-4 border-white font-bold placeholder-text-secondary focus:outline-none focus:bg-background focus:text-text-primary"
              />

              <div data-profile-menu>
                <ProfileButton isOpen={isDesktopProfileMenuOpen} setIsOpen={setIsDesktopProfileMenuOpen} />
              </div>
            </div>
          </div>
        </div>
      </div>

      { /* Mobile */}
      <div className="md:hidden">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <DarkBgHeader />

            <div className="flex items-center gap-3">
              <ProfileButton isOpen={isMobileProfileMenuOpen} setIsOpen={setIsMobileProfileMenuOpen} />
              <MobileMenuToggle isOpen={isMobileNavMenuOpen} setIsOpen={setIsMobileNavMenuOpen} colorVariant="secondary" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Profile Dropdown  */}
      <div
        data-profile-menu
        className={`absolute right-5 mt-2 top-full hidden ${isDesktopProfileMenuOpen ? 'md:block' : ''} ${Z_INDEX_CLASSES.MOBILE_MENU}`}
      >
        <ProfileMenu />
      </div>

      { /* Overlay for Nav */}
      <MobileMenu isOpen={isMobileNavMenuOpen} onClose={closeMobileNavMenu}>
        <AppNavigation />
      </MobileMenu>

      { /* Overlay for Profile Menu */}
      <MobileMenu isOpen={isMobileProfileMenuOpen} onClose={closeMobileProfileMenu} noPadding>
        <ProfileMenu />
      </MobileMenu>
    </header>
  );
}