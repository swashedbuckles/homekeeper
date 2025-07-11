import { Button } from '../common/Button';
import { Card, type CardProps } from '../common/Card';
import { Text } from '../common/Text';
import type { ReactNode } from 'react';

/**
 * OptionCard component for presenting user choices with optional action buttons.
 * 
 * Built on top of the base Card component. Perfect for onboarding flows, settings selections,
 * or any scenario where users need to choose between options. Delegates all styling to Card
 * component and focuses on content structure and selection logic.
 * 
 * @example
 * ```tsx
 * // Click-to-select pattern with custom styling
 * <OptionCard
 *   title="Create New Household"
 *   description="Start fresh and invite family members"
 *   icon="+"
 *   selected={choice === 'create'}
 *   onClick={() => setChoice('create')}
 *   shadow="double"
 *   hover
 *   hoverEffect="lift"
 * />
 * ```
 */
export interface OptionCardProps extends Omit<CardProps, 'children' | 'variant'> {
  title :         string;
  description :   string;
  icon?:          ReactNode | string;
  selected?:      boolean;
  disabled?:      boolean;
  iconVariant?:   'primary' | 'secondary' | 'accent';
  buttonText?:    string;
  onButtonClick?: () => void;
}

export const OptionCard = ({
  title,
  description,
  icon,
  selected = false,
  disabled = false,
  onClick,
  iconVariant = 'primary',
  buttonText,
  onButtonClick,
  ...cardProps
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
      hover={cardHover}
      onClick={cardClick}
      {...cardProps}
    >
      <div className="flex items-start space-x-6">
        {/* Icon */}
        {icon && (
          <div className={`
            w-16 h-16 
            ${iconVariants[iconVariant]}
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
          <Text variant="body" size="large" weight="black" color="dark" uppercase className="block mb-4 leading-tight">
            {title}
          </Text>
          <Text variant="caption" size="small" weight="bold" color="secondary" uppercase className="block leading-relaxed mb-6">
            {description}
          </Text>

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
              <Text variant="caption" size="small" weight="black" color="primary" uppercase className="tracking-wide">
                Selected
              </Text>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};