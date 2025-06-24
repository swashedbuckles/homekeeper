import { useState, useEffect } from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const getStrengthColor = (strength: number) => {
  if (strength === 0) return 'bg-gray-300';
  if (strength <= 2) return 'bg-red-500';
  if (strength <= 4) return 'bg-yellow-500';
  return 'bg-green-500';
};

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
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
  const thresholds = [2, 4, 5];
  return (
    <div className="flex gap-1 mt-2">
      {thresholds.map((threshold, index) => (
        <div
          key={index}
          className={`h-2 flex-1 rounded-sm transition-all duration-300 ${
            strength >= threshold ? color : 'bg-gray-200'
          }`}
        />
      ))}
      {/* <span>{color} {strength}</span> */}
    </div>
  );
};