import { useCallback, useState, cloneElement, type JSX } from 'react';

import { validateOptionChildren, type ValidatedOption, type AllowedOptionChildren } from '../../lib/validation/children';
import { Text } from './Text';

import type { StandardSize } from '../../lib/design-system/sizes';
import type { UseFormRegisterReturn } from 'react-hook-form';

export interface OptionRenderProps {
  option: ValidatedOption;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export interface ChoiceCoreProps {
  name: string;
  multiple?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  children: AllowedOptionChildren;
  renderOption: (props: OptionRenderProps) => JSX.Element;
  label?: string;
  error?: string;
  size?: StandardSize;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  className?: string;
  testId?: string;
  register?: UseFormRegisterReturn;
}

function arrayify<T>(value: T | T[]) {
  return Array.isArray(value) ? value : [value];
}

export const ChoiceCore = ({
  name, 
  multiple, 
  defaultValue, 
  onChange, 
  children,
  value: controlledValue,
  renderOption,
  label,
  error,
  orientation = 'horizontal',
  className,
}: ChoiceCoreProps) => {
  // Handle internal value as array, no matter what, to simplify logic. 
  // for non-multiple, we just return the array head.
  const [internalValue, setInternalValue] = useState(defaultValue ? arrayify(defaultValue) : []);
  
  // Use controlled value if provided, otherwise use internal state
  const currentValue = controlledValue !== undefined ? arrayify(controlledValue) : internalValue;

  const options = validateOptionChildren(children, 'ChoiceCore');
  
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

  const renderOptions = () => {
    return options.map(option => {
      const isSelected = currentValue.indexOf(option.value) > -1;
      const isDisabled = option.disabled;
      const onClick = () => handleClick(option.value);

      const element = renderOption({
        option,
        isSelected,
        isDisabled,
        onClick
      });

      // Clone element to add key prop
      return cloneElement(element, { key: option.value });
    });
  };

  const containerClassName = [
    'w-full',
    className
  ].filter(Boolean).join(' ');

  const optionsClassName = orientation === 'vertical' 
    ? 'flex flex-col gap-2'
    : 'flex flex-wrap gap-2';

  return (
    <div className={containerClassName}>
      {(label || name) && (
        <Text variant="label" size="lg" className="block mb-2">
          {label || name}
        </Text>
      )}
      <div className={optionsClassName}>
        {renderOptions()}
      </div>
      {error && (
        <div className="mt-1 mb-2 p-3 bg-error border-brutal-sm border-text-primary text-white">
          <div className="font-mono font-bold uppercase text-sm">
            ⚠ {error}
          </div>
        </div>
      )}
    </div>
  );
};