import { describe, expect, it } from 'vitest';
import { AuthStatus, authIsLoading, authIsKnown } from '../../src/lib/types/authStatus';

describe('authStatus utilities', () => {
  describe('authIsLoading', () => {
    it('should return true for loading states', () => {
      expect(authIsLoading(AuthStatus.CHECKING)).toBe(true);
      expect(authIsLoading(AuthStatus.LOGGING_IN)).toBe(true);
      expect(authIsLoading(AuthStatus.LOGGING_OUT)).toBe(true);
    });

    it('should return false for known states', () => {
      expect(authIsLoading(AuthStatus.LOGGED_IN)).toBe(false);
      expect(authIsLoading(AuthStatus.LOGGED_OUT)).toBe(false);
    });
  });

  describe('authIsKnown', () => {
    it('should return true for definitive auth states', () => {
      expect(authIsKnown(AuthStatus.LOGGED_IN)).toBe(true);
      expect(authIsKnown(AuthStatus.LOGGED_OUT)).toBe(true);
    });

    it('should return false for loading/transitional states', () => {
      expect(authIsKnown(AuthStatus.CHECKING)).toBe(false);
      expect(authIsKnown(AuthStatus.LOGGING_IN)).toBe(false);
      expect(authIsKnown(AuthStatus.LOGGING_OUT)).toBe(false);
    });
  });

  describe('AuthStatus enum values', () => {
    it('should have expected string values', () => {
      expect(AuthStatus.CHECKING).toBe('CHECKING');
      expect(AuthStatus.LOGGING_IN).toBe('LOGGING_IN');
      expect(AuthStatus.LOGGING_OUT).toBe('LOGGING_OUT');
      expect(AuthStatus.LOGGED_IN).toBe('LOGGED_IN');
      expect(AuthStatus.LOGGED_OUT).toBe('LOGGED_OUT');
    });
  });
});