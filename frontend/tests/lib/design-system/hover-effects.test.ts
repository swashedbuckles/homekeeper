import { describe, it, expect } from 'vitest';
import {
  type HoverEffect,
  HOVER_EFFECT_CLASSES,
  getHoverEffectClass,
  requiresTransition,
  getHoverEffectClasses,
  COMPONENT_HOVER_RECOMMENDATIONS,
  getRecommendedHoverEffect,
  HOVER_EFFECT_DESCRIPTIONS,
  getHoverEffectDescription,
  DEFAULT_HOVER_EFFECTS
} from '../../../src/lib/design-system/hover-effects';

describe('hover-effects design system', () => {
  describe('HoverEffect type', () => {
    it('should include all expected hover effect values', () => {
      const expectedEffects: HoverEffect[] = ['lift', 'press', 'press-small', 'none'];
      
      // Verify all effects are represented in HOVER_EFFECT_CLASSES
      expectedEffects.forEach(effect => {
        expect(HOVER_EFFECT_CLASSES).toHaveProperty(effect);
      });
    });
  });

  describe('HOVER_EFFECT_CLASSES', () => {
    it('should map all hover effects to CSS classes', () => {
      expect(HOVER_EFFECT_CLASSES.lift).toBe('brutal-hover-lift');
      expect(HOVER_EFFECT_CLASSES.press).toBe('brutal-hover-press');
      expect(HOVER_EFFECT_CLASSES['press-small']).toBe('brutal-hover-press-small');
      expect(HOVER_EFFECT_CLASSES.none).toBe('');
    });

    it('should use brutal- prefix for all non-none effects', () => {
      const effectsWithClasses = Object.entries(HOVER_EFFECT_CLASSES)
        .filter(([effect, className]) => effect !== 'none' && className !== '');
      
      effectsWithClasses.forEach(([_effect, className]) => {
        expect(className).toMatch(/^brutal-hover-/);
      });
    });

    it('should have empty string for none effect', () => {
      expect(HOVER_EFFECT_CLASSES.none).toBe('');
    });
  });

  describe('Utility Functions', () => {
    describe('getHoverEffectClass', () => {
      it('should return correct CSS class for each hover effect', () => {
        expect(getHoverEffectClass('lift')).toBe('brutal-hover-lift');
        expect(getHoverEffectClass('press')).toBe('brutal-hover-press');
        expect(getHoverEffectClass('press-small')).toBe('brutal-hover-press-small');
        expect(getHoverEffectClass('none')).toBe('');
      });
    });

    describe('requiresTransition', () => {
      it('should return true for all effects except none', () => {
        expect(requiresTransition('lift')).toBe(true);
        expect(requiresTransition('press')).toBe(true);
        expect(requiresTransition('press-small')).toBe(true);
        expect(requiresTransition('none')).toBe(false);
      });
    });

    describe('getHoverEffectClasses', () => {
      it('should return empty array for none effect', () => {
        expect(getHoverEffectClasses('none')).toEqual([]);
      });

      it('should include transition by default for non-none effects', () => {
        expect(getHoverEffectClasses('lift')).toEqual(['brutal-transition', 'brutal-hover-lift']);
        expect(getHoverEffectClasses('press')).toEqual(['brutal-transition', 'brutal-hover-press']);
        expect(getHoverEffectClasses('press-small')).toEqual(['brutal-transition', 'brutal-hover-press-small']);
      });

      it('should exclude transition when includeTransition is false', () => {
        expect(getHoverEffectClasses('lift', false)).toEqual(['brutal-hover-lift']);
        expect(getHoverEffectClasses('press', false)).toEqual(['brutal-hover-press']);
        expect(getHoverEffectClasses('press-small', false)).toEqual(['brutal-hover-press-small']);
      });

      it('should handle includeTransition parameter correctly', () => {
        expect(getHoverEffectClasses('lift', true)).toEqual(['brutal-transition', 'brutal-hover-lift']);
        expect(getHoverEffectClasses('lift', false)).toEqual(['brutal-hover-lift']);
      });

      it('should always return empty array for none regardless of includeTransition', () => {
        expect(getHoverEffectClasses('none', true)).toEqual([]);
        expect(getHoverEffectClasses('none', false)).toEqual([]);
      });
    });
  });

  describe('Component Hover Recommendations', () => {
    describe('COMPONENT_HOVER_RECOMMENDATIONS', () => {
      it('should provide recommendations for interactive buttons', () => {
        expect(COMPONENT_HOVER_RECOMMENDATIONS.button).toBe('press');
        expect(COMPONENT_HOVER_RECOMMENDATIONS.backButton).toBe('press');
      });

      it('should provide recommendations for cards and containers', () => {
        expect(COMPONENT_HOVER_RECOMMENDATIONS.card).toBe('lift');
        expect(COMPONENT_HOVER_RECOMMENDATIONS.statCard).toBe('lift');
        expect(COMPONENT_HOVER_RECOMMENDATIONS.taskCard).toBe('lift');
        expect(COMPONENT_HOVER_RECOMMENDATIONS.listItem).toBe('lift');
      });

      it('should provide recommendations for special card types', () => {
        expect(COMPONENT_HOVER_RECOMMENDATIONS.optionCard).toBe('press');
      });

      it('should provide recommendations for small interactive elements', () => {
        expect(COMPONENT_HOVER_RECOMMENDATIONS.badge).toBe('press-small');
        expect(COMPONENT_HOVER_RECOMMENDATIONS.checkbox).toBe('press-small');
      });

      it('should provide none for non-interactive elements', () => {
        expect(COMPONENT_HOVER_RECOMMENDATIONS.alert).toBe('none');
        expect(COMPONENT_HOVER_RECOMMENDATIONS.textInput).toBe('none');
        expect(COMPONENT_HOVER_RECOMMENDATIONS.textArea).toBe('none');
      });

      it('should only use valid HoverEffect values', () => {
        const validEffects: HoverEffect[] = ['lift', 'press', 'press-small', 'none'];
        
        Object.values(COMPONENT_HOVER_RECOMMENDATIONS).forEach(effect => {
          expect(validEffects).toContain(effect);
        });
      });
    });

    describe('getRecommendedHoverEffect', () => {
      it('should return correct recommendations for different component types', () => {
        expect(getRecommendedHoverEffect('button')).toBe('press');
        expect(getRecommendedHoverEffect('card')).toBe('lift');
        expect(getRecommendedHoverEffect('badge')).toBe('press-small');
        expect(getRecommendedHoverEffect('alert')).toBe('none');
      });

      it('should return consistent values with COMPONENT_HOVER_RECOMMENDATIONS', () => {
        Object.keys(COMPONENT_HOVER_RECOMMENDATIONS).forEach(componentType => {
          const key = componentType as keyof typeof COMPONENT_HOVER_RECOMMENDATIONS;
          expect(getRecommendedHoverEffect(key)).toBe(COMPONENT_HOVER_RECOMMENDATIONS[key]);
        });
      });
    });
  });

  describe('Hover Effect Descriptions', () => {
    describe('HOVER_EFFECT_DESCRIPTIONS', () => {
      it('should provide descriptions for all hover effects', () => {
        expect(HOVER_EFFECT_DESCRIPTIONS.lift).toContain('Lifts element up');
        expect(HOVER_EFFECT_DESCRIPTIONS.press).toContain('Presses element down');
        expect(HOVER_EFFECT_DESCRIPTIONS['press-small']).toContain('Small press effect');
        expect(HOVER_EFFECT_DESCRIPTIONS.none).toContain('No hover effect');
      });

      it('should provide usage guidance in descriptions', () => {
        expect(HOVER_EFFECT_DESCRIPTIONS.lift).toContain('cards');
        expect(HOVER_EFFECT_DESCRIPTIONS.press).toContain('buttons');
        expect(HOVER_EFFECT_DESCRIPTIONS['press-small']).toContain('small interactive');
        expect(HOVER_EFFECT_DESCRIPTIONS.none).toContain('non-interactive');
      });

      it('should have descriptions for all hover effect types', () => {
        const allEffects: HoverEffect[] = ['lift', 'press', 'press-small', 'none'];
        
        allEffects.forEach(effect => {
          expect(HOVER_EFFECT_DESCRIPTIONS).toHaveProperty(effect);
          expect(typeof HOVER_EFFECT_DESCRIPTIONS[effect]).toBe('string');
          expect(HOVER_EFFECT_DESCRIPTIONS[effect].length).toBeGreaterThan(0);
        });
      });
    });

    describe('getHoverEffectDescription', () => {
      it('should return correct descriptions for each hover effect', () => {
        expect(getHoverEffectDescription('lift')).toBe(HOVER_EFFECT_DESCRIPTIONS.lift);
        expect(getHoverEffectDescription('press')).toBe(HOVER_EFFECT_DESCRIPTIONS.press);
        expect(getHoverEffectDescription('press-small')).toBe(HOVER_EFFECT_DESCRIPTIONS['press-small']);
        expect(getHoverEffectDescription('none')).toBe(HOVER_EFFECT_DESCRIPTIONS.none);
      });
    });
  });

  describe('Default Hover Effects', () => {
    describe('DEFAULT_HOVER_EFFECTS', () => {
      it('should provide semantic defaults for different interaction contexts', () => {
        expect(DEFAULT_HOVER_EFFECTS.interactive).toBe('press');
        expect(DEFAULT_HOVER_EFFECTS.content).toBe('lift');
        expect(DEFAULT_HOVER_EFFECTS.subtle).toBe('press-small');
        expect(DEFAULT_HOVER_EFFECTS.static).toBe('none');
      });

      it('should only use valid HoverEffect values', () => {
        const validEffects: HoverEffect[] = ['lift', 'press', 'press-small', 'none'];
        
        Object.values(DEFAULT_HOVER_EFFECTS).forEach(effect => {
          expect(validEffects).toContain(effect);
        });
      });

      it('should provide logical semantic mappings', () => {
        // Interactive elements should have clear feedback
        expect(DEFAULT_HOVER_EFFECTS.interactive).not.toBe('none');
        
        // Static elements should have no hover effect
        expect(DEFAULT_HOVER_EFFECTS.static).toBe('none');
        
        // Content should lift to show it's interactive but not actionable
        expect(DEFAULT_HOVER_EFFECTS.content).toBe('lift');
        
        // Subtle should be a gentle effect
        expect(DEFAULT_HOVER_EFFECTS.subtle).toBe('press-small');
      });
    });
  });

  describe('System Consistency', () => {
    it('should have all hover effects defined in all relevant constants', () => {
      const allEffects: HoverEffect[] = ['lift', 'press', 'press-small', 'none'];
      
      allEffects.forEach(effect => {
        expect(HOVER_EFFECT_CLASSES).toHaveProperty(effect);
        expect(HOVER_EFFECT_DESCRIPTIONS).toHaveProperty(effect);
      });
    });

    it('should maintain consistent naming patterns', () => {
      Object.entries(HOVER_EFFECT_CLASSES).forEach(([effect, className]) => {
        if (effect !== 'none') {
          expect(className).toMatch(/^brutal-hover-/);
        }
      });
    });

    it('should have logical component groupings in recommendations', () => {
      // All button-like components should use press
      const buttonComponents = ['button', 'backButton'];
      buttonComponents.forEach(component => {
        expect(COMPONENT_HOVER_RECOMMENDATIONS[component as keyof typeof COMPONENT_HOVER_RECOMMENDATIONS]).toBe('press');
      });

      // All card-like components should use lift
      const cardComponents = ['card', 'statCard', 'taskCard', 'listItem'];
      cardComponents.forEach(component => {
        expect(COMPONENT_HOVER_RECOMMENDATIONS[component as keyof typeof COMPONENT_HOVER_RECOMMENDATIONS]).toBe('lift');
      });

      // All form input components should use none
      const formComponents = ['textInput', 'textArea'];
      formComponents.forEach(component => {
        expect(COMPONENT_HOVER_RECOMMENDATIONS[component as keyof typeof COMPONENT_HOVER_RECOMMENDATIONS]).toBe('none');
      });
    });

    it('should provide complete coverage for hover effect workflow', () => {
      // Test the complete workflow: effect -> class -> transition
      const testEffect: HoverEffect = 'lift';
      
      // Get the class
      const className = getHoverEffectClass(testEffect);
      expect(className).toBe('brutal-hover-lift');
      
      // Check if transition is required
      const needsTransition = requiresTransition(testEffect);
      expect(needsTransition).toBe(true);
      
      // Get complete classes
      const completeClasses = getHoverEffectClasses(testEffect);
      expect(completeClasses).toEqual(['brutal-transition', 'brutal-hover-lift']);
      
      // Get description
      const description = getHoverEffectDescription(testEffect);
      expect(typeof description).toBe('string');
      expect(description.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle press-small effect consistently', () => {
      expect(getHoverEffectClass('press-small')).toBe('brutal-hover-press-small');
      expect(requiresTransition('press-small')).toBe(true);
      expect(getHoverEffectClasses('press-small')).toEqual(['brutal-transition', 'brutal-hover-press-small']);
      expect(getHoverEffectDescription('press-small')).toBe(HOVER_EFFECT_DESCRIPTIONS['press-small']);
    });

    it('should handle none effect edge cases', () => {
      expect(getHoverEffectClass('none')).toBe('');
      expect(requiresTransition('none')).toBe(false);
      expect(getHoverEffectClasses('none', true)).toEqual([]);
      expect(getHoverEffectClasses('none', false)).toEqual([]);
    });

    it('should maintain type safety across all functions', () => {
      const allEffects: HoverEffect[] = ['lift', 'press', 'press-small', 'none'];
      
      allEffects.forEach(effect => {
        // All functions should accept all valid effects without TypeScript errors
        expect(() => getHoverEffectClass(effect)).not.toThrow();
        expect(() => requiresTransition(effect)).not.toThrow();
        expect(() => getHoverEffectClasses(effect)).not.toThrow();
        expect(() => getHoverEffectDescription(effect)).not.toThrow();
      });
    });
  });
});