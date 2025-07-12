import { type StandardSize, getSizeToken } from '../../lib/design-system/sizes';

export interface SearchInputProps {
  size?: StandardSize;
  className?: string;
}

export function SearchInput({ 
  size = 'md',
  className = ''
}: SearchInputProps) {
  const searchStyles = [
    'w-48',
    getSizeToken(size, 'paddingX'),
    getSizeToken(size, 'paddingY'),
    'bg-text-primary',
    'text-white',
    getSizeToken(size, 'border'),
    'border-white',
    'font-bold',
    'placeholder-text-secondary',
    'focus:outline-none',
    'focus:bg-background',
    'focus:text-text-primary',
    className
  ].filter(Boolean).join(' ');

  return (
    <input
      type="text"
      placeholder="SEARCH MANUALS..."
      className={searchStyles}
    />
  );
}