import type { ReactNode } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

const DEFAULT_ROWS = 3;

export interface TextAreaProps {
  label: string;
  placeholder?: string;
  error?: string;
  validationFeedback?: ReactNode; 
  register?: UseFormRegisterReturn;
  testId?: string;
  className?: string;
  rows?: number;
};

export const TextArea = (props: TextAreaProps) => {
  const inputId = `input-${props.label.replace(/\s+/g, '-').toLowerCase()}`;
  const hasFeedback = props.validationFeedback != null;
  const hasError = props.error != null;

  const inputStyles = [
    'w-full',
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
    'resize-y',
    hasError ? 'border-ui-error' : 'border-ui-border'
  ].join(' ') + ` ${props.className}`;
  
  return (
    <div className="mb-4"> 
      <label htmlFor={inputId} className="block text-sm font-semibold text-text-primary mb-2">
        {props.label}
      </label>

      <div>
        <textarea 
          id={inputId}
          {...props.register}
          placeholder={props.placeholder}
          className={inputStyles}
          rows={props.rows ?? DEFAULT_ROWS}
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