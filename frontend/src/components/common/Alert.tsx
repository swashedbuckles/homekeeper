import { Info, CircleX, TriangleAlert, Check, Megaphone } from 'lucide-react';
import { type StandardSize, getSizeToken, getResponsiveTextToken } from '../../lib/design-system/sizes';
import type { ReactNode } from 'react';

export interface AlertProps {
  children :  ReactNode;
  className?: string;
  hideIcon?:  boolean;
  icon?:      ReactNode;
  variant?:   'info' | 'warning' | 'error' | 'success' | 'basic';
  size?:      StandardSize;
}

const variantStyles = {
  info: {
    container: 'bg-info text-white border-text-primary',
    iconBg:    'bg-white',
    iconColor: 'text-info'
  },
  warning: {
    container: 'bg-warning text-white border-text-primary',
    iconBg:    'bg-white',
    iconColor: 'text-warning'
  },
  error: {
    container: 'bg-error text-white border-text-primary',
    iconBg:    'bg-white',
    iconColor: 'text-error'
  },
  success: {
    container: 'bg-success text-white border-text-primary',
    iconBg:    'bg-white',
    iconColor: 'text-success'
  },
  basic: {
    container: 'bg-background text-text-primary border-text-primary',
    iconBg:    'bg-text-primary',
    iconColor: 'text-white'
  },
};

const variantIcons = {
  info:    Info,
  warning: TriangleAlert,
  error:   CircleX,
  success: Check,
  basic:   Megaphone,
};


/**
 * Alert component for displaying important messages with bold styling.
 * 
 * Provides prominent user feedback with colored backgrounds, bold typography, and
 * rotated icon containers. Supports different variants for various message types
 * and sizes for different contexts.
 * 
 * @example
 * ```tsx
 * // Error alert for form validation
 * <Alert variant="error" size="md">
 *   Failed to save household settings. Please check your input and try again.
 * </Alert>
 * 
 * // Success notification with custom icon
 * <Alert variant="success" size="lg" icon={<Home />}>
 *   Household created successfully! Welcome to HomeKeeper.
 * </Alert>
 * 
 * // Warning alert without icon
 * <Alert variant="warning" size="sm" hideIcon>
 *   Password must be at least 8 characters long.
 * </Alert>
 * ```
 */
export const Alert = ({
  variant = 'info',
  size = 'md',
  children,
  className = '',
  icon: customIcon,
  hideIcon = false
}: AlertProps) => {
  const IconComponent = variantIcons[variant];
  const variantConfig = variantStyles[variant];

  // Size variations using responsive tokens
  const getSizeConfig = (size: StandardSize) => {
    // Responsive icon container sizes with mobile-first approach
    const iconSizeMap = {
      xs: { container: 'w-6 h-6 md:w-8 md:h-8', icon: 'w-3 h-3' },
      sm: { container: 'w-8 h-8 md:w-12 md:h-12', icon: 'w-3 h-3 md:w-4 md:h-4' },
      md: { container: 'w-12 h-12 md:w-16 md:h-16', icon: 'w-4 h-4 md:w-5 md:h-5' },
      lg: { container: 'w-16 h-16 md:w-20 md:h-20', icon: 'w-5 h-5 md:w-6 md:h-6' },
      xl: { container: 'w-20 h-20 md:w-24 md:h-24', icon: 'w-6 h-6 md:w-8 md:h-8' }
    };
    
    const shadowMap = {
      xs: 'brutal-shadow-primary-sm',
      sm: 'brutal-shadow-primary',
      md: 'brutal-shadow-dark',
      lg: 'brutal-shadow-double',
      xl: 'brutal-shadow-double'
    };
    
    return {
      container: getSizeToken(size, 'padding'),
      text: getResponsiveTextToken(size), // Use responsive text scaling
      icon: iconSizeMap[size].container,
      iconSize: iconSizeMap[size].icon,
      border: getSizeToken(size, 'border'),
      shadow: shadowMap[size]
    };
  };

  const config = getSizeConfig(size);

  const containerStyles = [
    'font-mono',
    'font-bold',
    'uppercase',
    config.container,
    config.border,
    config.shadow,
    
    variantConfig.container,
    
    className
  ].filter(Boolean).join(' ');

  const textStyles = [
    config.text,
    'leading-relaxed'
  ].join(' ');

  const iconContainerStyles = [
    config.icon,
    variantConfig.iconBg,
    config.border,
    'border-text-primary',
    'flex',
    'items-center',
    'justify-center',
    'flex-shrink-0',
    'brutal-rotate-slight-left'
  ].join(' ');

  return (
    <div className={containerStyles}>
      <div className="flex items-start gap-6">
        {!hideIcon && (customIcon || IconComponent) && (
          <div className={iconContainerStyles}>
            {customIcon || (
              <IconComponent 
                className={`${config.iconSize} ${variantConfig.iconColor} font-black`} 
              />
            )}
          </div>
        )}
        
        <div className="flex-1">
          <div className={textStyles}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};