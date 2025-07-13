import { describe, it, expect } from 'vitest';
import {
  type StandardColor,
  TEXT_COLOR_TOKENS,
  BACKGROUND_COLOR_TOKENS,
  BORDER_COLOR_TOKENS,
  SHADOW_COLOR_TOKENS,
  getTextColor,
  getBackgroundColor,
  getBorderColor,
  getShadowColor,
  COLOR_ORDER,
  DEFAULT_COLORS,
  SEMANTIC_COLORS
} from '../../../src/lib/design-system/colors';

describe('colors design system', () => {
  describe('StandardColor type', () => {
    it('should include all expected color values', () => {
      const expectedColors: StandardColor[] = [
        'primary', 'secondary', 'accent', 'dark', 'error', 'success', 'warning', 'white'
      ];
      
      // Verify COLOR_ORDER contains all expected colors
      expect(COLOR_ORDER).toEqual(expectedColors);
    });
  });

  describe('Color Token Constants', () => {
    describe('TEXT_COLOR_TOKENS', () => {
      it('should map all standard colors to text classes', () => {
        expect(TEXT_COLOR_TOKENS.primary).toBe('text-primary');
        expect(TEXT_COLOR_TOKENS.secondary).toBe('text-text-secondary');
        expect(TEXT_COLOR_TOKENS.accent).toBe('text-accent');
        expect(TEXT_COLOR_TOKENS.dark).toBe('text-text-primary');
        expect(TEXT_COLOR_TOKENS.error).toBe('text-error');
        expect(TEXT_COLOR_TOKENS.success).toBe('text-accent');
        expect(TEXT_COLOR_TOKENS.warning).toBe('text-primary');
        expect(TEXT_COLOR_TOKENS.white).toBe('text-white');
      });

      it('should have consistent success and accent mapping', () => {
        expect(TEXT_COLOR_TOKENS.success).toBe(TEXT_COLOR_TOKENS.accent);
      });

      it('should have consistent warning and primary mapping', () => {
        expect(TEXT_COLOR_TOKENS.warning).toBe(TEXT_COLOR_TOKENS.primary);
      });
    });

    describe('BACKGROUND_COLOR_TOKENS', () => {
      it('should map all standard colors to background classes', () => {
        expect(BACKGROUND_COLOR_TOKENS.primary).toBe('bg-primary');
        expect(BACKGROUND_COLOR_TOKENS.secondary).toBe('bg-secondary');
        expect(BACKGROUND_COLOR_TOKENS.accent).toBe('bg-accent');
        expect(BACKGROUND_COLOR_TOKENS.dark).toBe('bg-text-primary');
        expect(BACKGROUND_COLOR_TOKENS.error).toBe('bg-error');
        expect(BACKGROUND_COLOR_TOKENS.success).toBe('bg-accent');
        expect(BACKGROUND_COLOR_TOKENS.warning).toBe('bg-primary');
        expect(BACKGROUND_COLOR_TOKENS.white).toBe('bg-white');
      });

      it('should have consistent success and accent mapping', () => {
        expect(BACKGROUND_COLOR_TOKENS.success).toBe(BACKGROUND_COLOR_TOKENS.accent);
      });

      it('should have consistent warning and primary mapping', () => {
        expect(BACKGROUND_COLOR_TOKENS.warning).toBe(BACKGROUND_COLOR_TOKENS.primary);
      });
    });

    describe('BORDER_COLOR_TOKENS', () => {
      it('should map all standard colors to border classes', () => {
        expect(BORDER_COLOR_TOKENS.primary).toBe('border-primary');
        expect(BORDER_COLOR_TOKENS.secondary).toBe('border-secondary');
        expect(BORDER_COLOR_TOKENS.accent).toBe('border-accent');
        expect(BORDER_COLOR_TOKENS.dark).toBe('border-text-primary');
        expect(BORDER_COLOR_TOKENS.error).toBe('border-error');
        expect(BORDER_COLOR_TOKENS.success).toBe('border-accent');
        expect(BORDER_COLOR_TOKENS.warning).toBe('border-primary');
        expect(BORDER_COLOR_TOKENS.white).toBe('border-white');
      });
    });

    describe('SHADOW_COLOR_TOKENS', () => {
      it('should map all standard colors to shadow classes', () => {
        expect(SHADOW_COLOR_TOKENS.primary).toBe('brutal-shadow-primary');
        expect(SHADOW_COLOR_TOKENS.secondary).toBe('brutal-shadow-secondary');
        expect(SHADOW_COLOR_TOKENS.accent).toBe('brutal-shadow-accent');
        expect(SHADOW_COLOR_TOKENS.dark).toBe('brutal-shadow-primary');
        expect(SHADOW_COLOR_TOKENS.error).toBe('brutal-shadow-dark');
        expect(SHADOW_COLOR_TOKENS.success).toBe('brutal-shadow-dark');
        expect(SHADOW_COLOR_TOKENS.warning).toBe('brutal-shadow-dark');
        expect(SHADOW_COLOR_TOKENS.white).toBe('brutal-shadow-dark');
      });

      it('should use dark shadow for most negative/warning states', () => {
        expect(SHADOW_COLOR_TOKENS.error).toBe('brutal-shadow-dark');
        expect(SHADOW_COLOR_TOKENS.success).toBe('brutal-shadow-dark');
        expect(SHADOW_COLOR_TOKENS.warning).toBe('brutal-shadow-dark');
        expect(SHADOW_COLOR_TOKENS.white).toBe('brutal-shadow-dark');
      });
    });
  });

  describe('Utility Functions', () => {
    describe('getTextColor', () => {
      it('should return correct text color class for each standard color', () => {
        expect(getTextColor('primary')).toBe('text-primary');
        expect(getTextColor('secondary')).toBe('text-text-secondary');
        expect(getTextColor('accent')).toBe('text-accent');
        expect(getTextColor('dark')).toBe('text-text-primary');
        expect(getTextColor('error')).toBe('text-error');
        expect(getTextColor('success')).toBe('text-accent');
        expect(getTextColor('warning')).toBe('text-primary');
        expect(getTextColor('white')).toBe('text-white');
      });
    });

    describe('getBackgroundColor', () => {
      it('should return correct background color class for each standard color', () => {
        expect(getBackgroundColor('primary')).toBe('bg-primary');
        expect(getBackgroundColor('secondary')).toBe('bg-secondary');
        expect(getBackgroundColor('accent')).toBe('bg-accent');
        expect(getBackgroundColor('dark')).toBe('bg-text-primary');
        expect(getBackgroundColor('error')).toBe('bg-error');
        expect(getBackgroundColor('success')).toBe('bg-accent');
        expect(getBackgroundColor('warning')).toBe('bg-primary');
        expect(getBackgroundColor('white')).toBe('bg-white');
      });
    });

    describe('getBorderColor', () => {
      it('should return correct border color class for each standard color', () => {
        expect(getBorderColor('primary')).toBe('border-primary');
        expect(getBorderColor('secondary')).toBe('border-secondary');
        expect(getBorderColor('accent')).toBe('border-accent');
        expect(getBorderColor('dark')).toBe('border-text-primary');
        expect(getBorderColor('error')).toBe('border-error');
        expect(getBorderColor('success')).toBe('border-accent');
        expect(getBorderColor('warning')).toBe('border-primary');
        expect(getBorderColor('white')).toBe('border-white');
      });
    });

    describe('getShadowColor', () => {
      it('should return correct shadow color class for each standard color', () => {
        expect(getShadowColor('primary')).toBe('brutal-shadow-primary');
        expect(getShadowColor('secondary')).toBe('brutal-shadow-secondary');
        expect(getShadowColor('accent')).toBe('brutal-shadow-accent');
        expect(getShadowColor('dark')).toBe('brutal-shadow-primary');
        expect(getShadowColor('error')).toBe('brutal-shadow-dark');
        expect(getShadowColor('success')).toBe('brutal-shadow-dark');
        expect(getShadowColor('warning')).toBe('brutal-shadow-dark');
        expect(getShadowColor('white')).toBe('brutal-shadow-dark');
      });
    });
  });


  describe('Color Relationships', () => {
    describe('COLOR_ORDER', () => {
      it('should contain exactly 8 colors', () => {
        expect(COLOR_ORDER).toHaveLength(8);
      });

      it('should contain all unique colors', () => {
        const uniqueColors = new Set(COLOR_ORDER);
        expect(uniqueColors.size).toBe(COLOR_ORDER.length);
      });

      it('should be in expected order', () => {
        expect(COLOR_ORDER).toEqual([
          'primary', 'secondary', 'accent', 'dark', 'error', 'success', 'warning', 'white'
        ]);
      });
    });

    describe('DEFAULT_COLORS', () => {
      it('should provide sensible defaults for components', () => {
        expect(DEFAULT_COLORS.badge).toBe('primary');
        expect(DEFAULT_COLORS.text).toBe('dark');
        expect(DEFAULT_COLORS.stats).toBe('primary');
        expect(DEFAULT_COLORS.button).toBe('primary');
        expect(DEFAULT_COLORS.alert).toBe('primary');
      });

      it('should only use valid StandardColor values', () => {
        Object.values(DEFAULT_COLORS).forEach(color => {
          expect(COLOR_ORDER).toContain(color);
        });
      });
    });

    describe('SEMANTIC_COLORS', () => {
      it('should map positive/negative semantics correctly', () => {
        expect(SEMANTIC_COLORS.positive).toBe('success');
        expect(SEMANTIC_COLORS.negative).toBe('error');
        expect(SEMANTIC_COLORS.neutral).toBe('secondary');
      });

      it('should map urgency levels correctly', () => {
        expect(SEMANTIC_COLORS.urgent).toBe('error');
        expect(SEMANTIC_COLORS.important).toBe('warning');
        expect(SEMANTIC_COLORS.normal).toBe('secondary');
      });

      it('should map action types correctly', () => {
        expect(SEMANTIC_COLORS.destructive).toBe('error');
        expect(SEMANTIC_COLORS.constructive).toBe('success');
        expect(SEMANTIC_COLORS.informational).toBe('primary');
      });

      it('should only use valid StandardColor values', () => {
        Object.values(SEMANTIC_COLORS).forEach(color => {
          expect(COLOR_ORDER).toContain(color);
        });
      });
    });
  });

  describe('Token Consistency', () => {
    it('should have all color tokens for each standard color', () => {
      COLOR_ORDER.forEach(color => {
        expect(TEXT_COLOR_TOKENS).toHaveProperty(color);
        expect(BACKGROUND_COLOR_TOKENS).toHaveProperty(color);
        expect(BORDER_COLOR_TOKENS).toHaveProperty(color);
        expect(SHADOW_COLOR_TOKENS).toHaveProperty(color);
      });
    });

    it('should have consistent token naming patterns', () => {
      COLOR_ORDER.forEach(color => {
        const textToken = TEXT_COLOR_TOKENS[color];
        const bgToken = BACKGROUND_COLOR_TOKENS[color];
        const borderToken = BORDER_COLOR_TOKENS[color];
        const shadowToken = SHADOW_COLOR_TOKENS[color];

        expect(textToken).toMatch(/^text-/);
        expect(bgToken).toMatch(/^bg-/);
        expect(borderToken).toMatch(/^border-/);
        expect(shadowToken).toMatch(/^brutal-shadow-/);
      });
    });

    it('should maintain semantic color mappings across all token types', () => {
      // Success should map to accent in all contexts except shadows
      expect(TEXT_COLOR_TOKENS.success).toBe(TEXT_COLOR_TOKENS.accent);
      expect(BACKGROUND_COLOR_TOKENS.success).toBe(BACKGROUND_COLOR_TOKENS.accent);
      expect(BORDER_COLOR_TOKENS.success).toBe(BORDER_COLOR_TOKENS.accent);

      // Warning should map to primary in all contexts except shadows
      expect(TEXT_COLOR_TOKENS.warning).toBe(TEXT_COLOR_TOKENS.primary);
      expect(BACKGROUND_COLOR_TOKENS.warning).toBe(BACKGROUND_COLOR_TOKENS.primary);
      expect(BORDER_COLOR_TOKENS.warning).toBe(BORDER_COLOR_TOKENS.primary);
    });
  });
});