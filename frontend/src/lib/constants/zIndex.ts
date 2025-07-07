/**
 * Z-index constants for consistent layering across the application
 * 
 * Usage:
 * - Import: import { Z_INDEX } from '@/lib/constants/zIndex';
 * - Use: className={`relative z-[${Z_INDEX.HEADER}]`}
 * - Or with Tailwind safelist: className="z-10" (using the Tailwind equivalent)
 */
export const Z_INDEX = {
  /** Background elements, floating decorations */
  BACKGROUND: 0,
  
  /** Main page content, outlet content */
  CONTENT: 10,
  
  /** Site headers, navigation bars */
  HEADER: 40,
  
  /** Mobile menus, dropdowns, overlays */
  MOBILE_MENU: 50,
  
  /** Modals, dialogs */
  MODAL: 60,
  
  /** Tooltips, toasts, notifications */
  TOOLTIP: 70,
  
  /** Critical alerts, system messages */
  ALERT: 80,
  
  /** Debug overlays, development tools */
  DEBUG: 90
} as const;

/**
 * Tailwind-safe z-index classes
 * Use these when you need Tailwind to recognize the z-index values
 */
export const Z_INDEX_CLASSES = {
  BACKGROUND: 'z-0',
  CONTENT: 'z-10', 
  HEADER: 'z-40',
  MOBILE_MENU: 'z-50',
  MODAL: 'z-60',
  TOOLTIP: 'z-70',
  ALERT: 'z-80',
  DEBUG: 'z-90'
} as const;

// Type for TypeScript autocomplete
export type ZIndexLevel = keyof typeof Z_INDEX;