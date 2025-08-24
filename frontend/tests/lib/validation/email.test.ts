import { describe, it, expect } from 'vitest';

import { validateEmail, isValidEmail } from '../../../src/lib/validation/email';

describe('email validation utilities', () => {
  describe('validateEmail', () => {
    it('should return null for valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'first+last@subdomain.example.org',
        'user123@test123.com',
        'a@b.co',
        'test.email+tag@example.com'
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(null);
      });
    });

    it('should return error message for invalid email addresses', () => {
      const invalidEmails = [
        'invalid',
        'invalid@',
        '@example.com',
        'invalid.email',
        'user@',
        'user@@domain.com',
        'user@domain',
        'user@domain.',
        'user name@example.com', // space in local part
        '',
        ' ',
        'user@.com',
        'user@domain..com',
      ];

      invalidEmails.forEach(email => {
        const result = validateEmail(email);
        expect(result).toBe('Please enter a valid email address');
      });
    });

    it('should handle edge cases', () => {
      // Test what Zod actually accepts
      expect(validateEmail('test@domain-with-hyphens.com')).toBe(null);
      expect(validateEmail('a@b.co')).toBe(null); // More realistic minimal case
      
      // Test edge cases that should fail
      expect(validateEmail('a@b.c')).toBe('Please enter a valid email address'); // Too short TLD
      expect(validateEmail('test@domain_with_underscores.com')).toBe('Please enter a valid email address'); // Underscore in domain
    });

    it('should be consistent with Zod email validation', () => {
      // These should all pass Zod's email validation
      const zodValidEmails = [
        'test@example.com',
        'user.email@example.co.uk',
        'first+last@test.org'
      ];

      zodValidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(null);
      });

      // These should all fail Zod's email validation
      const zodInvalidEmails = [
        'notanemail',
        '@missing-local.com',
        'missing-at-symbol.com'
      ];

      zodInvalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe('Please enter a valid email address');
      });
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'first+last@subdomain.example.org'
      ];

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    it('should return false for invalid email addresses', () => {
      const invalidEmails = [
        'invalid',
        'invalid@',
        '@example.com',
        'user@domain',
        ''
      ];

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });

    it('should be consistent with validateEmail', () => {
      const testEmails = [
        'valid@example.com',
        'invalid-email',
        'another@test.org',
        '@missing.com',
        'test@valid.co.uk'
      ];

      testEmails.forEach(email => {
        const isValid = isValidEmail(email);
        const validationResult = validateEmail(email);
        
        if (isValid) {
          expect(validationResult).toBe(null);
        } else {
          expect(validationResult).not.toBe(null);
        }
      });
    });
  });

  describe('integration with form validation', () => {
    it('should work correctly in form validation scenarios', () => {
      // Simulating form validation where empty string might be passed
      expect(validateEmail('')).toBe('Please enter a valid email address');
      expect(isValidEmail('')).toBe(false);

      // Simulating user typing scenarios
      const typingScenarios = [
        { input: 't', expected: false },
        { input: 'test', expected: false },
        { input: 'test@', expected: false },
        { input: 'test@example', expected: false },
        { input: 'test@example.', expected: false },
        { input: 'test@example.com', expected: true }
      ];

      typingScenarios.forEach(({ input, expected }) => {
        expect(isValidEmail(input)).toBe(expected);
      });
    });

    it('should provide user-friendly error messages', () => {
      const errorMessage = validateEmail('invalid-email');
      expect(errorMessage).toBe('Please enter a valid email address');
      expect(errorMessage).not.toContain('zod');
      expect(errorMessage).not.toContain('schema');
    });
  });
});