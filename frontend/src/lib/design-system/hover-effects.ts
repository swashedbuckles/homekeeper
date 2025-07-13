/**
 * Standardized Hover Effect System for HomeKeeper Design System
 * 
 * Provides consistent hover effects across all interactive components.
 * Ensures visual consistency and maintainable interaction patterns.
 */

// =====================================
// Core Hover Effect Types
// =====================================

/**
 * Standard hover effect options
 * Used by buttons, cards, interactive elements, etc.
 */
export type HoverEffect = 'lift' | 'press' | 'press-small' | 'none';

// =====================================
// Hover Effect Utilities
// =====================================

/**
 * CSS class mappings for hover effects
 * Maps to utilities defined in brutal-utilities.css
 */
export const HOVER_EFFECT_CLASSES = {
  lift: 'brutal-hover-lift',           // Lifts element with enhanced shadow
  press: 'brutal-hover-press',         // Presses element down, removes shadow
  'press-small': 'brutal-hover-press-small', // Smaller press effect
  none: ''                             // No hover effect
} as const;

/**
 * Get hover effect CSS class for a component
 * 
 * @param effect - The hover effect type
 * @returns The corresponding CSS class
 * 
 * @example
 * getHoverEffectClass('lift') // Returns 'brutal-hover-lift'
 * getHoverEffectClass('press') // Returns 'brutal-hover-press'
 * getHoverEffectClass('none') // Returns ''
 */
export function getHoverEffectClass(effect: HoverEffect): string {
  return HOVER_EFFECT_CLASSES[effect];
}

/**
 * Check if a hover effect requires transition classes
 * All effects except 'none' require brutal-transition
 * 
 * @param effect - The hover effect type
 * @returns Whether transition is needed
 * 
 * @example
 * requiresTransition('lift') // Returns true
 * requiresTransition('none') // Returns false
 */
export function requiresTransition(effect: HoverEffect): boolean {
  return effect !== 'none';
}

/**
 * Get complete hover effect classes including transition
 * 
 * @param effect - The hover effect type
 * @param includeTransition - Whether to include brutal-transition (default: true)
 * @returns Array of CSS classes for hover effect
 * 
 * @example
 * getHoverEffectClasses('lift') // Returns ['brutal-transition', 'brutal-hover-lift']
 * getHoverEffectClasses('press', false) // Returns ['brutal-hover-press']
 * getHoverEffectClasses('none') // Returns []
 */
export function getHoverEffectClasses(
  effect: HoverEffect, 
  includeTransition: boolean = true
): string[] {
  if (effect === 'none') {
    return [];
  }
  
  const classes = [getHoverEffectClass(effect)];
  
  if (includeTransition && requiresTransition(effect)) {
    classes.unshift('brutal-transition');
  }
  
  return classes;
}

// =====================================
// Component-Specific Hover Guidelines
// =====================================

/**
 * Recommended hover effects by component type
 * Provides guidance for consistent component behavior
 */
export const COMPONENT_HOVER_RECOMMENDATIONS = {
  // Interactive buttons and CTAs
  button: 'press' as HoverEffect,
  backButton: 'press' as HoverEffect,
  
  // Cards and content containers
  card: 'lift' as HoverEffect,
  optionCard: 'press' as HoverEffect,
  statCard: 'lift' as HoverEffect,
  taskCard: 'lift' as HoverEffect,
  
  // Small interactive elements
  badge: 'press-small' as HoverEffect,
  alert: 'none' as HoverEffect,        // Alerts are typically not interactive
  
  // Form elements (usually no hover on form inputs)
  textInput: 'none' as HoverEffect,
  textArea: 'none' as HoverEffect,
  checkbox: 'press-small' as HoverEffect,
  
  // Layout components
  listItem: 'lift' as HoverEffect,
} as const;

/**
 * Get recommended hover effect for a component type
 * 
 * @param componentType - The type of component
 * @returns Recommended hover effect
 * 
 * @example
 * getRecommendedHoverEffect('button') // Returns 'press'
 * getRecommendedHoverEffect('card') // Returns 'lift'
 */
export function getRecommendedHoverEffect(
  componentType: keyof typeof COMPONENT_HOVER_RECOMMENDATIONS
): HoverEffect {
  return COMPONENT_HOVER_RECOMMENDATIONS[componentType];
}

// =====================================
// Hover Effect Descriptions
// =====================================

/**
 * Human-readable descriptions of hover effects
 * Useful for documentation and component stories
 */
export const HOVER_EFFECT_DESCRIPTIONS = {
  lift: 'Lifts element up with enhanced shadow - good for cards and content',
  press: 'Presses element down and removes shadow - good for buttons and CTAs', 
  'press-small': 'Small press effect - good for small interactive elements',
  none: 'No hover effect - for non-interactive elements'
} as const;

/**
 * Get description for a hover effect
 * 
 * @param effect - The hover effect type
 * @returns Human-readable description
 */
export function getHoverEffectDescription(effect: HoverEffect): string {
  return HOVER_EFFECT_DESCRIPTIONS[effect];
}

// =====================================
// Default Hover Effects
// =====================================

/**
 * Default hover effects for different interaction contexts
 */
export const DEFAULT_HOVER_EFFECTS = {
  interactive: 'press' as HoverEffect,    // Default for buttons, links
  content: 'lift' as HoverEffect,         // Default for cards, containers
  subtle: 'press-small' as HoverEffect,   // Default for small elements
  static: 'none' as HoverEffect          // Default for non-interactive
} as const;