/**
 * Date and expiration utility functions for invitation management.
 * Provides consistent date handling and expiration formatting across the application.
 * 
 * @note If we find ourselves needing more comprehensive date utilities,
 * consider installing date-fns for more robust date manipulation.
 */

/**
 * Calculates the difference in days between two dates.
 * 
 * @param startDate - The earlier date
 * @param endDate - The later date
 * @returns Number of days difference (negative if startDate is after endDate)
 * 
 * @example
 * ```typescript
 * const today = new Date();
 * const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
 * 
 * const diff = dateDiffInDays(today, nextWeek);
 * console.log(diff); // 7
 * ```
 */
export function dateDiffInDays(startDate: Date, endDate: Date): number {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  
  // Discard the time and time-zone information for accurate day calculation
  const utc1 = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const utc2 = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  return Math.floor((utc2 - utc1) / MS_PER_DAY);
}

/**
 * Checks if an invitation has expired based on days remaining.
 * 
 * @param daysRemaining - Number of days remaining (negative values indicate expired)
 * @returns True if expired (days <= 0), false otherwise
 * 
 * @example
 * ```typescript
 * console.log(isExpired(-1)); // true
 * console.log(isExpired(0));  // true  
 * console.log(isExpired(3));  // false
 * ```
 */
export function isExpired(daysRemaining: number): boolean {
  return daysRemaining <= 0;
}

/**
 * Formats expiration information into a human-readable string.
 * 
 * @param daysRemaining - Number of days remaining
 * @returns Formatted expiration string
 * 
 * @example
 * ```typescript
 * console.log(formatExpirationDays(-1)); // "EXPIRED"
 * console.log(formatExpirationDays(0));  // "EXPIRED"
 * console.log(formatExpirationDays(1));  // "Expires in 1 day"
 * console.log(formatExpirationDays(7));  // "Expires in 7 days"
 * console.log(formatExpirationDays(14)); // "Expires in 14 days"
 * ```
 */
export function formatExpirationDays(daysRemaining: number): string {
  if (isExpired(daysRemaining)) {
    return 'EXPIRED';
  }
  
  if (daysRemaining === 1) {
    return 'Expires in 1 day';
  }
  
  return `Expires in ${daysRemaining} days`;
}

/**
 * Calculates days remaining until a date and returns formatted expiration info.
 * 
 * @param expirationDate - The date when something expires
 * @param fromDate - The reference date to calculate from (defaults to current date)
 * @returns Object with days remaining and formatted string
 * 
 * @example
 * ```typescript
 * const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
 * const expiration = getExpirationInfo(nextWeek);
 * 
 * console.log(expiration);
 * // { 
 * //   daysRemaining: 7, 
 * //   formattedExpiration: "Expires in 7 days",
 * //   isExpired: false 
 * // }
 * ```
 */
export function getExpirationInfo(expirationDate: Date, fromDate: Date = new Date()) {
  const daysRemaining = dateDiffInDays(fromDate, expirationDate);
  
  return {
    daysRemaining,
    formattedExpiration: formatExpirationDays(daysRemaining),
    isExpired: isExpired(daysRemaining)
  };
}