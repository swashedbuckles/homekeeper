import { getResponsivePattern } from '../../lib/design-system/sizes';

export interface MobileMenuToggleProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  colorVariant?: 'primary' | 'secondary' | 'accent' | 'white';
}

export function MobileMenuToggle({ isOpen, setIsOpen, colorVariant = 'primary' }: MobileMenuToggleProps) {
  const buttonClasses = [
    getResponsivePattern('mobileOnly'),  // md:hidden
    getResponsivePattern('touchTarget'), // min-h-[44px] 
    'w-10 h-10',
    `bg-${colorVariant}`,
    'border-0',
    'brutal-hover-press-small',
    'brutal-shadow-black-sm',
    'border-text-primary',
    'flex flex-col items-center justify-center',
    'gap-1 p-2',
    'transition-all duration-300'
  ].join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={() => setIsOpen(!isOpen)}
      aria-label="Toggle menu"
    >
      <div className="w-full h-0.5 bg-white transition-all duration-300"></div>
      <div className="w-full h-0.5 bg-white transition-all duration-300"></div>
      <div className="w-full h-0.5 bg-white transition-all duration-300"></div>
    </button>
  );
}