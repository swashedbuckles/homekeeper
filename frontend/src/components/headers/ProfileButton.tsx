import { User } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { type StandardSize, getSizeToken } from '../../lib/design-system/sizes';

export interface ToggleableMenuProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  size?: StandardSize;
}

export function ProfileButton({ isOpen, setIsOpen, size = 'md' }: ToggleableMenuProps) {
  const { user } = useAuth();
  const initial = user?.name.charAt(0).toUpperCase();

  const classes = [
    'w-10 h-10 md:w-12 md:h-12 brutal-rotate-right',
    'brutal-transition brutal-hover-press-small brutal-shadow-accent-sm',
    'bg-primary',
    getSizeToken(size, 'border'),
    'border-white',
    'flex items-center justify-center',
    getSizeToken(size, 'text'),
    'font-black text-white'
  ].join(' ');

  return (
    <div className={classes} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
      {initial ? initial : <User />}
    </div>
  );
}