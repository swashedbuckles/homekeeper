import { screen } from '@testing-library/react';
import { expect } from 'vitest';

/**
 * @fileoverview Common assertion helpers to reduce repetitive test code across all component tests.
 * These utilities provide consistent patterns for testing UI elements, states, and behaviors.
 * 
 * @example
 * ```typescript
 * import { expectElementToHaveClasses, expectTextToBeVisible } from '@/tests/helpers/testHelpers';
 * 
 * // Test component classes
 * const button = screen.getByRole('button');
 * expectElementToHaveClasses(button, ['bg-primary', 'text-white']);
 * 
 * // Test text visibility
 * expectTextToBeVisible('Save Changes');
 * ```
 */

/**
 * Asserts that text is visible in the document
 * @param text - The text content to search for
 * @example
 * ```typescript
 * expectTextToBeVisible('Welcome to HomeKeeper');
 * ```
 */
export const expectTextToBeVisible = (text: string) => {
  expect(screen.getByText(text)).toBeInTheDocument();
};

/**
 * Asserts that text is not present in the document
 * @param text - The text content that should not be present
 * @example
 * ```typescript
 * expectTextNotToBeVisible('Error message');
 * ```
 */
export const expectTextNotToBeVisible = (text: string) => {
  expect(screen.queryByText(text)).not.toBeInTheDocument();
};

/**
 * Asserts that an element has all specified CSS classes
 * Core utility used throughout the test suite for style verification
 * @param element - The DOM element to test
 * @param classes - Array of CSS class names that should be present
 * @example
 * ```typescript
 * const button = screen.getByRole('button');
 * expectElementToHaveClasses(button, ['bg-primary', 'text-white', 'px-4']);
 * ```
 */
export const expectElementToHaveClasses = (element: HTMLElement, classes: string[]) => {
  classes.forEach(className => {
    expect(element).toHaveClass(className);
  });
};

/**
 * Asserts that an element does not have any of the specified CSS classes
 * @param element - The DOM element to test
 * @param classes - Array of CSS class names that should not be present
 * @example
 * ```typescript
 * const button = screen.getByRole('button');
 * expectElementNotToHaveClasses(button, ['bg-error', 'opacity-50']);
 * ```
 */
export const expectElementNotToHaveClasses = (element: HTMLElement, classes: string[]) => {
  classes.forEach(className => {
    expect(element).not.toHaveClass(className);
  });
};

/**
 * Asserts that a button is present in the document
 * @param name - Button name or regex pattern to match
 * @example
 * ```typescript
 * expectButtonToBeInDocument('Save');
 * expectButtonToBeInDocument(/delete/i);
 * ```
 */
export const expectButtonToBeInDocument = (name: string | RegExp) => {
  expect(screen.getByRole('button', { name })).toBeInTheDocument();
};

/**
 * Asserts that a button has specified CSS classes
 * @param name - Button name or regex pattern to match
 * @param classes - Array of CSS class names that should be present
 * @example
 * ```typescript
 * expectButtonToHaveClasses('Submit', ['bg-primary', 'text-white']);
 * ```
 */
export const expectButtonToHaveClasses = (name: string | RegExp, classes: string[]) => {
  const button = screen.getByRole('button', { name });
  expectElementToHaveClasses(button, classes);
};

/**
 * Asserts that a form input has a specific attribute value
 * @param label - The label text associated with the input
 * @param attribute - The attribute name to check
 * @param value - The expected attribute value
 * @example
 * ```typescript
 * expectInputToHaveAttribute('Email', 'type', 'email');
 * expectInputToHaveAttribute('Password', 'required', '');
 * ```
 */
export const expectInputToHaveAttribute = (label: string, attribute: string, value: string) => {
  const input = screen.getByLabelText(label);
  expect(input).toHaveAttribute(attribute, value);
};

/**
 * Asserts that a form input has specified CSS classes
 * @param label - The label text associated with the input
 * @param classes - Array of CSS class names that should be present
 * @example
 * ```typescript
 * expectInputToHaveClasses('Email', ['border-primary', 'rounded-md']);
 * ```
 */
export const expectInputToHaveClasses = (label: string, classes: string[]) => {
  const input = screen.getByLabelText(label);
  expectElementToHaveClasses(input, classes);
};

/**
 * Asserts that an element with a specific test ID has specified CSS classes
 * Commonly used for elements that don't have semantic roles or labels
 * @param testId - The data-testid attribute value
 * @param classes - Array of CSS class names that should be present
 * @example
 * ```typescript
 * expectTestIdToHaveClasses('loading-spinner', ['animate-spin', 'text-primary']);
 * ```
 */
export const expectTestIdToHaveClasses = (testId: string, classes: string[]) => {
  const element = screen.getByTestId(testId);
  expectElementToHaveClasses(element, classes);
};

/**
 * Helper for testing component variants in a data-driven approach
 * @param testId - The data-testid attribute value of the component
 * @param variants - Record mapping variant names to expected CSS classes
 * @example
 * ```typescript
 * testComponentVariants('button', {
 *   primary: ['bg-primary', 'text-white'],
 *   secondary: ['bg-secondary', 'text-dark']
 * });
 * ```
 */
export const testComponentVariants = <T extends string>(
  testId: string,
  variants: Record<T, string[]>
) => {
  Object.entries(variants).forEach(([_variant, expectedClasses]) => {
    const element = screen.getByTestId(testId);
    expectElementToHaveClasses(element, expectedClasses as string[]);
  });
};

/**
 * Helper for testing component sizes in a data-driven approach
 * @param testId - The data-testid attribute value of the component
 * @param sizes - Record mapping size names to expected CSS classes
 * @example
 * ```typescript
 * testComponentSizes('button', {
 *   sm: ['text-sm', 'px-3', 'py-1'],
 *   md: ['text-base', 'px-4', 'py-2'],
 *   lg: ['text-lg', 'px-6', 'py-3']
 * });
 * ```
 */
export const testComponentSizes = <T extends string>(
  testId: string,
  sizes: Record<T, string[]>
) => {
  Object.entries(sizes).forEach(([_size, expectedClasses]) => {
    const element = screen.getByTestId(testId);
    expectElementToHaveClasses(element, expectedClasses as string[]);
  });
};

/**
 * Asserts that an element has the appropriate brutal shadow classes
 * Used for buttons and elevated components in the design system
 * @param element - The DOM element to test
 * @param size - The shadow size variant
 * @example
 * ```typescript
 * const button = screen.getByRole('button');
 * expectShadowClasses(button, 'lg');
 * ```
 */
export const expectShadowClasses = (element: HTMLElement, size: 'sm' | 'md' | 'lg' = 'md') => {
  const shadowClass = size === 'sm' ? 'brutal-shadow-dark-sm' : 'brutal-shadow-dark';
  expect(element).toHaveClass(shadowClass);
};

/**
 * Asserts that an element does not have any shadow classes
 * @param element - The DOM element to test
 * @example
 * ```typescript
 * const flatButton = screen.getByRole('button');
 * expectNoShadowClasses(flatButton);
 * ```
 */
export const expectNoShadowClasses = (element: HTMLElement) => {
  expect(element).not.toHaveClass('brutal-shadow-dark', 'brutal-shadow-dark-sm');
};

/**
 * Asserts that an element is in an error state with appropriate styling and message
 * @param testId - The data-testid attribute value of the element
 * @param errorMessage - The error message text that should be visible
 * @example
 * ```typescript
 * expectErrorState('email-input', 'Invalid email address');
 * ```
 */
export const expectErrorState = (testId: string, errorMessage: string) => {
  const element = screen.getByTestId(testId);
  expect(element).toHaveClass('border-error');
  expectTextToBeVisible(errorMessage);
};

/**
 * Asserts that an element is in a loading state with reduced opacity
 * @param element - The DOM element to test
 * @example
 * ```typescript
 * const button = screen.getByRole('button');
 * expectLoadingState(button);
 * ```
 */
export const expectLoadingState = (element: HTMLElement) => {
  expect(element).toHaveClass('opacity-50');
};

/**
 * Asserts that an element is disabled with appropriate styling
 * @param element - The DOM element to test
 * @example
 * ```typescript
 * const button = screen.getByRole('button');
 * expectDisabledState(button);
 * ```
 */
export const expectDisabledState = (element: HTMLElement) => {
  expect(element).toBeDisabled();
  expect(element).toHaveClass('opacity-50');
};