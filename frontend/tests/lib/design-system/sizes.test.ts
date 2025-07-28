import { describe, it, expect } from 'vitest';
import {
  type StandardSize,
  SIZE_TOKENS,
  RESPONSIVE_TEXT_TOKENS,
  RESPONSIVE_SPACING_TOKENS,
  RESPONSIVE_SHADOW_TOKENS,
  CONTAINER_WIDTH_TOKENS,
  CONTAINER_SPACING_TOKENS,
  getSizeToken,
  getResponsiveTextToken,
  getResponsiveSpacingToken,
  getResponsiveShadowToken,
  getContainerWidth,
  getContainerSpacing,
  buildSizeClasses,
  SIZE_ORDER,
  CONTAINER_WIDTH_ORDER,
  DEFAULT_SIZES,
  BREAKPOINTS,
  RESPONSIVE_PATTERNS,
  getResponsivePattern
} from '../../../src/lib/design-system/sizes';

describe('sizes design system', () => {
  describe('Size Types', () => {
    describe('StandardSize', () => {
      it('should include all expected size values', () => {
        const expectedSizes: StandardSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
        expect(SIZE_ORDER).toEqual(expectedSizes);
      });
    });

    describe('ContainerWidthSize and WideContainerSize progression', () => {
      it('should have seamless container width progression', () => {
        expect(CONTAINER_WIDTH_ORDER).toEqual([
          'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'
        ]);
      });
    });
  });

  describe('Size Token System', () => {
    describe('SIZE_TOKENS', () => {
      it('should have all size aspects for each standard size', () => {
        SIZE_ORDER.forEach(size => {
          expect(SIZE_TOKENS[size]).toHaveProperty('padding');
          expect(SIZE_TOKENS[size]).toHaveProperty('paddingX');
          expect(SIZE_TOKENS[size]).toHaveProperty('paddingY');
          expect(SIZE_TOKENS[size]).toHaveProperty('text');
          expect(SIZE_TOKENS[size]).toHaveProperty('border');
          expect(SIZE_TOKENS[size]).toHaveProperty('spacing');
          expect(SIZE_TOKENS[size]).toHaveProperty('icon');
        });
      });

      it('should have consistent token structure', () => {
        Object.values(SIZE_TOKENS).forEach(sizeTokens => {
          expect(sizeTokens.padding).toMatch(/^p-\d+$/);
          expect(sizeTokens.paddingX).toMatch(/^px-\d+$/);
          expect(sizeTokens.paddingY).toMatch(/^py-\d+$/);
          expect(sizeTokens.text).toMatch(/^text-(xs|sm|base|lg|xl)$/);
          expect(sizeTokens.spacing).toMatch(/^gap-\d+$/);
          expect(sizeTokens.icon).toMatch(/^w-\d+ h-\d+$/);
        });
      });

      it('should have progressive size scaling', () => {
        expect(SIZE_TOKENS.xs.text).toBe('text-xs');
        expect(SIZE_TOKENS.sm.text).toBe('text-sm');
        expect(SIZE_TOKENS.md.text).toBe('text-base');
        expect(SIZE_TOKENS.lg.text).toBe('text-lg');
        expect(SIZE_TOKENS.xl.text).toBe('text-xl');
      });

      it('should have brutal border system for sm and above', () => {
        expect(SIZE_TOKENS.xs.border).toBe('border-2');
        expect(SIZE_TOKENS.sm.border).toBe('border-brutal-sm');
        expect(SIZE_TOKENS.md.border).toBe('border-brutal-md');
        expect(SIZE_TOKENS.lg.border).toBe('border-brutal-lg');
        expect(SIZE_TOKENS.xl.border).toBe('border-brutal-lg');
      });
    });

    describe('RESPONSIVE_TEXT_TOKENS', () => {
      it('should provide mobile-first responsive scaling', () => {
        expect(RESPONSIVE_TEXT_TOKENS.xs).toBe('text-xs');
        expect(RESPONSIVE_TEXT_TOKENS.sm).toBe('text-xs md:text-sm');
        expect(RESPONSIVE_TEXT_TOKENS.md).toBe('text-sm md:text-base');
        expect(RESPONSIVE_TEXT_TOKENS.lg).toBe('text-base md:text-lg');
        expect(RESPONSIVE_TEXT_TOKENS.xl).toBe('text-lg md:text-xl');
        expect(RESPONSIVE_TEXT_TOKENS['2xl']).toBe('text-xl md:text-2xl');
        expect(RESPONSIVE_TEXT_TOKENS['3xl']).toBe('text-2xl md:text-3xl');
      });

      it('should use md: breakpoint for scaling', () => {
        Object.values(RESPONSIVE_TEXT_TOKENS).forEach(token => {
          if (token.includes(' ')) {
            expect(token).toMatch(/md:/);
          }
        });
      });
    });

    describe('RESPONSIVE_SPACING_TOKENS', () => {
      it('should have all spacing aspects for each size', () => {
        SIZE_ORDER.forEach(size => {
          expect(RESPONSIVE_SPACING_TOKENS[size]).toHaveProperty('padding');
          expect(RESPONSIVE_SPACING_TOKENS[size]).toHaveProperty('paddingX');
          expect(RESPONSIVE_SPACING_TOKENS[size]).toHaveProperty('paddingY');
          expect(RESPONSIVE_SPACING_TOKENS[size]).toHaveProperty('margin');
          expect(RESPONSIVE_SPACING_TOKENS[size]).toHaveProperty('marginX');
          expect(RESPONSIVE_SPACING_TOKENS[size]).toHaveProperty('marginY');
          expect(RESPONSIVE_SPACING_TOKENS[size]).toHaveProperty('gap');
        });
      });

      it('should provide progressive responsive scaling', () => {
        expect(RESPONSIVE_SPACING_TOKENS.sm.padding).toBe('p-2 md:p-3');
        expect(RESPONSIVE_SPACING_TOKENS.md.padding).toBe('p-3 md:p-4');
        expect(RESPONSIVE_SPACING_TOKENS.lg.padding).toBe('p-4 md:p-6');
      });

      it('should maintain xl padding consistency', () => {
        expect(RESPONSIVE_SPACING_TOKENS.xl.paddingY).toBe('py-4 md:py-4');
      });
    });

    describe('RESPONSIVE_SHADOW_TOKENS', () => {
      it('should provide brutal shadow progression', () => {
        expect(RESPONSIVE_SHADOW_TOKENS.xs).toBe('brutal-shadow-primary-sm');
        expect(RESPONSIVE_SHADOW_TOKENS.sm).toBe('brutal-shadow-primary-sm md:brutal-shadow-primary');
        expect(RESPONSIVE_SHADOW_TOKENS.md).toBe('brutal-shadow-primary md:brutal-shadow-dark');
        expect(RESPONSIVE_SHADOW_TOKENS.lg).toBe('brutal-shadow-dark md:brutal-shadow-double');
        expect(RESPONSIVE_SHADOW_TOKENS.xl).toBe('brutal-shadow-double');
      });
    });

    describe('CONTAINER_WIDTH_TOKENS', () => {
      it('should map container sizes to max-width classes', () => {
        expect(CONTAINER_WIDTH_TOKENS.sm).toBe('max-w-sm');
        expect(CONTAINER_WIDTH_TOKENS.md).toBe('max-w-md');
        expect(CONTAINER_WIDTH_TOKENS.lg).toBe('max-w-lg');
        expect(CONTAINER_WIDTH_TOKENS.xl).toBe('max-w-xl');
        expect(CONTAINER_WIDTH_TOKENS['2xl']).toBe('max-w-2xl');
        expect(CONTAINER_WIDTH_TOKENS['3xl']).toBe('max-w-3xl');
        expect(CONTAINER_WIDTH_TOKENS['4xl']).toBe('max-w-4xl');
        expect(CONTAINER_WIDTH_TOKENS['5xl']).toBe('max-w-5xl');
        expect(CONTAINER_WIDTH_TOKENS['6xl']).toBe('max-w-6xl');
        expect(CONTAINER_WIDTH_TOKENS['7xl']).toBe('max-w-7xl');
        expect(CONTAINER_WIDTH_TOKENS.none).toBe('');
      });
    });

    describe('CONTAINER_SPACING_TOKENS', () => {
      it('should map spacing sizes to padding classes', () => {
        expect(CONTAINER_SPACING_TOKENS.sm).toBe('py-8');
        expect(CONTAINER_SPACING_TOKENS.md).toBe('py-10');
        expect(CONTAINER_SPACING_TOKENS.lg).toBe('py-16');
        expect(CONTAINER_SPACING_TOKENS.xl).toBe('py-20');
      });
    });
  });

  describe('Utility Functions', () => {
    describe('getSizeToken', () => {
      it('should return correct token for each size and aspect', () => {
        expect(getSizeToken('sm', 'text')).toBe('text-sm');
        expect(getSizeToken('md', 'padding')).toBe('p-4');
        expect(getSizeToken('lg', 'border')).toBe('border-brutal-lg');
        expect(getSizeToken('xl', 'icon')).toBe('w-8 h-8');
      });

      it('should work with all standard sizes', () => {
        SIZE_ORDER.forEach(size => {
          expect(getSizeToken(size, 'text')).toBe(SIZE_TOKENS[size].text);
          expect(getSizeToken(size, 'padding')).toBe(SIZE_TOKENS[size].padding);
        });
      });
    });

    describe('getResponsiveTextToken', () => {
      it('should return responsive text classes', () => {
        expect(getResponsiveTextToken('xs')).toBe('text-xs');
        expect(getResponsiveTextToken('sm')).toBe('text-xs md:text-sm');
        expect(getResponsiveTextToken('md')).toBe('text-sm md:text-base');
        expect(getResponsiveTextToken('lg')).toBe('text-base md:text-lg');
        expect(getResponsiveTextToken('xl')).toBe('text-lg md:text-xl');
        expect(getResponsiveTextToken('2xl')).toBe('text-xl md:text-2xl');
        expect(getResponsiveTextToken('3xl')).toBe('text-2xl md:text-3xl');
      });
    });

    describe('getResponsiveSpacingToken', () => {
      it('should return responsive spacing classes for each aspect', () => {
        expect(getResponsiveSpacingToken('md', 'padding')).toBe('p-3 md:p-4');
        expect(getResponsiveSpacingToken('lg', 'paddingX')).toBe('px-4 md:px-6');
        expect(getResponsiveSpacingToken('sm', 'gap')).toBe('gap-1 md:gap-2');
      });

      it('should work with all spacing aspects', () => {
        const aspects = ['padding', 'paddingX', 'paddingY', 'margin', 'marginX', 'marginY', 'gap'] as const;
        
        aspects.forEach(aspect => {
          expect(getResponsiveSpacingToken('md', aspect)).toBe(RESPONSIVE_SPACING_TOKENS.md[aspect]);
        });
      });
    });

    describe('getResponsiveShadowToken', () => {
      it('should return responsive shadow classes', () => {
        expect(getResponsiveShadowToken('sm')).toBe('brutal-shadow-primary-sm md:brutal-shadow-primary');
        expect(getResponsiveShadowToken('md')).toBe('brutal-shadow-primary md:brutal-shadow-dark');
        expect(getResponsiveShadowToken('lg')).toBe('brutal-shadow-dark md:brutal-shadow-double');
      });
    });

    describe('getContainerWidth', () => {
      it('should return max-width classes for container sizes', () => {
        expect(getContainerWidth('lg')).toBe('max-w-lg');
        expect(getContainerWidth('4xl')).toBe('max-w-4xl');
        expect(getContainerWidth('none')).toBe('');
      });
    });

    describe('getContainerSpacing', () => {
      it('should return padding classes for spacing sizes', () => {
        expect(getContainerSpacing('sm')).toBe('py-8');
        expect(getContainerSpacing('md')).toBe('py-10');
        expect(getContainerSpacing('lg')).toBe('py-16');
        expect(getContainerSpacing('xl')).toBe('py-20');
      });
    });

    describe('buildSizeClasses', () => {
      it('should combine multiple size aspects into class string', () => {
        const result = buildSizeClasses('md', ['padding', 'text', 'border']);
        expect(result).toBe('p-4 text-base border-brutal-md');
      });

      it('should handle single aspect', () => {
        const result = buildSizeClasses('sm', ['text']);
        expect(result).toBe('text-sm');
      });

      it('should handle empty aspects array', () => {
        const result = buildSizeClasses('lg', []);
        expect(result).toBe('');
      });

      it('should maintain order of provided aspects', () => {
        const result = buildSizeClasses('lg', ['border', 'text', 'padding']);
        expect(result).toBe('border-brutal-lg text-lg p-6');
      });
    });
  });

  describe('Size Relationships', () => {
    describe('SIZE_ORDER', () => {
      it('should contain exactly 5 sizes', () => {
        expect(SIZE_ORDER).toHaveLength(5);
      });

      it('should be in progressive order', () => {
        expect(SIZE_ORDER).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should contain all unique sizes', () => {
        const uniqueSizes = new Set(SIZE_ORDER);
        expect(uniqueSizes.size).toBe(SIZE_ORDER.length);
      });
    });

    describe('CONTAINER_WIDTH_ORDER', () => {
      it('should provide seamless container progression', () => {
        expect(CONTAINER_WIDTH_ORDER).toEqual([
          'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'
        ]);
      });

      it('should transition from NarrowContainer to WideContainer', () => {
        const narrowEnd = CONTAINER_WIDTH_ORDER.indexOf('3xl');
        const wideStart = CONTAINER_WIDTH_ORDER.indexOf('4xl');
        expect(wideStart).toBe(narrowEnd + 1);
      });
    });

    describe('DEFAULT_SIZES', () => {
      it('should provide sensible defaults for components', () => {
        expect(DEFAULT_SIZES.button).toBe('md');
        expect(DEFAULT_SIZES.badge).toBe('sm');
        expect(DEFAULT_SIZES.alert).toBe('md');
        expect(DEFAULT_SIZES.input).toBe('md');
        expect(DEFAULT_SIZES.narrowContainer).toBe('lg');
        expect(DEFAULT_SIZES.wideContainer).toBe('7xl');
        expect(DEFAULT_SIZES.sectionSpacing).toBe('md');
      });

      it('should only use valid size values', () => {
        expect(SIZE_ORDER).toContain(DEFAULT_SIZES.button);
        expect(SIZE_ORDER).toContain(DEFAULT_SIZES.badge);
        expect(SIZE_ORDER).toContain(DEFAULT_SIZES.alert);
        expect(SIZE_ORDER).toContain(DEFAULT_SIZES.input);
      });
    });
  });

  describe('Breakpoint System', () => {
    describe('BREAKPOINTS', () => {
      it('should define mobile-first breakpoint prefixes', () => {
        expect(BREAKPOINTS.mobile).toBe('');
        expect(BREAKPOINTS.tablet).toBe('md:');
        expect(BREAKPOINTS.desktop).toBe('lg:');
        expect(BREAKPOINTS.wide).toBe('xl:');
      });
    });

    describe('RESPONSIVE_PATTERNS', () => {
      it('should provide visibility patterns', () => {
        expect(RESPONSIVE_PATTERNS.mobileOnly).toBe('md:hidden');
        expect(RESPONSIVE_PATTERNS.tabletUp).toBe('hidden md:block');
        expect(RESPONSIVE_PATTERNS.desktopUp).toBe('hidden lg:block');
      });

      it('should provide layout patterns', () => {
        expect(RESPONSIVE_PATTERNS.stackToRow).toBe('flex-col md:flex-row');
        expect(RESPONSIVE_PATTERNS.rowToStack).toBe('flex-row md:flex-col');
      });

      it('should provide touch target guidance', () => {
        expect(RESPONSIVE_PATTERNS.touchTarget).toBe('min-h-[44px]');
      });

      it('should provide grid patterns', () => {
        expect(RESPONSIVE_PATTERNS.singleToDouble).toBe('grid-cols-1 md:grid-cols-2');
        expect(RESPONSIVE_PATTERNS.singleToTriple).toBe('grid-cols-1 md:grid-cols-2 lg:grid-cols-3');
        expect(RESPONSIVE_PATTERNS.singleToQuad).toBe('grid-cols-1 md:grid-cols-2 lg:grid-cols-4');
      });
    });

    describe('getResponsivePattern', () => {
      it('should return correct pattern classes', () => {
        expect(getResponsivePattern('tabletUp')).toBe('hidden md:block');
        expect(getResponsivePattern('stackToRow')).toBe('flex-col md:flex-row');
        expect(getResponsivePattern('singleToTriple')).toBe('grid-cols-1 md:grid-cols-2 lg:grid-cols-3');
      });
    });
  });

  describe('Token Consistency', () => {
    it('should have all token types for each standard size', () => {
      SIZE_ORDER.forEach(size => {
        expect(SIZE_TOKENS).toHaveProperty(size);
        expect(RESPONSIVE_TEXT_TOKENS).toHaveProperty(size);
        expect(RESPONSIVE_SPACING_TOKENS).toHaveProperty(size);
        expect(RESPONSIVE_SHADOW_TOKENS).toHaveProperty(size);
      });
    });

    it('should have consistent responsive token structure', () => {
      SIZE_ORDER.forEach(size => {
        const spacingTokens = RESPONSIVE_SPACING_TOKENS[size];
        expect(spacingTokens).toHaveProperty('padding');
        expect(spacingTokens).toHaveProperty('paddingX');
        expect(spacingTokens).toHaveProperty('paddingY');
        expect(spacingTokens).toHaveProperty('margin');
        expect(spacingTokens).toHaveProperty('marginX');
        expect(spacingTokens).toHaveProperty('marginY');
        expect(spacingTokens).toHaveProperty('gap');
      });
    });

    it('should maintain brutal design consistency', () => {
      // Brutal borders should be used for sm and above
      expect(SIZE_TOKENS.sm.border).toContain('brutal');
      expect(SIZE_TOKENS.md.border).toContain('brutal');
      expect(SIZE_TOKENS.lg.border).toContain('brutal');
      expect(SIZE_TOKENS.xl.border).toContain('brutal');

      // xs should use standard border
      expect(SIZE_TOKENS.xs.border).toBe('border-2');
    });

    it('should use primary tablet breakpoint consistently', () => {
      Object.values(RESPONSIVE_TEXT_TOKENS).forEach(token => {
        if (token.includes(':')) {
          expect(token).toMatch(/md:/);
        }
      });

      Object.values(RESPONSIVE_SPACING_TOKENS).forEach(spacingSet => {
        Object.values(spacingSet).forEach(token => {
          if (token.includes(':')) {
            expect(token).toMatch(/md:/);
          }
        });
      });
    });
  });
});