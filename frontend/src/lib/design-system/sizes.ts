/**
 * Standardized Size System for HomeKeeper Design System
 * 
 * Provides consistent size tokens across all components using xs/sm/md/lg/xl scale.
 * Ensures visual consistency and maintainable size relationships.
 */

// =====================================
// Core Size Types
// =====================================

/**
 * Standard component size scale
 * Used by buttons, badges, alerts, form elements, etc.
 */
export type StandardSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Container width sizes (for PageContainer)
 * Covers mobile-first to medium layouts with seamless progression
 */
export type ContainerWidthSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

/**
 * Wide container sizes (for ContentContainer)
 * Covers large layouts to full width
 */
export type WideContainerSize = '4xl' | '5xl' | '6xl' | '7xl' | 'none';

/**
 * Container spacing sizes (for SectionContainer)
 * Vertical spacing scale for content sections
 */
export type ContainerSpacingSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Extended typography size scale
 * For specialized text components requiring larger sizes
 */
export type TypographySize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

// =====================================
// Size Token System
// =====================================

/**
 * Core size tokens providing consistent spacing, typography, and borders
 * Used across all components for visual consistency
 */
export const SIZE_TOKENS = {
  xs: {
    padding:  'p-2',
    paddingX: 'px-2',
    paddingY: 'py-1',
    text:     'text-xs',
    border:   'border-2',
    spacing:  'gap-1',
    icon:     'w-3 h-3'
  },
  sm: {
    padding:  'p-3',
    paddingX: 'px-3',
    paddingY: 'py-2',
    text:     'text-sm',
    border:   'border-brutal-sm',   // 3px brutal border
    spacing:  'gap-2',
    icon:     'w-4 h-4'
  },
  md: {
    padding:  'p-4',
    paddingX: 'px-4',
    paddingY: 'py-3',
    text:     'text-base',
    border:   'border-brutal-md',   // 4px brutal border
    spacing:  'gap-4',
    icon:     'w-5 h-5'
  },
  lg: {
    padding:  'p-6',
    paddingX: 'px-6',
    paddingY: 'py-4',
    text:     'text-lg',
    border:   'border-brutal-lg',   // 6px brutal border
    spacing:  'gap-6',
    icon:     'w-6 h-6'
  },
  xl: {
    padding:  'p-8',
    paddingX: 'px-8',
    paddingY: 'py-4',
    text:     'text-xl',
    border:   'border-brutal-lg',   // 6px brutal border (consistent with lg)
    spacing:  'gap-8',
    icon:     'w-8 h-8'
  }
} as const;

// =====================================
// Container Size Tokens
// =====================================

/**
 * Container width mappings to Tailwind max-width classes
 * Provides seamless progression from mobile to desktop layouts
 */
export const CONTAINER_WIDTH_TOKENS = {
  // PageContainer range: Mobile-first → Medium layouts
  sm: 'max-w-sm',     // 24rem / 384px
  md: 'max-w-md',     // 28rem / 448px  
  lg: 'max-w-lg',     // 32rem / 512px
  xl: 'max-w-xl',     // 36rem / 576px
  '2xl': 'max-w-2xl', // 42rem / 672px
  '3xl': 'max-w-3xl', // 48rem / 768px
  
  // ContentContainer range: Large layouts → Full width
  '4xl': 'max-w-4xl', // 56rem / 896px
  '5xl': 'max-w-5xl', // 64rem / 1024px
  '6xl': 'max-w-6xl', // 72rem / 1152px
  '7xl': 'max-w-7xl', // 80rem / 1280px
  none: ''            // No max-width constraint
} as const;

/**
 * Container spacing mappings for vertical section padding
 * Provides consistent spacing hierarchy for content sections
 */
export const CONTAINER_SPACING_TOKENS = {
  sm: 'py-8',   // 2rem / 32px
  md: 'py-10',  // 2.5rem / 40px
  lg: 'py-16',  // 4rem / 64px
  xl: 'py-20'   // 5rem / 80px
} as const;

// =====================================
// Utility Functions
// =====================================

/**
 * Get size token for a specific component aspect
 * 
 * @param size - The standard size
 * @param aspect - Which aspect of the size token to retrieve
 * @returns The corresponding CSS class
 * 
 * @example
 * getSizeToken('md', 'padding') // Returns 'p-4'
 * getSizeToken('lg', 'text') // Returns 'text-lg'
 */
export function getSizeToken(
  size: StandardSize, 
  aspect: keyof typeof SIZE_TOKENS[StandardSize]
): string {
  return SIZE_TOKENS[size][aspect];
}

/**
 * Get container width class for PageContainer or ContentContainer
 * 
 * @param size - The container width size
 * @returns The corresponding max-width CSS class
 * 
 * @example
 * getContainerWidth('lg') // Returns 'max-w-lg'
 * getContainerWidth('4xl') // Returns 'max-w-4xl'
 */
export function getContainerWidth(
  size: ContainerWidthSize | WideContainerSize
): string {
  return CONTAINER_WIDTH_TOKENS[size];
}

/**
 * Get container spacing class for SectionContainer
 * 
 * @param spacing - The container spacing size
 * @returns The corresponding padding CSS class
 * 
 * @example
 * getContainerSpacing('md') // Returns 'py-10'
 * getContainerSpacing('lg') // Returns 'py-16'
 */
export function getContainerSpacing(spacing: ContainerSpacingSize): string {
  return CONTAINER_SPACING_TOKENS[spacing];
}

/**
 * Build complete size class string for components
 * Combines multiple size aspects into a single class string
 * 
 * @param size - The standard size
 * @param aspects - Array of size aspects to include
 * @returns Combined CSS classes
 * 
 * @example
 * buildSizeClasses('md', ['padding', 'text', 'border'])
 * // Returns 'p-4 text-base border-brutal-md'
 */
export function buildSizeClasses(
  size: StandardSize,
  aspects: Array<keyof typeof SIZE_TOKENS[StandardSize]>
): string {
  return aspects.map(aspect => getSizeToken(size, aspect)).join(' ');
}

// =====================================
// Size Relationships
// =====================================

/**
 * Size progression for easy iteration and validation
 * Useful for generating size variants and ensuring consistency
 */
export const SIZE_ORDER: StandardSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

/**
 * Container width progression showing seamless scaling
 * No gaps between PageContainer max and ContentContainer min
 */
export const CONTAINER_WIDTH_ORDER = [
  'sm',   // 24rem - PageContainer start
  'md',   // 28rem
  'lg',   // 32rem  
  'xl',   // 36rem
  '2xl',  // 42rem
  '3xl',  // 48rem - PageContainer end
  '4xl',  // 56rem - ContentContainer start
  '5xl',  // 64rem
  '6xl',  // 72rem
  '7xl'   // 80rem - ContentContainer end
] as const;

/**
 * Default sizes for different component categories
 * Provides sensible defaults while maintaining consistency
 */
export const DEFAULT_SIZES = {
  button:           'md' as StandardSize,
  badge:            'sm' as StandardSize,
  alert:            'md' as StandardSize,
  input:            'md' as StandardSize,
  pageContainer:    'lg' as ContainerWidthSize,
  contentContainer: '7xl' as WideContainerSize,
  sectionSpacing:   'md' as ContainerSpacingSize
} as const;