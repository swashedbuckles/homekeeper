import { useCallback, useState } from 'react';

import { getHoverEffectClass } from '../../lib/design-system/hover-effects';
import { validateOptionChildren, type ValidatedOption, type AllowedOptionChildren } from '../../lib/validation/children';
import { Text } from './Text';

import type { StandardSize } from '../../lib/design-system/sizes';
import type { UseFormRegisterReturn } from 'react-hook-form';

export interface ChoiceProps {
  name: string;
  multiple?: boolean;
  value?: string | string[];
  defaultValue: string | string[];
  onChange?: (value: string | string[]) => void;
  children: AllowedOptionChildren;
  size?: StandardSize;
  disabled?: boolean;
  className?: string;
  testId?: string;

  register?: UseFormRegisterReturn;
}

function RenderOptions(options: ValidatedOption[], currentValue: string[], handleClick: (value: string) => void) {
  return options.map(option => {
    const isSelected = currentValue.indexOf(option.value) > -1;
    const isDisabled = option.disabled;

    const baseStyles = [
      'font-mono',
      'font-black',
      'uppercase',
      'px-4',
      'py-2',
      'border-4',
      'border-text-primary',
      'brutal-transition',
      'focus:outline-none'
    ];

    const stateStyles = isSelected 
      ? ['bg-accent', 'text-white', 'brutal-shadow-dark']
      : ['bg-white', 'text-text-primary', 'hover:bg-primary', 'hover:text-white'];

    const interactionStyles = isDisabled 
      ? ['opacity-50', 'cursor-not-allowed', '!hover:transform-none']
      : [getHoverEffectClass('press-small')];

    const optionStyles = [
      ...baseStyles,
      ...stateStyles,
      ...interactionStyles
    ].filter(Boolean).join(' ');

    return (
      <button 
        disabled={isDisabled} 
        onClick={() => handleClick(option.value)}
        key={option.value}
        className={optionStyles}
      >
        {option.label}
      </button>);
  });
}

function arrayify<T>(value: T | T[]) {
  return Array.isArray(value) ? value : [value];
}

export const Choice = ({
  name, 
  multiple, 
  defaultValue, 
  onChange, 
  children,
  value: controlledValue,
}: ChoiceProps) => {
  // Handle internal value as array, no matter what, to simplify logic. 
  // for non-multiple, we just return the array head.
  const [internalValue, setInternalValue] = useState(defaultValue ? arrayify(defaultValue) : []);
  
  // Use controlled value if provided, otherwise use internal state
  const currentValue = controlledValue !== undefined ? arrayify(controlledValue) : internalValue;

  const options = validateOptionChildren(children, 'Choice');
  const handleClick = useCallback((optionValue: string) => {
    let newValue: string[];
    
    if(currentValue.indexOf(optionValue) > -1) {
      // Remove the option if it's already selected
      newValue = currentValue.filter(x => x !== optionValue);
    } else if(!multiple) {
      // Single selection: replace with new value
      newValue = [optionValue];
    } else {
      // Multiple selection: add to existing values
      newValue = [...currentValue, optionValue];
    }

    // If not controlled, update internal state
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    
    // Always call onChange if provided
    if (onChange) {
      onChange(multiple ? newValue : newValue[0]);
    }
  }, [currentValue, multiple, controlledValue, onChange]);

  return (
    <div className="w-full">
      <Text variant="label" size="lg" className="block mb-2">{name}</Text>
      <div className="flex flex-wrap gap-2">
        {RenderOptions(options, currentValue, handleClick)}
      </div>
    </div>
  );
};