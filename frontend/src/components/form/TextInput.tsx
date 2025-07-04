import { forwardRef } from 'react';
import type { HTMLInputTypeAttribute, ReactNode } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

export interface TextInputProps {
  label: string;
  type: HTMLInputTypeAttribute;
  placeholder?: string;
  error?: string;
  validationFeedback?: ReactNode;
  register?: UseFormRegisterReturn;
  testId?: string;
  className?: string;
  grouped?: boolean;
  size?: 'small' | 'default' | 'large';
  variant?: 'default' | 'search';
};

const baseStyles = [
  'input-brutal',
  'w-full',
  'font-mono',
  'font-bold',
  'uppercase',
  'brutal-transition'
];

const sizeStyles = {
  small: [
    'px-3',
    'py-2',
    'text-sm',
    'border-brutal-sm'
  ],
  default: [
    'px-4',
    'py-3',
    'text-base',
    'border-brutal-md'
  ],
  large: [
    'px-6',
    'py-4',
    'text-lg',
    'border-brutal-lg'
  ]
};

const variantStyles = {
  default: [
    'bg-white',
    'border-text-primary',
    'text-text-primary'
  ],
  search: [
    'bg-text-primary',
    'border-white',
    'text-white',
    'placeholder-text-secondary',
    // Override default focus for search
    'focus:bg-background',
    'focus:text-text-primary',
    'focus:brutal-shadow-mega'
  ]
};

/**
 * Text Input with support for errors, feedback (e.g. password indicator), and more.
 * 
 * @example Basic input - gets bold styling automatically
 *  ```
 * <TextInput label="Email Address"type="email"placeholder="Enter your email"/>
 * ```
 * @example With error state
 * ```
 * <TextInput label="Password" type="password" error="Password must be at least 8 characters" />
 * ```
 * @example Large size for hero forms
 * ```
 * <TextInput label="Household Name"type="text"size="large"placeholder="The Smith Family Home"/>
 * ```
 * @example Search variant (dark theme)
 * ```
 * <TextInput label="Search Manuals"type="search"variant="search"placeholder="Search manuals..."/>
 * ```
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const inputId = `input-${props.label.replace(/\s+/g, '-').toLowerCase()}`;
  const hasFeedback = props.validationFeedback != null;
  const hasError = props.error != null;

  const errorStyles = hasError ? [
    'border-error',
    'focus:brutal-shadow-error'
  ] : [];

  const inputStyles = [
    ...(props.grouped ? [] : ['w-full']),
    ...baseStyles,
    ...sizeStyles[props.size || 'default'],
    ...variantStyles[props.variant || 'default'],
    ...errorStyles,
    props.className
  ].filter(Boolean).join(' ');

  return (
    <div className={props.grouped ? 'mb-4' : 'w-full mb-4'}>
      <label
        htmlFor={inputId}
        className="block font-mono font-black text-text-primary uppercase mb-2 text-lg tracking-wide"
      >
        {props.label}
        {props.register?.required && (
          <span className="text-error ml-1">*</span>
        )}
      </label>

      <input
        ref={ref}
        id={inputId}
        type={props.type}
        placeholder={props.placeholder}
        className={inputStyles}
        data-testid={props.testId}
        {...props.register}
      />

      {hasError && (
        <div className="mt-1 mb-2 p-3 bg-error border-brutal-sm border-text-primary text-white">
          <div className="font-mono font-bold uppercase text-sm">
            ⚠ {props.error}
          </div>
        </div>
      )}

      {hasFeedback && (
        <div className="mt-1 mb-2 p-3 bg-accent border-brutal-sm border-text-primary text-white">
          <div className="font-mono font-bold uppercase text-sm">
            {props.validationFeedback}
          </div>
        </div>
      )}
    </div>
  );
});