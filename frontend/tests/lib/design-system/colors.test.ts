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
    const colorTokenTests = [
      {
        name: 'TEXT_COLOR_TOKENS',
        tokens: TEXT_COLOR_TOKENS,
        expectations: {
          primary: 'text-primary',
          secondary: 'text-text-secondary',
          accent: 'text-accent',
          dark: 'text-text-primary',
          error: 'text-error',
          success: 'text-accent',
          warning: 'text-primary',
          white: 'text-white'
        }
      },
      {
        name: 'BACKGROUND_COLOR_TOKENS',
        tokens: BACKGROUND_COLOR_TOKENS,
        expectations: {
          primary: 'bg-primary',
          secondary: 'bg-secondary',
          accent: 'bg-accent',
          dark: 'bg-text-primary',
          error: 'bg-error',
          success: 'bg-accent',
          warning: 'bg-primary',
          white: 'bg-white'
        }
      },
      {
        name: 'BORDER_COLOR_TOKENS',
        tokens: BORDER_COLOR_TOKENS,
        expectations: {
          primary: 'border-primary',
          secondary: 'border-secondary',
          accent: 'border-accent',
          dark: 'border-text-primary',
          error: 'border-error',
          success: 'border-accent',
          warning: 'border-primary',
          white: 'border-white'
        }
      },
      {
        name: 'SHADOW_COLOR_TOKENS',
        tokens: SHADOW_COLOR_TOKENS,
        expectations: {
          primary: 'brutal-shadow-primary',
          secondary: 'brutal-shadow-secondary',
          accent: 'brutal-shadow-accent',
          dark: 'brutal-shadow-primary',
          error: 'brutal-shadow-dark',
          success: 'brutal-shadow-dark',
          warning: 'brutal-shadow-dark',
          white: 'brutal-shadow-dark'
        }
      }
    ];

    colorTokenTests.forEach(({ name, tokens, expectations }) => {
      describe(name, () => {
        it(`should map all standard colors to ${name.toLowerCase().replace('_tokens', '')} classes`, () => {
          Object.entries(expectations).forEach(([color, expectedClass]) => {
            expect(tokens[color as StandardColor]).toBe(expectedClass);
          });
        });
      });
    });

    // Semantic consistency tests
    const semanticTests = [
      { tokens: [TEXT_COLOR_TOKENS, BACKGROUND_COLOR_TOKENS, BORDER_COLOR_TOKENS], name: 'success and accent mapping' },
      { tokens: [TEXT_COLOR_TOKENS, BACKGROUND_COLOR_TOKENS, BORDER_COLOR_TOKENS], name: 'warning and primary mapping' }
    ];

    semanticTests.forEach(({ tokens, name }) => {
      tokens.forEach((tokenSet, index) => {
        const tokenName = ['TEXT', 'BACKGROUND', 'BORDER'][index];
        it(`should have consistent ${name} in ${tokenName}_COLOR_TOKENS`, () => {
          if (name.includes('success')) {
            expect(tokenSet.success).toBe(tokenSet.accent);
          } else {
            expect(tokenSet.warning).toBe(tokenSet.primary);
          }
        });
      });
    });

    describe('SHADOW_COLOR_TOKENS', () => {
      it('should use dark shadow for most negative/warning states', () => {
        ['error', 'success', 'warning', 'white'].forEach(color => {
          expect(SHADOW_COLOR_TOKENS[color as StandardColor]).toBe('brutal-shadow-dark');
        });
      });
    });
  });

  describe('Utility Functions', () => {
    const utilityFunctionTests = [
      {
        name: 'getTextColor',
        fn: getTextColor,
        expectations: {
          primary: 'text-primary',
          secondary: 'text-text-secondary',
          accent: 'text-accent',
          dark: 'text-text-primary',
          error: 'text-error',
          success: 'text-accent',
          warning: 'text-primary',
          white: 'text-white'
        }
      },
      {
        name: 'getBackgroundColor',
        fn: getBackgroundColor,
        expectations: {
          primary: 'bg-primary',
          secondary: 'bg-secondary',
          accent: 'bg-accent',
          dark: 'bg-text-primary',
          error: 'bg-error',
          success: 'bg-accent',
          warning: 'bg-primary',
          white: 'bg-white'
        }
      },
      {
        name: 'getBorderColor',
        fn: getBorderColor,
        expectations: {
          primary: 'border-primary',
          secondary: 'border-secondary',
          accent: 'border-accent',
          dark: 'border-text-primary',
          error: 'border-error',
          success: 'border-accent',
          warning: 'border-primary',
          white: 'border-white'
        }
      },
      {
        name: 'getShadowColor',
        fn: getShadowColor,
        expectations: {
          primary: 'brutal-shadow-primary',
          secondary: 'brutal-shadow-secondary',
          accent: 'brutal-shadow-accent',
          dark: 'brutal-shadow-primary',
          error: 'brutal-shadow-dark',
          success: 'brutal-shadow-dark',
          warning: 'brutal-shadow-dark',
          white: 'brutal-shadow-dark'
        }
      }
    ];

    utilityFunctionTests.forEach(({ name, fn, expectations }) => {
      describe(name, () => {
        it(`should return correct ${name.replace('get', '').toLowerCase()} class for each standard color`, () => {
          Object.entries(expectations).forEach(([color, expectedClass]) => {
            expect(fn(color as StandardColor)).toBe(expectedClass);
          });
        });
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
      const semanticColorTests = [
        {
          name: 'should map positive/negative semantics correctly',
          expectations: {
            positive: 'success',
            negative: 'error',
            neutral: 'secondary'
          }
        },
        {
          name: 'should map urgency levels correctly',
          expectations: {
            urgent: 'error',
            important: 'warning',
            normal: 'secondary'
          }
        },
        {
          name: 'should map action types correctly',
          expectations: {
            destructive: 'error',
            constructive: 'success',
            informational: 'primary'
          }
        }
      ];

      semanticColorTests.forEach(({ name, expectations }) => {
        it(name, () => {
          Object.entries(expectations).forEach(([semantic, expectedColor]) => {
            expect(SEMANTIC_COLORS[semantic as keyof typeof SEMANTIC_COLORS]).toBe(expectedColor);
          });
        });
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