/**
 * Standardized Color System for HomeKeeper Design System
 * 
 * Provides consistent color tokens across all components using semantic naming.
 * Ensures visual consistency and maintainable color relationships.
 */

// =====================================
// Core Color Types
// =====================================

/**
 * Standard component color scale
 * Used by badges, text, stats, and other components requiring color variants
 */
export type StandardColor = 'primary' | 'secondary' | 'accent' | 'dark' | 'error' | 'success' | 'warning' | 'white';

// =====================================
// Color Token System
// =====================================

/**
 * Text color tokens providing consistent text styling
 * Maps semantic colors to Tailwind text classes
 */
export const TEXT_COLOR_TOKENS = {
  primary: 'text-primary',
  secondary: 'text-text-secondary',
  accent: 'text-accent',
  dark: 'text-text-primary',
  error: 'text-error',
  success: 'text-accent',
  warning: 'text-primary',
  white: 'text-white'
} as const;

/**
 * Background color tokens providing consistent background styling
 * Maps semantic colors to Tailwind background classes
 */
export const BACKGROUND_COLOR_TOKENS = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-accent',
  dark: 'bg-text-primary',
  error: 'bg-error',
  success: 'bg-accent',
  warning: 'bg-primary',
  white: 'bg-white'
} as const;

/**
 * Border color tokens providing consistent border styling
 * Maps semantic colors to Tailwind border classes
 */
export const BORDER_COLOR_TOKENS = {
  primary: 'border-primary',
  secondary: 'border-secondary',
  accent: 'border-accent',
  dark: 'border-text-primary',
  error: 'border-error',
  success: 'border-accent',
  warning: 'border-primary',
  white: 'border-white'
} as const;

/**
 * Shadow color tokens providing consistent brutal shadow styling
 * Maps semantic colors to custom brutal shadow classes
 */
export const SHADOW_COLOR_TOKENS = {
  primary: 'brutal-shadow-primary',
  secondary: 'brutal-shadow-secondary',
  accent: 'brutal-shadow-accent',
  dark: 'brutal-shadow-primary',
  error: 'brutal-shadow-dark',
  success: 'brutal-shadow-dark',
  warning: 'brutal-shadow-dark',
  white: 'brutal-shadow-dark'
} as const;

// =====================================
// Utility Functions
// =====================================

/**
 * Get text color class for a semantic color
 * 
 * @param color - The standard color
 * @returns The corresponding text CSS class
 * 
 * @example
 * getTextColor('primary') // Returns 'text-primary'
 * getTextColor('error') // Returns 'text-error'
 */
export function getTextColor(color: StandardColor): string {
  return TEXT_COLOR_TOKENS[color];
}

/**
 * Get background color class for a semantic color
 * 
 * @param color - The standard color
 * @returns The corresponding background CSS class
 * 
 * @example
 * getBackgroundColor('primary') // Returns 'bg-primary'
 * getBackgroundColor('error') // Returns 'bg-error'
 */
export function getBackgroundColor(color: StandardColor): string {
  return BACKGROUND_COLOR_TOKENS[color];
}

/**
 * Get border color class for a semantic color
 * 
 * @param color - The standard color
 * @returns The corresponding border CSS class
 * 
 * @example
 * getBorderColor('primary') // Returns 'border-primary'
 * getBorderColor('error') // Returns 'border-error'
 */
export function getBorderColor(color: StandardColor): string {
  return BORDER_COLOR_TOKENS[color];
}

/**
 * Get shadow color class for a semantic color
 * 
 * @param color - The standard color
 * @returns The corresponding shadow CSS class
 * 
 * @example
 * getShadowColor('primary') // Returns 'brutal-shadow-primary'
 * getShadowColor('error') // Returns 'brutal-shadow-dark'
 */
export function getShadowColor(color: StandardColor): string {
  return SHADOW_COLOR_TOKENS[color];
}

// =====================================
// Color Relationships
// =====================================

/**
 * Color progression for easy iteration and validation
 * Useful for generating color variants and ensuring consistency
 */
export const COLOR_ORDER: StandardColor[] = [
  'primary', 'secondary', 'accent', 'dark', 'error', 'success', 'warning', 'white'
];

/**
 * Default colors for different component categories
 * Provides sensible defaults while maintaining consistency
 */
export const DEFAULT_COLORS = {
  badge: 'primary' as StandardColor,
  text: 'dark' as StandardColor,
  stats: 'primary' as StandardColor,
  button: 'primary' as StandardColor,
  alert: 'primary' as StandardColor
} as const;

/**
 * Semantic color mappings for common use cases
 * Maps intent to appropriate colors
 */
export const SEMANTIC_COLORS = {
  // Status indicators
  positive: 'success' as StandardColor,
  negative: 'error' as StandardColor,
  neutral: 'secondary' as StandardColor,
  
  // Urgency levels
  urgent: 'error' as StandardColor,
  important: 'warning' as StandardColor,
  normal: 'secondary' as StandardColor,
  
  // Action types
  destructive: 'error' as StandardColor,
  constructive: 'success' as StandardColor,
  informational: 'primary' as StandardColor
} as const;