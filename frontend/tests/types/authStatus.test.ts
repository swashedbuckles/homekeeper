import { describe, expect, it } from 'vitest';
import { AuthStatus, authIsLoading, authIsKnown } from '../../src/lib/types/authStatus';

describe('authStatus utilities', () => {
  const loadingStates = [
    { status: AuthStatus.CHECKING, expected: true },
    { status: AuthStatus.LOGGING_IN, expected: true },
    { status: AuthStatus.LOGGING_OUT, expected: true }
  ];

  const knownStates = [
    { status: AuthStatus.LOGGED_IN, expected: false },
    { status: AuthStatus.LOGGED_OUT, expected: false }
  ];

  describe('authIsLoading', () => {
    it('should return true for loading states', () => {
      loadingStates.forEach(({ status, expected }) => {
        expect(authIsLoading(status)).toBe(expected);
      });
    });

    it('should return false for known states', () => {
      knownStates.forEach(({ status, expected }) => {
        expect(authIsLoading(status)).toBe(expected);
      });
    });
  });

  const definitiveStates = [
    { status: AuthStatus.LOGGED_IN, expected: true },
    { status: AuthStatus.LOGGED_OUT, expected: true }
  ];

  const transitionalStates = [
    { status: AuthStatus.CHECKING, expected: false },
    { status: AuthStatus.LOGGING_IN, expected: false },
    { status: AuthStatus.LOGGING_OUT, expected: false }
  ];

  describe('authIsKnown', () => {
    it('should return true for definitive auth states', () => {
      definitiveStates.forEach(({ status, expected }) => {
        expect(authIsKnown(status)).toBe(expected);
      });
    });

    it('should return false for loading/transitional states', () => {
      transitionalStates.forEach(({ status, expected }) => {
        expect(authIsKnown(status)).toBe(expected);
      });
    });
  });

  const enumValues = [
    { key: 'CHECKING', value: AuthStatus.CHECKING, expected: 'CHECKING' },
    { key: 'LOGGING_IN', value: AuthStatus.LOGGING_IN, expected: 'LOGGING_IN' },
    { key: 'LOGGING_OUT', value: AuthStatus.LOGGING_OUT, expected: 'LOGGING_OUT' },
    { key: 'LOGGED_IN', value: AuthStatus.LOGGED_IN, expected: 'LOGGED_IN' },
    { key: 'LOGGED_OUT', value: AuthStatus.LOGGED_OUT, expected: 'LOGGED_OUT' }
  ];

  describe('AuthStatus enum values', () => {
    it('should have expected string values', () => {
      enumValues.forEach(({ value, expected }) => {
        expect(value).toBe(expected);
      });
    });
  });
});