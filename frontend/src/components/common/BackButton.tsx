import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

/**
 * BackButton Component.
 * 
 * Navigation button for going back in browser history or to a specific route.
 * Features thick borders, bold typography, and consistent styling with other buttons.
 * 
 * @example
 * ```tsx
 * // Basic back button
 * <BackButton />
 * 
 * // Custom label
 * <BackButton label="Return to Dashboard" />
 * 
 * // Override navigation target
 * <BackButton 
 *   label="Back to Settings" 
 *   historyOverride="/settings"
 *   size="small"
 * />
 * ```
 */
export interface BackButtonProps {
  label?: string;
  historyOverride?: string;
  size?: 'small' | 'default';
  variant?: 'outline' | 'text';
  className?: string;
  testId?: string;
}

const baseStyles = [
  'inline-flex',
  'items-center',
  'gap-2',
  'font-mono',
  'font-bold',
  'uppercase',
  'tracking-wide',
  'brutal-transition',
  'focus:outline-none',
  'mb-4'
];

const sizeStyles = {
  small: [
    'px-3',
    'py-2',
    'text-sm'
  ],
  default: [
    'px-4',
    'py-3',
    'text-base'
  ]
};

const variantStyles = {
  outline: [
    'bg-transparent',
    'border-brutal-md',
    'border-text-primary',
    'text-text-primary',
    'hover:bg-text-primary',
    'hover:text-white',
    'brutal-hover-press'
  ],
  text: [
    'bg-transparent',
    'border-none',
    'text-secondary',
    'hover:text-text-primary',
    'hover:underline'
  ]
};

export const BackButton = ({
  label = 'Back', 
  historyOverride,
  size = 'default',
  variant = 'outline',
  className = '',
  testId = 'back-button'
}: BackButtonProps) => {
  const navigate = useNavigate();
  
  const onClick = () => {
    if(historyOverride) {
      navigate(historyOverride);
      return;
    }

    navigate(-1);
  };

  const buttonStyles = [
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
    className
  ].filter(Boolean).join(' ');

  const iconSize = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <button 
      className={buttonStyles} 
      onClick={onClick}
      data-testid={testId}
    >
      <ChevronLeft className={iconSize} />
      {label}
    </button>
  );
};