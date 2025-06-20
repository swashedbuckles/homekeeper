import { Card } from '../common/Card';
import type { ReactNode } from 'react';

export interface OptionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  buttonText: string;
  onClick: () => void;
  buttonVariant?: 'primary' | 'secondary';
}

export const OptionCard = ({
  title,
  description,
  icon,
  buttonText,
  onClick,
  buttonVariant = 'primary'
}: OptionCardProps) => {
  const buttonStyles = buttonVariant === 'primary'
    ? 'bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors'
    : 'bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors';
    
  return (
    <Card clickable onClick={onClick}>
      <div className="flex items-start space-x-4">
        <div className={'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0'}>
          {icon}
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {title}
          </h3>
          <p className="text-text-secondary text-sm mb-4">
            {description}
          </p>
          <button 
            className={buttonStyles}
            onClick={(e) => {
              e.stopPropagation(); // Prevent double-click from card
              onClick();
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Card>
  );
};