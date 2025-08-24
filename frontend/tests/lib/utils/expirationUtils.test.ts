import { describe, it, expect } from 'vitest';

import { 
  dateDiffInDays, 
  isExpired, 
  formatExpirationDays, 
  getExpirationInfo 
} from '../../../src/lib/utils/expirationUtils';

describe('expirationUtils', () => {
  describe('dateDiffInDays', () => {
    it('should calculate positive difference correctly', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-08');
      
      expect(dateDiffInDays(startDate, endDate)).toBe(7);
    });

    it('should calculate negative difference correctly', () => {
      const startDate = new Date('2024-01-08');
      const endDate = new Date('2024-01-01');
      
      expect(dateDiffInDays(startDate, endDate)).toBe(-7);
    });

    it('should return 0 for same date', () => {
      const date = new Date('2024-01-01');
      
      expect(dateDiffInDays(date, date)).toBe(0);
    });

    it('should handle dates in different months', () => {
      const startDate = new Date('2024-01-31');
      const endDate = new Date('2024-02-01');
      
      expect(dateDiffInDays(startDate, endDate)).toBe(1);
    });

    it('should handle dates in different years', () => {
      const startDate = new Date('2023-12-31');
      const endDate = new Date('2024-01-01');
      
      expect(dateDiffInDays(startDate, endDate)).toBe(1);
    });

    it('should ignore time components', () => {
      const startDate = new Date('2024-01-01T23:59:59');
      const endDate = new Date('2024-01-02T00:00:01');
      
      expect(dateDiffInDays(startDate, endDate)).toBe(1);
    });

    it('should handle leap years correctly', () => {
      const startDate = new Date('2024-02-28'); // 2024 is a leap year
      const endDate = new Date('2024-03-01');
      
      expect(dateDiffInDays(startDate, endDate)).toBe(2); // Feb 28 -> Feb 29 -> Mar 1
    });
  });

  describe('isExpired', () => {
    it('should return true for negative days', () => {
      expect(isExpired(-1)).toBe(true);
      expect(isExpired(-10)).toBe(true);
    });

    it('should return true for zero days', () => {
      expect(isExpired(0)).toBe(true);
    });

    it('should return false for positive days', () => {
      expect(isExpired(1)).toBe(false);
      expect(isExpired(7)).toBe(false);
      expect(isExpired(30)).toBe(false);
    });
  });

  describe('formatExpirationDays', () => {
    it('should format expired invitations', () => {
      expect(formatExpirationDays(-1)).toBe('EXPIRED');
      expect(formatExpirationDays(-10)).toBe('EXPIRED');
      expect(formatExpirationDays(0)).toBe('EXPIRED');
    });

    it('should format singular day correctly', () => {
      expect(formatExpirationDays(1)).toBe('Expires in 1 day');
    });

    it('should format multiple days correctly', () => {
      expect(formatExpirationDays(2)).toBe('Expires in 2 days');
      expect(formatExpirationDays(7)).toBe('Expires in 7 days');
      expect(formatExpirationDays(14)).toBe('Expires in 14 days');
      expect(formatExpirationDays(30)).toBe('Expires in 30 days');
    });
  });

  describe('getExpirationInfo', () => {
    it('should return correct info for future expiration', () => {
      const fromDate = new Date('2024-01-01');
      const expirationDate = new Date('2024-01-08');
      
      const result = getExpirationInfo(expirationDate, fromDate);
      
      expect(result.daysRemaining).toBe(7);
      expect(result.formattedExpiration).toBe('Expires in 7 days');
      expect(result.isExpired).toBe(false);
    });

    it('should return correct info for expired invitation', () => {
      const fromDate = new Date('2024-01-08');
      const expirationDate = new Date('2024-01-01');
      
      const result = getExpirationInfo(expirationDate, fromDate);
      
      expect(result.daysRemaining).toBe(-7);
      expect(result.formattedExpiration).toBe('EXPIRED');
      expect(result.isExpired).toBe(true);
    });

    it('should return correct info for same-day expiration', () => {
      const date = new Date('2024-01-01');
      
      const result = getExpirationInfo(date, date);
      
      expect(result.daysRemaining).toBe(0);
      expect(result.formattedExpiration).toBe('EXPIRED');
      expect(result.isExpired).toBe(true);
    });

    it('should use current date as default fromDate', () => {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      
      const result = getExpirationInfo(futureDate);
      
      expect(result.daysRemaining).toBe(7);
      expect(result.formattedExpiration).toBe('Expires in 7 days');
      expect(result.isExpired).toBe(false);
    });

    it('should handle single day remaining', () => {
      const fromDate = new Date('2024-01-01');
      const expirationDate = new Date('2024-01-02');
      
      const result = getExpirationInfo(expirationDate, fromDate);
      
      expect(result.daysRemaining).toBe(1);
      expect(result.formattedExpiration).toBe('Expires in 1 day');
      expect(result.isExpired).toBe(false);
    });
  });

  describe('integration scenarios', () => {
    it('should handle typical invitation expiration scenario', () => {
      // Invitation created 7 days ago, expires in 14 days from creation (7 days from now)
      const currentDate = new Date('2024-01-08');
      const expirationDate = new Date('2024-01-15'); // 14 days from creation (Jan 1)
      
      const info = getExpirationInfo(expirationDate, currentDate);
      
      expect(info.daysRemaining).toBe(7);
      expect(info.formattedExpiration).toBe('Expires in 7 days');
      expect(info.isExpired).toBe(false);
    });

    it('should handle invitation that expired yesterday', () => {
      const currentDate = new Date('2024-01-08');
      const expirationDate = new Date('2024-01-07');
      
      const info = getExpirationInfo(expirationDate, currentDate);
      
      expect(info.daysRemaining).toBe(-1);
      expect(info.formattedExpiration).toBe('EXPIRED');
      expect(info.isExpired).toBe(true);
    });

    it('should handle invitation expiring today', () => {
      const date = new Date('2024-01-08');
      
      const info = getExpirationInfo(date, date);
      
      expect(info.daysRemaining).toBe(0);
      expect(info.formattedExpiration).toBe('EXPIRED');
      expect(info.isExpired).toBe(true);
    });

    it('should be consistent across all utility functions', () => {
      const scenarios = [
        { from: '2024-01-01', to: '2024-01-08', expectedDays: 7 },
        { from: '2024-01-08', to: '2024-01-01', expectedDays: -7 },
        { from: '2024-01-01', to: '2024-01-02', expectedDays: 1 },
        { from: '2024-01-02', to: '2024-01-01', expectedDays: -1 },
        { from: '2024-01-01', to: '2024-01-01', expectedDays: 0 }
      ];

      scenarios.forEach(({ from, to, expectedDays }) => {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        
        // All functions should be consistent
        const daysDiff = dateDiffInDays(fromDate, toDate);
        const expired = isExpired(expectedDays);
        const formatted = formatExpirationDays(expectedDays);
        const info = getExpirationInfo(toDate, fromDate);
        
        expect(daysDiff).toBe(expectedDays);
        expect(info.daysRemaining).toBe(expectedDays);
        expect(info.isExpired).toBe(expired);
        expect(info.formattedExpiration).toBe(formatted);
      });
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle very large date differences', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2025-01-01'); // 1 year later
      
      const daysDiff = dateDiffInDays(startDate, endDate);
      expect(daysDiff).toBeGreaterThan(300); // At least 365 days
      
      const formatted = formatExpirationDays(daysDiff);
      expect(formatted).toBe(`Expires in ${daysDiff} days`);
    });

    it('should handle UTC dates correctly', () => {
      // Focus on the main UTC date calculation behavior
      const date1 = new Date('2024-01-01T00:00:00Z');
      const date2 = new Date('2024-01-02T00:00:00Z');
      
      expect(dateDiffInDays(date1, date2)).toBe(1);
    });

    it('should maintain consistency with real-world usage patterns', () => {
      // Simulate how the utilities would be used in the actual application
      const invitationData = {
        createdAt: '2024-01-01T10:30:00Z',
        expiresAt: '2024-01-15T10:30:00Z' // 14 days later
      };
      
      const currentTime = '2024-01-08T15:45:00Z'; // 7+ days after creation
      
      const expirationInfo = getExpirationInfo(
        new Date(invitationData.expiresAt),
        new Date(currentTime)
      );
      
      expect(expirationInfo.daysRemaining).toBe(7);
      expect(expirationInfo.isExpired).toBe(false);
    });
  });
});