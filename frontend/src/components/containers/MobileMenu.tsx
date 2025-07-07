import { Z_INDEX_CLASSES } from '../../lib/constants/zIndex';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  noPadding?: boolean;
  children: React.ReactNode;
}

export function MobileMenu({
  isOpen, 
  onClose,
  children,
  noPadding
}: MobileMenuProps) {
  const positioning = 'flex items-start justify-center p-20';
  const container   = `bg-background border-4 border-white brutal-shadow-primary w-11/12 max-w-md brutal-rotate-slight-left ${noPadding ? '' : 'p-6'}`;
  const menuClass   = `md:hidden fixed inset-0 bg-text-primary/95 backdrop-blur-sm ${Z_INDEX_CLASSES.MOBILE_MENU} ${isOpen ? '' : 'hidden'}`;

  return (
    <div className={menuClass} onClick={onClose}>
      <div className={positioning}>
        <div className={container} onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </div>
  );
}
