import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { type HoverEffect, getHoverEffectClass } from '../../lib/design-system/hover-effects';
import { type StandardSize, getSizeToken } from '../../lib/design-system/sizes';

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
 *   size="sm"
 * />
 * ```
 */
export interface BackButtonProps {
  label?: string;
  historyOverride?: string;
  size?: StandardSize;
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

// Size variations using standardized tokens
const getSizeStyles = (size: StandardSize): string[] => [
  getSizeToken(size, 'paddingX'),
  getSizeToken(size, 'paddingY'),
  getSizeToken(size, 'text')
];

const variantStyles = {
  outline: [
    'bg-transparent',
    'border-brutal-md',
    'border-text-primary',
    'text-text-primary',
    'hover:bg-text-primary',
    'hover:text-white'
  ],
  text: [
    'bg-transparent',
    'border-none',
    'text-secondary',
    'hover:text-text-primary',
    'hover:underline'
  ]
};

// Get hover effect based on variant
const getBackButtonHoverEffect = (variant: 'outline' | 'text'): HoverEffect => {
  return variant === 'outline' ? 'press' : 'none';
};

export const BackButton = ({
  label = 'Back', 
  historyOverride,
  size = 'md',
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

  const hoverEffect = getBackButtonHoverEffect(variant);
  const hoverClass = getHoverEffectClass(hoverEffect);
  
  const buttonStyles = [
    ...baseStyles,
    ...getSizeStyles(size),
    ...variantStyles[variant],
    hoverClass,
    className
  ].filter(Boolean).join(' ');

  const iconSize = getSizeToken(size, 'icon');

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