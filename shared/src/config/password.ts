import { z } from 'zod';

export interface PasswordRequirements {
  minLength: number;
  requireLowercase: boolean;
  requireUppercase: boolean;
  requireNumber: boolean;
  requireSymbol: boolean;
}

export const getPasswordRequirements = (): PasswordRequirements => {
  // Check if we're in development (works for both Node.js and browser environments)
  const isDevelopment = 
    (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') ||
    (typeof window !== 'undefined' && window.location?.hostname === 'localhost');
  
  if (isDevelopment) {
    return {
      minLength: 4,
      requireLowercase: false,
      requireUppercase: false,
      requireNumber: false,
      requireSymbol: false,
    };
  }
  
  return {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumber: true,
    requireSymbol: true,
  };
};

export const createPasswordSchema = (): z.ZodString => {
  const requirements = getPasswordRequirements();
  let schema = z.string().min(requirements.minLength, `Password must be at least ${requirements.minLength} characters`);

  if (requirements.requireLowercase) {
    schema = schema.regex(/[a-z]/, 'Password must contain at least one lowercase letter');
  }

  if (requirements.requireUppercase) {
    schema = schema.regex(/[A-Z]/, 'Password must contain at least one uppercase letter');
  }

  if (requirements.requireNumber) {
    schema = schema.regex(/[0-9]/, 'Password must contain at least one number');
  }

  if (requirements.requireSymbol) {
    schema = schema.regex(/[^a-zA-Z0-9]/, 'Password must contain at least one symbol');
  }

  return schema;
};