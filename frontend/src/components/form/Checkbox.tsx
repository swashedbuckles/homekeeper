import { Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { type StandardColor } from '../../lib/design-system/colors';
import { getSizeToken, type StandardSize } from '../../lib/design-system/sizes';
import { Text } from '../common/Text';
import type { InputHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className' | 'size'> {
  label: string;
  className?: string;
  register?: UseFormRegisterReturn;
  testId?: string;
  size?: StandardSize;
  color?: StandardColor;
}

const getCheckedBgColor = (color: StandardColor): string => {
  switch(color) {
    case 'accent':    return 'checked:bg-accent';
    case 'dark':      return 'checked:bg-text-primary';
    case 'error':     return 'checked:bg-error';
    case 'primary':   return 'checked:bg-primary';
    case 'secondary': return 'checked:bg-secondary';
    case 'success':   return 'checked:bg-success';
    case 'warning':   return 'checked:bg-warning';
    case 'white':     return 'checked:bg-white';
    default: return 'checked:bg-accent';
  }
};

const getCheckboxDimensions = (size: StandardSize): string => {
  // Perfect squares that account for border thickness and maintain visual balance
  switch (size) {
    case 'xs': return 'w-5 h-5 min-w-5';   // Small and clean with 2px border
    case 'sm': return 'w-6 h-6 min-w-6';   // Compact with 3px border
    case 'md': return 'w-8 h-8 min-w-8';   // Default size with 4px border
    case 'lg': return 'w-10 h-10 min-w-10'; // Large with 6px border
    case 'xl': return 'w-12 h-12 min-w-12'; // Extra large with 6px border
    default:   return 'w-8 h-8';
  }
};

const getCheckIconSize = (size: StandardSize): number => {
  // Scale checkmark to be ~60% of checkbox size for good proportion
  switch (size) {
    case 'xs': return 10;  // ~60% of 20px (w-5)
    case 'sm': return 12;  // ~60% of 24px (w-6)
    case 'md': return 16;  // ~60% of 32px (w-8)
    case 'lg': return 20;  // ~60% of 40px (w-10)
    case 'xl': return 24;  // ~60% of 48px (w-12)
    default:   return 16;
  }
};

export const CheckBox = (props: CheckboxProps) => {
  const {
    label, 
    size = 'md', 
    color = 'accent', // Default to green (accent)
    className, 
    testId, 
    register, 
    checked: controlledChecked,
    defaultChecked,
    onChange,
    disabled,
    ...nativeProps
  } = props;

  // Internal state to track checked status
  const [isChecked, setIsChecked] = useState(controlledChecked ?? defaultChecked ?? false);

  // Sync with controlled checked prop
  useEffect(() => {
    if (controlledChecked !== undefined) {
      setIsChecked(controlledChecked);
    }
  }, [controlledChecked]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Don't handle change if disabled
    if (disabled) {
      return;
    }
    
    const newChecked = event.target.checked;
    
    // If not controlled, update internal state
    if (controlledChecked === undefined) {
      setIsChecked(newChecked);
    }
    
    // Call provided onChange handler
    onChange?.(event);
  };

  // Determine actual checked state for input
  const inputChecked = controlledChecked !== undefined ? controlledChecked : isChecked;

  const checkboxStyles = [
    // Base styles for checkbox appearance
    'appearance-none',
    'bg-background',
    'border-text-primary', // Keep dark border
    'box-border', // Ensure borders are included in width/height
    getSizeToken(size, 'border'),
    getCheckboxDimensions(size),
    
    // Checked state styles - use selected color
    'checked:border-text-primary', // Keep dark border even when checked
    getCheckedBgColor(color),
    
    // Focus styles (only if not disabled)
    !disabled && 'focus:outline-none',
    !disabled && 'focus:ring-2',
    !disabled && 'focus:ring-primary',
    !disabled && 'focus:ring-offset-2',
    
    // Cursor and disabled states
    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
    
    // Custom class
    className,
  ].filter(Boolean).join(' ');

  const labelStyles = disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer';

  return (
    <label className={`relative flex items-start gap-3 ${labelStyles}`}>
      <input
        data-testid={testId ?? 'checkbox'} 
        className={checkboxStyles} 
        type="checkbox" 
        checked={inputChecked}
        disabled={disabled}
        onChange={handleChange}
        {...register}
        {...nativeProps} 
      />
      {/* Checkmark icon overlay */}
      <div className={`absolute top-0 left-0 ${getCheckboxDimensions(size)} pointer-events-none flex items-center justify-center transition-opacity duration-200 ${
        inputChecked ? 'opacity-100' : 'opacity-0'
      }`}>
        <Check 
          size={getCheckIconSize(size)}
          className="text-white"
        />
      </div>
      <Text variant="label" size={size} className={disabled ? 'opacity-50' : ''}>{label}</Text>
    </label>
  );
};
