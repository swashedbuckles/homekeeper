import { Button } from '../common/Button';
import { Card } from '../common/Card';
import type { ReactNode } from 'react';

/**
 * OptionCard component for presenting user choices with optional action buttons.
 * 
 * Built on top of the base Card component. Perfect for onboarding flows, settings selections,
 * or any scenario where users need to choose between options. Supports both click-to-select
 * and button-action patterns.
 * 
 * @example
 * ```tsx
 * // Click-to-select pattern
 * <OptionCard
 *   title="Create New Household"
 *   description="Start fresh and invite family members"
 *   icon="+"
 *   selected={choice === 'create'}
 *   onClick={() => setChoice('create')}
 * />
 * 
 * // Button-action pattern for onboarding
 * <OptionCard
 *   title="Join Existing Household" 
 *   description="Use an invitation code to join"
 *   icon="🔑"
 *   buttonText="Join with Code"
 *   onButtonClick={() => navigate('/join')}
 * />
 * ```
 */
export interface OptionCardProps {
  title :         string;
  description :   string;
  icon?:          ReactNode | string;
  selected?:      boolean;
  disabled?:      boolean;
  onClick?:       () => void;
  variant?:       'primary' | 'secondary' | 'accent';
  buttonText?:    string;
  onButtonClick?: () => void;
  className?:     string;
  testId?:        string;
}

export const OptionCard = ({
  title,
  description,
  icon,
  selected = false,
  disabled = false,
  onClick,
  variant = 'primary',
  buttonText,
  onButtonClick,
  className = '',
  testId = 'option-card'
}: OptionCardProps) => {
  const iconVariants = {
    primary:   'bg-primary',
    secondary: 'bg-secondary',
    accent:    'bg-accent'
  };

  const handleCardClick = () => {
    if (!disabled && onClick && !onButtonClick) {
      onClick();
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onButtonClick) {
      onButtonClick();
    }
  };

  const cardVariant = selected ? 'primary' : 'default';
  const cardHover   = !disabled && !!(onClick || onButtonClick);
  const cardClick   = onClick && !onButtonClick ? handleCardClick : undefined;

  return (
    <Card
      variant={cardVariant}
      shadow="primary"
      hover={cardHover}
      onClick={cardClick}
      className={className}
      testId={testId}
    >
      <div className="flex items-start space-x-6">
        {/* Icon */}
        {icon && (
          <div className={`
            w-16 h-16 
            ${iconVariants[variant]}
            border-brutal-md border-text-primary 
            flex items-center justify-center 
            text-2xl font-black text-white 
            brutal-rotate-slight-left
            flex-shrink-0
          `}>
            {typeof icon === 'string' ? icon : icon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-2xl font-black uppercase mb-4 text-text-primary leading-tight">
            {title}
          </h3>
          <p className="text-text-secondary font-bold uppercase text-sm leading-relaxed mb-6">
            {description}
          </p>

          {/* Action Button */}
          {buttonText && onButtonClick && (
            <Button
              variant={selected ? 'primary' : 'outline'}
              size="default"
              onClick={handleButtonClick}
              disabled={disabled}
            >
              {buttonText}
            </Button>
          )}

          {/* Selected indicator - only show if no button */}
          {selected && !buttonText && (
            <div className="mt-4 inline-flex items-center gap-2">
              <div className="w-4 h-4 bg-primary border-2 border-text-primary flex items-center justify-center">
                <span className="text-white text-xs font-black">✓</span>
              </div>
              <span className="text-primary font-black uppercase text-sm tracking-wide">
                Selected
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};