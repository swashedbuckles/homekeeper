import type { HTMLInputTypeAttribute, ReactNode } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

export interface TextInputProps {
  label: string;
  type: HTMLInputTypeAttribute,
  placeholder?: string;
  error?: string;
  validationFeedback?: ReactNode; // Custom component (password strength)
  register?: UseFormRegisterReturn;
  testId?: string;
  className?: string;
  grouped?: boolean;
};

export const TextInput = (props: TextInputProps) => {
  console.log('text props', props);
  const inputId = `input-${props.label.replace(/\s+/g, '-').toLowerCase()}`;
  const hasFeedback = props.validationFeedback != null;
  const hasError = props.error != null;

  const inputStyles = [
    props.grouped ? '' : 'w-full',
    'px-4',
    'py-3',
    'bg-white',
    'border',
    'rounded-lg',
    'text-text-primary',
    'placeholder-text-secondary',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-primary',
    'focus:border-transparent',
    hasError ? 'border-ui-error' : 'border-ui-border'
  ].filter(Boolean).join(' ') + ` ${props.className}`;
  console.log('inputStyles', inputStyles, props.grouped ? true : false);
  return (
    <div className={props.grouped ? '' : 'mb-4'}> 
      <label htmlFor={inputId} className="block text-sm font-semibold text-text-primary mb-2">
        {props.label}
      </label>

      <div>
        <input 
          id={inputId}
          {...props.register}
          placeholder={props.placeholder}
          type={props.type}
          className={inputStyles}
          role="textbox"
          data-testid={props.testId}
        />
        {hasFeedback ? props.validationFeedback : null}
      </div>

      {hasError && (
        <span className="text-sm text-ui-error mt-1 block">{props.error}</span>
      )}
    </div>
  );
};