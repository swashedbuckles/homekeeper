import { User } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';

export interface ToggleableMenuProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
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
    </div>
  );
}