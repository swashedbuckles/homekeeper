import { Info, CircleX, TriangleAlert, Check, Megaphone } from 'lucide-react';
import type { ReactNode } from 'react';

export interface AlertProps {
  children :  ReactNode;
  className?: string;
  hideIcon?:  boolean;
  icon?:      ReactNode;
  variant?:   'info' | 'warning' | 'error' | 'success' | 'basic';
  size?:      'small' | 'default' | 'large';
}

const variantStyles = {
  info: {
    container: 'bg-info text-white border-white',
    iconBg:    'bg-white',
    iconColor: 'text-info'
  },
  warning: {
    container: 'bg-warning text-white border-white',
    iconBg:    'bg-white',
    iconColor: 'text-warning'
  },
  error: {
    container: 'bg-error text-white border-white',
    iconBg:    'bg-white',
    iconColor: 'text-error'
  },
  success: {
    container: 'bg-success text-white border-white',
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
 * Alert component for displaying important messages with brutal neo-brutalist styling.
 * 
 * Provides prominent user feedback with colored backgrounds, bold typography, and
 * rotated icon containers. Supports different variants for various message types
 * and sizes for different contexts.
 * 
 * @example
 * ```tsx
 * // Error alert for form validation
 * <Alert variant="error" size="default">
 *   Failed to save household settings. Please check your input and try again.
 * </Alert>
 * 
 * // Success notification with custom icon
 * <Alert variant="success" size="large" icon={<Home />}>
 *   Household created successfully! Welcome to HomeKeeper.
 * </Alert>
 * 
 * // Warning alert without icon
 * <Alert variant="warning" size="small" hideIcon>
 *   Password must be at least 8 characters long.
 * </Alert>
 * ```
 */
export const Alert = ({
  variant = 'info',
  size = 'default',
  children,
  className = '',
  icon: customIcon,
  hideIcon = false
}: AlertProps) => {
  const IconComponent = variantIcons[variant];
  const variantConfig = variantStyles[variant];

  const sizeConfig = {
    small: {
      container: 'p-4',
      text:      'text-sm',
      icon:      'w-12 h-12',
      iconSize:  'w-5 h-5',
      border:    'border-brutal-sm',
      shadow:    'brutal-shadow-primary'
    },
    default: {
      container: 'p-6',
      text:      'text-base',
      icon:      'w-16 h-16',
      iconSize:  'w-6 h-6',
      border:    'border-brutal-md',
      shadow:    'brutal-shadow-dark'
    },
    large: {
      container: 'p-8',
      text:      'text-lg',
      icon:      'w-20 h-20',
      iconSize:  'w-8 h-8',
      border:    'border-brutal-lg',
      shadow:    'brutal-shadow-double'
    }
  };

  const config = sizeConfig[size];

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