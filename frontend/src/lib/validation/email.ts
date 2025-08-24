import { z } from 'zod';

/**
 * Email validation schema using Zod.
 * Provides consistent validation rules across the application.
 */
const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

/**
 * Validates an email address and returns an error message if invalid.
 * 
 * @param email - The email address to validate
 * @returns Error message string if invalid, null if valid
 * 
 * @example
 * ```typescript
 * const error = validateEmail('user@example.com');
 * if (error) {
 *   console.error(error); // null - valid email
 * }
 * 
 * const error2 = validateEmail('invalid-email');
 * console.error(error2); // "Please enter a valid email address"
 * ```
 */
export const validateEmail = (email: string): string | null => {
  const result = emailSchema.safeParse({ email });
  return result.success ? null : result.error.errors[0]?.message || 'Invalid email address';
};

/**
 * Validates an email address and returns a boolean result.
 * 
 * @param email - The email address to validate
 * @returns True if valid, false if invalid
 * 
 * @example
 * ```typescript
 * if (isValidEmail('user@example.com')) {
 *   // Email is valid
 * }
 * ```
 */
export const isValidEmail = (email: string): boolean => {
  return validateEmail(email) === null;
};