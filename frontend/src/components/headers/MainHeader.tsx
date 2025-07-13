import { useEffect, useState } from 'react';

import { Z_INDEX_CLASSES } from '../../lib/constants/zIndex';
import { getResponsivePattern } from '../../lib/design-system/sizes';
import { DarkBgHeader } from '../common/Logo';
import { MobileMenu } from '../layout/containers/MobileMenu';
import { AppNavigation } from './AppNavigation';
import { HeaderGradient } from './HeaderGradient';
import { MobileMenuToggle } from './MobileMenuToggle';
import { ProfileButton } from './ProfileButton';
import { ProfileMenu } from './ProfileMenu';
import { SearchInput } from './SearchInput';

export interface MainHeaderProps {

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
      <div className={getResponsivePattern('tabletUp')}>
        <div className="max-w-full mx-auto px-3 py-5">
          <div className="flex justify-between items-center gap-12">
            <DarkBgHeader />
            <AppNavigation />

            <div className="flex items-center gap-4">
              <SearchInput />

              <div data-profile-menu>
                <ProfileButton isOpen={isDesktopProfileMenuOpen} setIsOpen={setIsDesktopProfileMenuOpen} />
              </div>
            </div>
          </div>
        </div>
      </div>

      { /* Mobile */}
      <div className={getResponsivePattern('mobileOnly')}>
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
        className={`absolute right-5 mt-2 top-full ${isDesktopProfileMenuOpen ? getResponsivePattern('tabletUp') : 'hidden'} ${Z_INDEX_CLASSES.MOBILE_MENU}`}
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