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
 * Container width sizes (for NarrowContainer)
 * Covers mobile-first to medium layouts with seamless progression
 */
export type ContainerWidthSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

/**
 * Wide container sizes (for WideContainer)
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

/**
 * Responsive text size tokens providing mobile-first scaling
 * Used for components that need responsive typography
 */
export const RESPONSIVE_TEXT_TOKENS = {
  xs: 'text-xs',                              // xs on all breakpoints
  sm: 'text-xs md:text-sm',                   // xs → sm
  md: 'text-sm md:text-base',                 // sm → base
  lg: 'text-base md:text-lg',                 // base → lg
  xl: 'text-lg md:text-xl'                    // lg → xl
} as const;

/**
 * Responsive spacing tokens providing mobile-first scaling
 * Used for components that need responsive padding, margins, and gaps
 */
export const RESPONSIVE_SPACING_TOKENS = {
  xs: {
    padding: 'p-2',                           // xs on all breakpoints
    paddingX: 'px-2',
    paddingY: 'py-1',
    margin: 'm-2',
    marginX: 'mx-2', 
    marginY: 'my-1',
    gap: 'gap-1'
  },
  sm: {
    padding: 'p-2 md:p-3',                    // p-2 → p-3
    paddingX: 'px-2 md:px-3',
    paddingY: 'py-1 md:py-2',
    margin: 'm-2 md:m-3',
    marginX: 'mx-2 md:mx-3',
    marginY: 'my-1 md:my-2',
    gap: 'gap-1 md:gap-2'
  },
  md: {
    padding: 'p-3 md:p-4',                    // p-3 → p-4
    paddingX: 'px-3 md:px-4',
    paddingY: 'py-2 md:py-3',
    margin: 'm-3 md:m-4',
    marginX: 'mx-3 md:mx-4',
    marginY: 'my-2 md:my-3',
    gap: 'gap-2 md:gap-4'
  },
  lg: {
    padding: 'p-4 md:p-6',                    // p-4 → p-6
    paddingX: 'px-4 md:px-6',
    paddingY: 'py-3 md:py-4',
    margin: 'm-4 md:m-6',
    marginX: 'mx-4 md:mx-6',
    marginY: 'my-3 md:my-4',
    gap: 'gap-4 md:gap-6'
  },
  xl: {
    padding: 'p-6 md:p-8',                    // p-6 → p-8
    paddingX: 'px-6 md:px-8',
    paddingY: 'py-4 md:py-4',
    margin: 'm-6 md:m-8',
    marginX: 'mx-6 md:mx-8',
    marginY: 'my-4 md:my-4',
    gap: 'gap-6 md:gap-8'
  }
} as const;

/**
 * Responsive shadow tokens providing mobile-first scaling
 * Used for components that need responsive shadow effects
 */
export const RESPONSIVE_SHADOW_TOKENS = {
  xs: 'brutal-shadow-primary-sm',             // xs on all breakpoints
  sm: 'brutal-shadow-primary-sm md:brutal-shadow-primary',     // sm → primary
  md: 'brutal-shadow-primary md:brutal-shadow-dark',          // primary → dark
  lg: 'brutal-shadow-dark md:brutal-shadow-double',           // dark → double
  xl: 'brutal-shadow-double'                  // double on all breakpoints
} as const;

// =====================================
// Container Size Tokens
// =====================================

/**
 * Container width mappings to Tailwind max-width classes
 * Provides seamless progression from mobile to desktop layouts
 */
export const CONTAINER_WIDTH_TOKENS = {
  // NarrowContainer range: Mobile-first → Medium layouts
  sm: 'max-w-sm',     // 24rem / 384px
  md: 'max-w-md',     // 28rem / 448px  
  lg: 'max-w-lg',     // 32rem / 512px
  xl: 'max-w-xl',     // 36rem / 576px
  '2xl': 'max-w-2xl', // 42rem / 672px
  '3xl': 'max-w-3xl', // 48rem / 768px
  
  // WideContainer range: Large layouts → Full width
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
 * Get responsive text size token with mobile-first scaling
 * 
 * @param size - The standard size
 * @returns The corresponding responsive CSS classes
 * 
 * @example
 * getResponsiveTextToken('md') // Returns 'text-sm md:text-base'
 * getResponsiveTextToken('lg') // Returns 'text-base md:text-lg'
 */
export function getResponsiveTextToken(size: StandardSize): string {
  return RESPONSIVE_TEXT_TOKENS[size];
}

/**
 * Get responsive spacing token with mobile-first scaling
 * 
 * @param size - The standard size
 * @param aspect - Which aspect of spacing to retrieve
 * @returns The corresponding responsive CSS classes
 * 
 * @example
 * getResponsiveSpacingToken('md', 'padding') // Returns 'p-3 md:p-4'
 * getResponsiveSpacingToken('lg', 'gap') // Returns 'gap-4 md:gap-6'
 */
export function getResponsiveSpacingToken(
  size: StandardSize,
  aspect: keyof typeof RESPONSIVE_SPACING_TOKENS[StandardSize]
): string {
  return RESPONSIVE_SPACING_TOKENS[size][aspect];
}

/**
 * Get responsive shadow token with mobile-first scaling
 * 
 * @param size - The standard size
 * @returns The corresponding responsive CSS classes
 * 
 * @example
 * getResponsiveShadowToken('md') // Returns 'brutal-shadow-primary md:brutal-shadow-dark'
 * getResponsiveShadowToken('lg') // Returns 'brutal-shadow-dark md:brutal-shadow-double'
 */
export function getResponsiveShadowToken(size: StandardSize): string {
  return RESPONSIVE_SHADOW_TOKENS[size];
}

/**
 * Get container width class for NarrowContainer or WideContainer
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
 * No gaps between NarrowContainer max and WideContainer min
 */
export const CONTAINER_WIDTH_ORDER = [
  'sm',   // 24rem - NarrowContainer start
  'md',   // 28rem
  'lg',   // 32rem  
  'xl',   // 36rem
  '2xl',  // 42rem
  '3xl',  // 48rem - NarrowContainer end
  '4xl',  // 56rem - WideContainer start
  '5xl',  // 64rem
  '6xl',  // 72rem
  '7xl'   // 80rem - WideContainer end
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
  narrowContainer:  'lg' as ContainerWidthSize,
  wideContainer:    '7xl' as WideContainerSize,
  sectionSpacing:   'md' as ContainerSpacingSize
} as const;

// =====================================
// Breakpoint Utilities
// =====================================

/**
 * Standardized breakpoint names and their Tailwind prefixes
 * Provides consistent breakpoint usage across all components
 */
export const BREAKPOINTS = {
  mobile: '',           // 0-767px (default, no prefix)
  tablet: 'md:',        // 768px+ (primary breakpoint)
  desktop: 'lg:',       // 1024px+ (enhanced breakpoint)
  wide: 'xl:'          // 1280px+ (large screens)
} as const;

/**
 * Standard responsive patterns for common use cases
 * Provides consistent mobile-first patterns
 */
export const RESPONSIVE_PATTERNS = {
  // Visibility patterns
  mobileOnly: 'md:hidden',
  tabletUp: 'hidden md:block',
  desktopUp: 'hidden lg:block',
  
  // Layout patterns
  stackToRow: 'flex-col md:flex-row',
  rowToStack: 'flex-row md:flex-col',
  
  // Touch targets (44px minimum for mobile)
  touchTarget: 'min-h-[44px]',
  
  // Grid patterns
  singleToDouble: 'grid-cols-1 md:grid-cols-2',
  singleToTriple: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  singleToQuad: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
} as const;

/**
 * Get responsive pattern class string
 * 
 * @param pattern - The responsive pattern to use
 * @returns The corresponding CSS classes
 * 
 * @example
 * getResponsivePattern('tabletUp') // Returns 'hidden md:block'
 * getResponsivePattern('stackToRow') // Returns 'flex-col md:flex-row'
 */
export function getResponsivePattern(
  pattern: keyof typeof RESPONSIVE_PATTERNS
): string {
  return RESPONSIVE_PATTERNS[pattern];
}