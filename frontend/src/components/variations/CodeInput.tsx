import { forwardRef } from 'react';
import { TextInput, type TextInputProps } from '../form/TextInput';

/**
 * CodeInput Component - Specialized input for codes, tokens, and short alphanumeric strings.
 * 
 * Built on top of TextInput with enhanced styling for code entry scenarios.
 * Features centered text, extra letter spacing, and uppercase transformation.
 * Perfect for invitation codes, verification codes, household IDs, etc.
 * 
 * @example
 * ```tsx
 * // Invitation code input
 * <CodeInput 
 *   label="Invitation Code"
 *   placeholder="ABC123"
 *   maxLength={6}
 *   size="large"
 * />
 * 
 * // Verification code
 * <CodeInput 
 *   label="Verification Code"
 *   placeholder="123456"
 *   maxLength={6}
 *   autoComplete="one-time-code"
 * />
 * ```
 */
interface CodeInputProps extends Omit<TextInputProps, 'type'> {
  maxLength?: number;
  autoComplete?: string;
}

export const CodeInput = forwardRef<HTMLInputElement, CodeInputProps>(
  ({ maxLength = 8, className = '', autoComplete, ...props }, ref) => {
    // Enhanced styling for code inputs
    const codeStyles = [
      'text-center',
      'tracking-widest',
      'uppercase',
      'font-black',
      'text-2xl',
      className
    ].filter(Boolean).join(' ');

    return (
      <TextInput
        ref={ref}
        {...props}
        type="text"
        className={codeStyles}
        maxLength={maxLength}
        autoComplete={autoComplete}
        spellCheck={false}
        autoCapitalize="characters"
      />
    );
  }
);

CodeInput.displayName = 'CodeInput';