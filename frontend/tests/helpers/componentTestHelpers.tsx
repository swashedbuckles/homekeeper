import { render, screen, type RenderResult } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { ReactElement, ReactNode } from 'react';
import { expectElementToHaveClasses } from './testHelpers';

/**
 * @fileoverview Reusable component test pattern factories to eliminate repetitive test code.
 * These utilities generate complete test suites for common component testing patterns,
 * enabling consistent and thorough testing across all UI components.
 * 
 * @example
 * ```typescript
 * import { createVariantTests, createSizeTests } from '@/tests/helpers/componentTestHelpers';
 * 
 * // Generate variant tests for a Button component
 * createVariantTests('Button', Button, [
 *   { name: 'primary', props: { variant: 'primary' }, expectedClasses: ['bg-primary'] },
 *   { name: 'secondary', props: { variant: 'secondary' }, expectedClasses: ['bg-secondary'] }
 * ]);
 * ```
 */

/**
 * Standard render utility with common providers
 * @param component - React element to render
 * @returns Render result from React Testing Library
 * @example
 * ```typescript
 * const result = renderComponent(<Button>Click me</Button>);
 * ```
 */
export const renderComponent = (component: ReactElement): RenderResult => {
  return render(component);
};

/**
 * Factory function that generates variant testing suites for components
 * Creates comprehensive tests for all visual variants (primary, secondary, etc.)
 * @param componentName - Name of the component for test descriptions
 * @param Component - React component to test
 * @param variants - Array of variant configurations to test
 * @param baseProps - Base props applied to all variant tests
 * @example
 * ```typescript
 * createVariantTests('Button', Button, [
 *   { name: 'primary', props: { variant: 'primary' }, expectedClasses: ['bg-primary', 'text-white'] },
 *   { name: 'secondary', props: { variant: 'secondary' }, expectedClasses: ['bg-secondary', 'text-dark'] },
 *   { name: 'danger', props: { variant: 'danger' }, expectedClasses: ['bg-error', 'text-white'] }
 * ], { children: 'Test Button' });
 * ```
 */
export const createVariantTests = <T extends Record<string, any>>(
  componentName: string,
  Component: React.ComponentType<T>,
  variants: Array<{
    name: string;
    props: Partial<T>;
    expectedClasses: string[];
    testId?: string;
  }>,
  baseProps: Partial<T> = {}
) => {
  describe(`${componentName} variants`, () => {
    variants.forEach(({ name, props, expectedClasses, testId }) => {
      it(`renders ${name} variant correctly`, () => {
        const testProps = { ...baseProps, ...props, testId: testId || 'test-component' } as unknown as T;
        render(<Component {...testProps} />);
        
        const element = testId ? screen.getByTestId(testId) : screen.getByTestId('test-component');
        expectElementToHaveClasses(element, expectedClasses);
      });
    });
  });
};

/**
 * Factory function that generates size testing suites for components
 * Creates comprehensive tests for all size variants (small, medium, large, etc.)
 * Validates that components apply correct size-related CSS classes for different screen sizes and layouts
 * @param componentName - Name of the component for test descriptions
 * @param Component - React component to test
 * @param sizes - Array of size configurations to test
 * @param baseProps - Base props applied to all size tests
 * @example
 * ```typescript
 * createSizeTests('Button', Button, [
 *   { size: 'small', props: { size: 'sm' }, expectedClasses: ['px-2', 'py-1', 'text-sm'] },
 *   { size: 'medium', props: { size: 'md' }, expectedClasses: ['px-4', 'py-2', 'text-base'] },
 *   { size: 'large', props: { size: 'lg' }, expectedClasses: ['px-6', 'py-3', 'text-lg'] }
 * ], { children: 'Test Button' });
 * ```
 */
export const createSizeTests = <T extends Record<string, any>>(
  componentName: string,
  Component: React.ComponentType<T>,
  sizes: Array<{
    size: string;
    props: Partial<T>;
    expectedClasses: string[];
    testId?: string;
  }>,
  baseProps: Partial<T> = {}
) => {
  describe(`${componentName} sizes`, () => {
    sizes.forEach(({ size, props, expectedClasses, testId }) => {
      it(`renders ${size} size correctly`, () => {
        const testProps = { ...baseProps, ...props, testId: testId || 'test-component' } as unknown as T;
        render(<Component {...testProps} />);
        
        const element = testId ? screen.getByTestId(testId) : screen.getByTestId('test-component');
        expectElementToHaveClasses(element, expectedClasses);
      });
    });
  });
};

/**
 * Factory function that generates shadow testing suites for components
 * Creates tests to verify brutal design shadow effects are applied correctly
 * Particularly useful for Button-like components that use HomeKeeper's brutal shadow system
 * @param componentName - Name of the component for test descriptions
 * @param Component - React component to test
 * @param testScenarios - Array of shadow test scenarios with expected behavior
 * @param baseProps - Base props applied to all shadow tests
 * @example
 * ```typescript
 * createShadowTests('Button', Button, [
 *   { description: 'applies shadow when enabled', props: { shadow: true }, expectShadow: true, expectedShadowClass: 'brutal-shadow-dark' },
 *   { description: 'no shadow when disabled', props: { shadow: false }, expectShadow: false },
 *   { description: 'small shadow variant', props: { shadow: 'sm' }, expectShadow: true, expectedShadowClass: 'brutal-shadow-dark-sm' }
 * ], { children: 'Test Button' });
 * ```
 */
export const createShadowTests = <T extends Record<string, any>>(
  componentName: string,
  Component: React.ComponentType<T>,
  testScenarios: Array<{
    description: string;
    props: Partial<T>;
    expectShadow: boolean;
    expectedShadowClass?: string;
    testId?: string;
  }>,
  baseProps: Partial<T> = {}
) => {
  describe(`${componentName} shadow functionality`, () => {
    testScenarios.forEach(({ description, props, expectShadow, expectedShadowClass, testId }) => {
      it(description, () => {
        const testProps = { ...baseProps, ...props, testId: testId || 'test-component' } as unknown as T;
        render(<Component {...testProps} />);
        
        const element = testId ? screen.getByTestId(testId) : screen.getByTestId('test-component');
        
        if (expectShadow) {
          const shadowClass = expectedShadowClass || 'brutal-shadow-dark';
          expect(element).toHaveClass(shadowClass);
        } else {
          expect(element).not.toHaveClass('brutal-shadow-dark', 'brutal-shadow-dark-sm');
        }
      });
    });
  });
};

/**
 * Factory function that generates basic rendering test suites for components
 * Creates fundamental tests to verify components render correctly with different props
 * Validates text content, accessibility roles, and test identifiers are present
 * @param componentName - Name of the component for test descriptions
 * @param Component - React component to test
 * @param scenarios - Array of rendering scenarios to test
 * @example
 * ```typescript
 * createBasicRenderingTests('TextInput', TextInput, [
 *   { 
 *     description: 'renders with label', 
 *     props: { label: 'Email Address', testId: 'email-input' },
 *     expectedText: 'Email Address',
 *     expectedRole: 'textbox',
 *     expectedTestId: 'email-input'
 *   },
 *   {
 *     description: 'renders with placeholder',
 *     props: { placeholder: 'Enter your email', testId: 'email-input' },
 *     expectedRole: 'textbox',
 *     expectedTestId: 'email-input'
 *   }
 * ]);
 * ```
 */
export const createBasicRenderingTests = <T extends Record<string, any>>(
  componentName: string,
  Component: React.ComponentType<T>,
  scenarios: Array<{
    description: string;
    props: T;
    expectedText?: string;
    expectedRole?: string;
    expectedTestId?: string;
  }>
) => {
  describe(`${componentName} basic rendering`, () => {
    scenarios.forEach(({ description, props, expectedText, expectedRole, expectedTestId }) => {
      it(description, () => {
        render(<Component {...props} />);
        
        if (expectedText) {
          expect(screen.getByText(expectedText)).toBeInTheDocument();
        }
        
        if (expectedRole) {
          expect(screen.getByRole(expectedRole)).toBeInTheDocument();
        }
        
        if (expectedTestId) {
          expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
        }
      });
    });
  });
};

/**
 * Factory function that generates error state testing suites for components
 * Creates tests to verify components handle error states correctly with appropriate styling
 * Validates error styling is applied when errors are present and removed when cleared
 * @param componentName - Name of the component for test descriptions
 * @param Component - React component to test
 * @param baseProps - Base props for normal state testing
 * @param errorProps - Props that trigger error state
 * @param testId - Test identifier for the component element
 * @example
 * ```typescript
 * createErrorStateTests(
 *   'TextInput', 
 *   TextInput,
 *   { label: 'Email', placeholder: 'Enter email' },
 *   { error: 'Invalid email format' },
 *   'email-input'
 * );
 * ```
 */
export const createErrorStateTests = <T extends Record<string, any>>(
  componentName: string,
  Component: React.ComponentType<T>,
  baseProps: Partial<T>,
  errorProps: Partial<T>,
  testId: string = 'test-component'
) => {
  describe(`${componentName} error states`, () => {
    it('shows error styling when error is present', () => {
      const props = { ...baseProps, ...errorProps, testId } as unknown as T;
      render(<Component {...props} />);
      
      const element = screen.getByTestId(testId);
      expect(element).toHaveClass('border-error');
    });

    it('shows normal styling when no error', () => {
      const props = { ...baseProps, testId } as unknown as T;
      render(<Component {...props} />);
      
      const element = screen.getByTestId(testId);
      expect(element).toHaveClass('border-text-primary');
      expect(element).not.toHaveClass('border-error');
    });
  });
};

/**
 * Factory function that generates interaction testing suites for components
 * Creates tests for user interactions like clicks, focus, keyboard navigation, etc.
 * Validates that components respond correctly to user input and trigger appropriate callbacks
 * @param componentName - Name of the component for test descriptions
 * @param Component - React component to test
 * @param scenarios - Array of interaction scenarios with actions and expected outcomes
 * @example
 * ```typescript
 * const mockOnClick = vi.fn();
 * const mockOnFocus = vi.fn();
 * 
 * createInteractionTests('Button', Button, [
 *   {
 *     description: 'calls onClick when clicked',
 *     props: { children: 'Click me', onClick: mockOnClick, testId: 'test-button' },
 *     action: async () => {
 *       await userEvent.click(screen.getByTestId('test-button'));
 *     },
 *     expectation: () => {
 *       expect(mockOnClick).toHaveBeenCalledTimes(1);
 *     }
 *   },
 *   {
 *     description: 'triggers focus event',
 *     props: { children: 'Focus me', onFocus: mockOnFocus, testId: 'test-button' },
 *     action: async () => {
 *       await userEvent.tab();
 *     },
 *     expectation: () => {
 *       expect(mockOnFocus).toHaveBeenCalled();
 *     }
 *   }
 * ]);
 * ```
 */
export const createInteractionTests = <T extends Record<string, any>>(
  componentName: string,
  Component: React.ComponentType<T>,
  scenarios: Array<{
    description: string;
    props: T;
    action: () => Promise<void> | void;
    expectation: () => void;
  }>
) => {
  describe(`${componentName} interactions`, () => {
    scenarios.forEach(({ description, props, action, expectation }) => {
      it(description, async () => {
        render(<Component {...props} />);
        await action();
        expectation();
      });
    });
  });
};

/**
 * Common CSS classes that HomeKeeper components share for consistent brutal design
 * Provides standardized class combinations for typography, borders, transitions, and shadows
 * Used across test suites to validate consistent styling implementation
 * @example
 * ```typescript
 * // Testing that a component has brutal typography
 * expectElementToHaveClasses(element, COMMON_BASE_CLASSES.brutal);
 * 
 * // Testing shadow application
 * expect(element).toHaveClass(COMMON_BASE_CLASSES.brutalShadow.md);
 * 
 * // Testing border styling
 * expectElementToHaveClasses(element, COMMON_BASE_CLASSES.brutalBorder);
 * ```
 */
export const COMMON_BASE_CLASSES = {
  brutal: ['font-mono', 'font-black', 'uppercase', 'tracking-wide'],
  brutalBorder: ['border-text-primary'],
  brutalTransition: ['brutal-transition'],
  brutalShadow: {
    sm: 'brutal-shadow-dark-sm',
    md: 'brutal-shadow-dark',
    lg: 'brutal-shadow-dark'
  }
} as const;

/**
 * Standard test prop generators for common component scenarios
 * Provides consistent prop objects for frequently tested component states and behaviors
 * Reduces boilerplate and ensures consistent testing patterns across the application
 * @example
 * ```typescript
 * // Generate props with test ID
 * const propsWithId = STANDARD_TEST_PROPS.withTestId('my-button');
 * render(<Button {...propsWithId} />);
 * 
 * // Generate props with children content
 * const propsWithContent = STANDARD_TEST_PROPS.withChildren('Save Changes');
 * render(<Button {...propsWithContent} />);
 * 
 * // Combine multiple prop generators
 * const mockClick = vi.fn();
 * const combinedProps = {
 *   ...STANDARD_TEST_PROPS.withTestId('submit-btn'),
 *   ...STANDARD_TEST_PROPS.withChildren('Submit'),
 *   ...STANDARD_TEST_PROPS.withClick(mockClick)
 * };
 * render(<Button {...combinedProps} />);
 * 
 * // Test error state
 * const errorProps = {
 *   ...STANDARD_TEST_PROPS.withTestId('error-input'),
 *   ...STANDARD_TEST_PROPS.withError('Please enter a valid email')
 * };
 * render(<TextInput {...errorProps} />);
 * 
 * // Test disabled state
 * const disabledProps = {
 *   ...STANDARD_TEST_PROPS.withTestId('disabled-btn'),
 *   ...STANDARD_TEST_PROPS.withDisabled()
 * };
 * render(<Button {...disabledProps} />);
 * ```
 */
export const STANDARD_TEST_PROPS = {
  withTestId: (testId: string = 'test-component') => ({ testId }),
  withChildren: (children: ReactNode = 'Test Content') => ({ children }),
  withClick: (onClick = () => {}) => ({ onClick }),
  withError: (error: string = 'Test error') => ({ error }),
  withDisabled: () => ({ disabled: true })
} as const;