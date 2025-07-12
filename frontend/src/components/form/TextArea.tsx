import { forwardRef } from 'react';
import { type StandardSize, getSizeToken } from '../../lib/design-system/sizes';
import type { ReactNode } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

const DEFAULT_ROWS = 4;

/**
 * TextArea Component.
 * 
 * Multi-line text input with thick borders, bold typography,
 * and consistent error/feedback states. Follows the same patterns as TextInput.
 * 
 * @example
 * ```tsx
 * // Basic textarea
 * <TextArea 
 *   label="Describe Your Issue"
 *   placeholder="Tell us what happened..."
 * />
 * 
 * // With error state
 * <TextArea 
 *   label="House Rules"
 *   error="Please provide at least 50 characters"
 *   rows={6}
 * />
 * 
 * // Large size for important forms
 * <TextArea 
 *   label="Family Mission Statement"
 *   size="lg"
 *   rows={8}
 *   placeholder="What values guide your household?"
 * />
 * ```
 */
export interface TextAreaProps {
  label: string;
  placeholder?: string;
  error?: string;
  validationFeedback?: ReactNode; 
  register?: UseFormRegisterReturn;
  testId?: string;
  className?: string;
  rows?: number;
  size?: StandardSize;
  grouped?: boolean;
}

const baseStyles = [
  'textarea-brutal',
  'w-full',
  'font-mono',
  'font-bold',
  'bg-white',
  'border-text-primary',
  'text-text-primary',
  'brutal-transition',
  'resize-y',
  'focus:outline-none',
  'focus:brutal-shadow-primary',
  'focus:translate-x-1',
  'focus:translate-y-1'
];

// Size variations using standardized tokens
const getSizeStyles = (size: StandardSize): string[] => [
  getSizeToken(size, 'paddingX'),
  getSizeToken(size, 'paddingY'),
  getSizeToken(size, 'text'),
  getSizeToken(size, 'border')
];

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  const inputId = `textarea-${props.label.replace(/\s+/g, '-').toLowerCase()}`;
  const hasFeedback = props.validationFeedback != null;
  const hasError = props.error != null;

  const errorStyles = hasError ? [
    'border-error',
    'focus:brutal-shadow-error'
  ] : [];

  const textareaStyles = [
    ...(props.grouped ? [] : ['w-full']),
    ...baseStyles,
    ...getSizeStyles(props.size || 'md'),
    ...errorStyles,
    props.className
  ].filter(Boolean).join(' ');

  return (
    <div className={props.grouped ? '' : 'w-full'}>
      <label
        htmlFor={inputId}
        className="block font-mono font-black text-text-primary uppercase mb-2 text-lg tracking-wide"
      >
        {props.label}
        {props.register?.required && (
          <span className="text-error ml-1">*</span>
        )}
      </label>

      <textarea
        ref={ref}
        id={inputId}
        placeholder={props.placeholder}
        className={textareaStyles}
        rows={props.rows ?? DEFAULT_ROWS}
        data-testid={props.testId}
        {...props.register}
      />

      {hasError && (
        <div className="mt-3 p-3 bg-error border-brutal-sm border-text-primary text-white">
          <div className="font-mono font-bold uppercase text-sm">
            ⚠ {props.error}
          </div>
        </div>
      )}

      {hasFeedback && (
        <div className="mt-3 p-3 bg-accent border-brutal-sm border-text-primary text-white">
          <div className="font-mono font-bold uppercase text-sm">
            {props.validationFeedback}
          </div>
        </div>
      )}
    </div>
  );
});