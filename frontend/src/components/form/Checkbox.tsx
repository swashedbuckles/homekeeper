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
  // Use the same height as TextInput by using paddingY tokens
  // and calculate width to match for a square appearance
  switch (size) {
    case 'xs': return 'w-6 h-6';   // py-1 = 0.25rem top/bottom + text height ≈ 24px
    case 'sm': return 'w-8 h-8';   // py-2 = 0.5rem top/bottom + text height ≈ 32px  
    case 'md': return 'w-10 h-10'; // py-3 = 0.75rem top/bottom + text height ≈ 40px
    case 'lg': return 'w-12 h-12'; // py-4 = 1rem top/bottom + text height ≈ 48px
    case 'xl': return 'w-12 h-12'; // py-4 = 1rem top/bottom + text height ≈ 48px (same as lg)
    default:   return 'w-10 h-10';
  }
};

const getCheckIconSize = (size: StandardSize): number => {
  // Scale checkmark to be ~60% of checkbox size for good proportion
  switch (size) {
    case 'xs': return 14;  // ~60% of 24px
    case 'sm': return 18;  // ~60% of 32px
    case 'md': return 24;  // ~60% of 40px
    case 'lg': return 28;  // ~60% of 48px
    case 'xl': return 28;  // ~60% of 48px
    default:   return 24;
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
