import { Info, CircleX, TriangleAlert, Check, Megaphone } from 'lucide-react';
import type { ReactNode } from 'react';

export interface AlertProps {
  children: ReactNode,
  className?: string;
  hideIcon?: boolean
  icon?: ReactNode;
  variant?: 'info' | 'warning' | 'error' | 'success' | 'basic';
}

const variantStyles = {
  info: {
    container: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
  },
  warning: {
    container: 'bg-orange-50 border-orange-200',
    text: 'text-orange-800',
  },
  error: {
    container: 'bg-red-50 border-red-200',
    text: 'text-red-800',
  },
  success: {
    container: 'bg-green-50 border-green-200',  // matches your accent color
    text: 'text-green-800'
  },
  basic: {
    container: 'bg-background border-ui-border',
    text: 'text-text-primary',
  },
};

const variantIcons = {
  info: Info,
  warning: TriangleAlert,
  error: CircleX,
  success: Check,
  basic: Megaphone,
};

export const Alert = ({
  variant = 'info',
  children,
  className,
  icon: customIcon,
  hideIcon
}: AlertProps) => {

  const IconComponent = variantIcons[variant];
  const containerStyles = [
    'mt-6 p-4 border rounded-lg',
    variantStyles[variant].container,
    className
  ].filter(Boolean).join(' ');

  const textStyles = [
    'text-sm',
    variantStyles[variant].text
  ].join(' ');

  return (
    <div className={containerStyles}>
      <div className="flex items-start space-x-2">
        {!hideIcon && (customIcon || IconComponent) && (
          <div className="w-4 h-4 mt-0.5 flex-shrink-0">
            {customIcon || <IconComponent className="w-4 h-4 text-current" />}
          </div>
        )}
        <p className={textStyles}>
          {children}
        </p>
      </div>
    </div>
  );
};
