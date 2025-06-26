import { useState, useEffect } from 'react';

/**
 * PasswordStrengthIndicator Component.
 * 
 * Visual indicator showing password strength with thick borders and bold colors.
 * Uses system colors for consistent theming.
 * 
 * @example
 * ```tsx
 * <PasswordStrengthIndicator password={passwordValue} />
 * ```
 */
interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
  testId?: string;
}

const getStrengthColor = (strength: number) => {
  if (strength === 0) return 'bg-ui-border';
  if (strength <= 2) return 'bg-error';
  if (strength <= 4) return 'bg-warning';
  return 'bg-success';
};

const getStrengthText = (strength: number) => {
  if (strength === 0) return '';
  if (strength <= 2) return 'Weak';
  if (strength <= 4) return 'Good';
  return 'Strong';
};

export const PasswordStrengthIndicator = ({ 
  password, 
  className = '',
  testId = 'password-strength'
}: PasswordStrengthIndicatorProps) => {
  const [strength, setStrength] = useState(0);
  
  useEffect(() => {
    const requirements = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password), 
      /[0-9]/.test(password),
      /[^a-zA-Z0-9]/.test(password)
    ];
  
    const passedCount = requirements.filter(Boolean).length;
    setStrength(passedCount); // 0-5
  }, [password]);

  const color = getStrengthColor(strength);
  const strengthText = getStrengthText(strength);
  const thresholds = [2, 4, 5];
  
  return (
    <div className={`mt-3 ${className}`} data-testid={testId}>
      <div className="flex gap-2">
        {thresholds.map((threshold, index) => (
          <div
            key={index}
            className={`h-3 flex-1 border-brutal-sm border-text-primary brutal-transition ${
              strength >= threshold ? color : 'bg-background'
            }`}
          />
        ))}
      </div>
      {strengthText && (
        <div className="mt-2 font-mono font-bold uppercase text-sm tracking-wide text-text-secondary">
          Strength: <span className={`${color.replace('bg-', 'text-')}`}>{strengthText}</span>
        </div>
      )}
    </div>
  );
};