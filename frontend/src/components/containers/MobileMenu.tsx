import { Z_INDEX_CLASSES } from '../../lib/constants/zIndex';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileMenu({
  isOpen, 
  onClose,
  children
}: MobileMenuProps) {
  const positioning = 'flex items-start justify-center p-20';
  const container   = 'bg-background border-4 border-white brutal-shadow-primary w-11/12 max-w-md p-6 brutal-rotate-slight-left';
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
