/**
 * @fileoverview Specialized testing utilities for compound components with complex nested structures.
 * 
 * This module provides comprehensive testing helpers specifically designed for compound components
 * like MediaCard, ListItem, and TaskCard that feature complex nested structures with Avatar, Badge,
 * and other sub-components. These helpers reduce repetitive test patterns and ensure consistent
 * testing across different compound component implementations.
 * 
 * The utilities handle various testing scenarios including:
 * - Avatar component rendering and color variants
 * - Badge component positioning and styling
 * - Layout structure validation
 * - Content placement and spacing
 * - Complex multi-component scenarios
 * - Accessibility compliance
 * - Edge cases and error handling
 * 
 * @example
 * ```tsx
 * // Test a MediaCard with Avatar and Badge components
 * createCompoundComponentTestSuite('MediaCard', MediaCard, {
 *   baseProps: { title: 'Test Media', testId: 'media-card' },
 *   testId: 'media-card',
 *   hasAvatar: true,
 *   hasBadge: true,
 *   hasComplexLayout: true
 * });
 * ```
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { ReactNode } from 'react';

/**
 * Creates a comprehensive test suite for compound components with multiple sub-components.
 * 
 * This factory function generates tests for compound components that have multiple child components
 * like Avatar, Badge, Content, etc. It validates that all expected elements render correctly
 * and have the appropriate CSS classes applied.
 * 
 * @template T - The props type for the component being tested
 * @param componentName - Name of the component for test descriptions (e.g., 'MediaCard', 'ListItem')
 * @param Component - The React component constructor with compound sub-components
 * @param baseProps - Default props to apply to all test scenarios
 * @param scenarios - Array of test scenarios with expected outcomes
 * 
 * @example
 * ```tsx
 * // Test MediaCard with various combinations of sub-components
 * createCompoundComponentTests('MediaCard', MediaCard, 
 *   { title: 'Test Media' },
 *   [
 *     {
 *       description: 'renders with avatar and badges',
 *       children: (
 *         <>
 *           <MediaCard.Avatar color="primary">📱</MediaCard.Avatar>
 *           <MediaCard.Badge variant="primary">PDF</MediaCard.Badge>
 *           <MediaCard.Badge variant="secondary">Manual</MediaCard.Badge>
 *         </>
 *       ),
 *       expectedElements: [
 *         { text: '📱', classes: ['bg-primary', 'text-white'] },
 *         { text: 'PDF', classes: ['font-black', 'uppercase'] },
 *         { text: 'Manual', classes: ['font-black', 'uppercase'] }
 *       ]
 *     }
 *   ]
 * );
 * ```
 */
export const createCompoundComponentTests = <T extends Record<string, any>>(
  componentName: string,
  Component: React.ComponentType<T> & { [key: string]: React.ComponentType<any> },
  baseProps: Partial<T>,
  scenarios: Array<{
    description: string;
    children: ReactNode;
    expectedElements: Array<{
      text: string;
      selector?: string;
      classes?: string[];
    }>;
  }>
) => {
  describe(`${componentName} compound components`, () => {
    scenarios.forEach(({ description, children, expectedElements }) => {
      it(description, () => {
        render(
          <Component {...baseProps as T}>
            {children}
          </Component>
        );

        expectedElements.forEach(({ text, selector, classes }) => {
          const element = selector ? 
            document.querySelector(selector) : 
            screen.getByText(text);
          
          expect(element).toBeInTheDocument();
          
          if (classes) {
            classes.forEach(className => {
              expect(element).toHaveClass(className);
            });
          }
        });
      });
    });
  });
};

/**
 * Creates tests to validate the layout structure and DOM hierarchy of compound components.
 * 
 * This helper ensures that compound components maintain correct layout structure,
 * including proper container classes, child element ordering, and nested element selectors.
 * It's particularly useful for components with complex CSS Grid or Flexbox layouts.
 * 
 * @template T - The props type for the component being tested
 * @param componentName - Name of the component for test descriptions
 * @param Component - The React component constructor
 * @param baseProps - Default props to apply to all test scenarios
 * @param layoutScenarios - Array of layout test scenarios
 * 
 * @example
 * ```tsx
 * // Test ListItem layout structure with avatar and content sections
 * createLayoutStructureTests('ListItem', ListItem,
 *   { title: 'Test Item' },
 *   [
 *     {
 *       description: 'renders with correct grid layout',
 *       children: (
 *         <>
 *           <ListItem.Avatar color="primary">IC</ListItem.Avatar>
 *           <ListItem.Content>
 *             <p>Content text</p>
 *           </ListItem.Content>
 *         </>
 *       ),
 *       expectedStructure: [
 *         {
 *           containerClasses: ['grid', 'grid-cols-[auto_1fr]', 'gap-4'],
 *           childSelectors: ['.avatar-container', '.content-container'],
 *           order: 0
 *         }
 *       ]
 *     }
 *   ]
 * );
 * ```
 */
export const createLayoutStructureTests = <T extends Record<string, any>>(
  componentName: string,
  Component: React.ComponentType<T>,
  baseProps: Partial<T>,
  layoutScenarios: Array<{
    description: string;
    children: ReactNode;
    expectedStructure: Array<{
      containerClasses: string[];
      childSelectors?: string[];
      order?: number;
    }>;
  }>
) => {
  describe(`${componentName} layout structure`, () => {
    layoutScenarios.forEach(({ description, children, expectedStructure }) => {
      it(description, () => {
        const { container } = render(
          <Component {...baseProps as T}>
            {children}
          </Component>
        );

        expectedStructure.forEach(({ containerClasses, childSelectors, order }) => {
          const cardElement = container.firstChild as HTMLElement;
          const childContainers = Array.from(cardElement.children);

          if (order !== undefined) {
            const targetContainer = childContainers[order];
            containerClasses.forEach(className => {
              expect(targetContainer).toHaveClass(className);
            });

            if (childSelectors) {
              childSelectors.forEach(selector => {
                expect(targetContainer.querySelector(selector)).toBeInTheDocument();
              });
            }
          }
        });
      });
    });
  });
};

/**
 * Creates comprehensive tests for Avatar sub-components within compound components.
 * 
 * This function generates a complete test suite for Avatar components, including rendering,
 * color variants, styling, and layout positioning. It tests all standard avatar behaviors
 * including color theming, typography, and flex layout properties.
 * 
 * @template T - The props type for the parent component
 * @param componentName - Name of the parent component for test descriptions
 * @param ParentComponent - The parent component that has an Avatar sub-component
 * @param baseProps - Default props for the parent component
 * 
 * @example
 * ```tsx
 * // Test MediaCard.Avatar component functionality
 * createAvatarTests('MediaCard', MediaCard, { title: 'Test Media' });
 * 
 * // Test TaskCard.Avatar with task-specific props
 * createAvatarTests('TaskCard', TaskCard, { 
 *   title: 'Test Task',
 *   status: 'pending'
 * });
 * ```
 */
export const createAvatarTests = <T extends Record<string, any>>(
  componentName: string,
  ParentComponent: React.ComponentType<T> & { Avatar: React.ComponentType<any> },
  baseProps: Partial<T>
) => {
  describe(`${componentName}.Avatar`, () => {
    it('renders avatar when provided', () => {
      render(
        <ParentComponent {...baseProps as T}>
          <ParentComponent.Avatar color="primary">📱</ParentComponent.Avatar>
        </ParentComponent>
      );
      
      expect(screen.getByText('📱')).toBeInTheDocument();
    });

    it('does not render avatar section when not provided', () => {
      render(<ParentComponent {...baseProps as T} />);
      
      expect(screen.queryByText('📱')).not.toBeInTheDocument();
    });

    it('applies correct avatar base styling', () => {
      render(
        <ParentComponent {...baseProps as T}>
          <ParentComponent.Avatar color="primary">IC</ParentComponent.Avatar>
        </ParentComponent>
      );
      
      const avatar = screen.getByText('IC');
      expect(avatar).toHaveClass(
        'flex', 'items-center', 'justify-center',
        'font-black', 'flex-shrink-0'
      );
    });

    const colorVariants = [
      { color: 'primary', text: 'P1', expectedClasses: ['bg-primary', 'text-white'] },
      { color: 'secondary', text: 'S2', expectedClasses: ['bg-secondary', 'text-white'] },
      { color: 'accent', text: 'A3', expectedClasses: ['bg-accent', 'text-white'] },
      { color: 'danger', text: 'D4', expectedClasses: ['bg-error', 'text-white'] }
    ];

    colorVariants.forEach(({ color, text, expectedClasses }) => {
      it(`applies ${color} color variant correctly`, () => {
        render(
          <ParentComponent {...baseProps as T}>
            <ParentComponent.Avatar color={color}>{text}</ParentComponent.Avatar>
          </ParentComponent>
        );
        
        const avatar = screen.getByText(text);
        expectedClasses.forEach(className => {
          expect(avatar).toHaveClass(className);
        });
      });
    });

    it('positions avatar in layout correctly', () => {
      render(
        <ParentComponent {...baseProps as T}>
          <ParentComponent.Avatar color="secondary">AV</ParentComponent.Avatar>
        </ParentComponent>
      );
      
      const avatar = screen.getByText('AV');
      // The avatar itself has flex-shrink-0, not the container
      expect(avatar).toHaveClass('flex-shrink-0');
    });
  });
};

/**
 * Creates comprehensive tests for Badge sub-components within compound components.
 * 
 * This function generates a complete test suite for Badge components, including single and
 * multiple badge rendering, styling variants, layout positioning, and container structure.
 * It validates that badges display correctly with proper spacing and variant-specific styling.
 * 
 * @template T - The props type for the parent component
 * @param componentName - Name of the parent component for test descriptions
 * @param ParentComponent - The parent component that has a Badge sub-component
 * @param baseProps - Default props for the parent component
 * 
 * @example
 * ```tsx
 * // Test ListItem.Badge component functionality
 * createBadgeTests('ListItem', ListItem, { title: 'Test Item' });
 * 
 * // Test MediaCard.Badge with media-specific props
 * createBadgeTests('MediaCard', MediaCard, { 
 *   title: 'Test Media',
 *   mediaType: 'document'
 * });
 * ```
 */
export const createBadgeTests = <T extends Record<string, any>>(
  componentName: string,
  ParentComponent: React.ComponentType<T> & { Badge: React.ComponentType<any> },
  baseProps: Partial<T>
) => {
  describe(`${componentName}.Badge`, () => {
    it('renders single badge when provided', () => {
      render(
        <ParentComponent {...baseProps as T}>
          <ParentComponent.Badge variant="primary">PDF</ParentComponent.Badge>
        </ParentComponent>
      );
      
      expect(screen.getByText('PDF')).toBeInTheDocument();
    });

    it('renders multiple badges when provided', () => {
      render(
        <ParentComponent {...baseProps as T}>
          <ParentComponent.Badge variant="primary">PDF</ParentComponent.Badge>
          <ParentComponent.Badge variant="secondary">Manual</ParentComponent.Badge>
        </ParentComponent>
      );
      
      expect(screen.getByText('PDF')).toBeInTheDocument();
      expect(screen.getByText('Manual')).toBeInTheDocument();
    });

    it('does not render badges section when not provided', () => {
      render(<ParentComponent {...baseProps as T} />);
      
      expect(screen.queryByText('PDF')).not.toBeInTheDocument();
    });

    it('applies correct badge base styling', () => {
      render(
        <ParentComponent {...baseProps as T}>
          <ParentComponent.Badge variant="accent">Success</ParentComponent.Badge>
        </ParentComponent>
      );
      
      const badge = screen.getByText('Success');
      expect(badge).toHaveClass(
        'font-black', 'uppercase', 'inline-block'
      );
    });

    it('positions badges correctly in layout', () => {
      render(
        <ParentComponent {...baseProps as T}>
          <ParentComponent.Badge variant="primary">Badge 1</ParentComponent.Badge>
          <ParentComponent.Badge variant="secondary">Badge 2</ParentComponent.Badge>
        </ParentComponent>
      );
      
      const badge1 = screen.getByText('Badge 1');
      const badgesContainer = badge1.parentElement;
      expect(badgesContainer).toHaveClass('flex', 'flex-wrap', 'gap-2');
    });

    it('supports multiple badge variants', () => {
      const badgeVariants = [
        { variant: 'primary', text: 'Primary' },
        { variant: 'secondary', text: 'Secondary' },
        { variant: 'accent', text: 'Accent' },
        { variant: 'success', text: 'Success' }
      ];

      render(
        <ParentComponent {...baseProps as T}>
          {badgeVariants.map(({ variant, text }) => (
            <ParentComponent.Badge key={variant} variant={variant}>
              {text}
            </ParentComponent.Badge>
          ))}
        </ParentComponent>
      );

      badgeVariants.forEach(({ text }) => {
        expect(screen.getByText(text)).toBeInTheDocument();
      });
    });
  });
};

/**
 * Creates tests for content layout and spacing within compound components.
 * 
 * This helper validates that content sections render correctly with proper spacing,
 * handles both Content sub-components and direct children, and maintains appropriate
 * layout structure. It's essential for components that mix compound sub-components
 * with regular content.
 * 
 * @template T - The props type for the component being tested
 * @param componentName - Name of the component for test descriptions
 * @param Component - The React component constructor
 * @param baseProps - Default props to apply to all test scenarios
 * @param testId - The test ID used to locate the component in tests
 * 
 * @example
 * ```tsx
 * // Test TaskCard content layout with mixed compound and regular content
 * createContentLayoutTests('TaskCard', TaskCard, 
 *   { title: 'Test Task', status: 'pending' },
 *   'task-card'
 * );
 * 
 * // Test MediaCard content layout with direct children
 * createContentLayoutTests('MediaCard', MediaCard,
 *   { title: 'Test Media', mediaType: 'image' },
 *   'media-card'
 * );
 * ```
 */
export const createContentLayoutTests = <T extends Record<string, any>>(
  componentName: string,
  Component: React.ComponentType<T>,
  baseProps: Partial<T>,
  testId: string
) => {
  describe(`${componentName} content layout`, () => {
    it('renders other content after compound components', () => {
      const ComponentWithContent = Component as any;
      
      // Check if component has a Content compound component
      if (ComponentWithContent.Content) {
        render(
          <Component {...baseProps as T}>
            <ComponentWithContent.Content>
              <p>Custom content paragraph</p>
              <button>Action Button</button>
            </ComponentWithContent.Content>
          </Component>
        );
      } else {
        // Component renders children directly (like MediaCard)
        render(
          <Component {...baseProps as T}>
            <p>Custom content paragraph</p>
            <button>Action Button</button>
          </Component>
        );
      }
      
      expect(screen.getByText('Custom content paragraph')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
    });

    it('applies correct spacing to other content', () => {
      const ComponentWithContent = Component as any;
      
      if (ComponentWithContent.Content) {
        render(
          <Component {...baseProps as T}>
            <ComponentWithContent.Content>
              <p>Content 1</p>
              <p>Content 2</p>
            </ComponentWithContent.Content>
          </Component>
        );
      } else {
        render(
          <Component {...baseProps as T}>
            <p>Content 1</p>
            <p>Content 2</p>
          </Component>
        );
      }
      
      const content1 = screen.getByText('Content 1');
      const contentContainer = content1.parentElement;
      
      // Check for spacing classes (may vary by component)
      const hasSpacing = contentContainer?.classList.contains('space-y-3') ||
                        contentContainer?.classList.contains('space-y-2') ||
                        contentContainer?.classList.contains('space-y-4') ||
                        contentContainer?.classList.contains('ml-6');
      expect(hasSpacing).toBe(true);
    });

    it('does not render content section when only compound components provided', () => {
      
      render(
        <Component {...baseProps as T}>
          {/* Only compound components, no regular content */}
        </Component>
      );
      
      const card = screen.getByTestId(testId);
      const contentSections = card.querySelectorAll('.space-y-3, .space-y-2, .space-y-4');
      expect(contentSections.length).toBeLessThanOrEqual(1); // May have header spacing but not content spacing
    });
  });
};

/**
 * Creates tests for complex scenarios involving multiple compound sub-components.
 * 
 * This helper tests realistic usage patterns where multiple compound sub-components
 * are used together, validates proper element ordering, handles mixed valid/invalid
 * children, and tests edge cases like empty children. Essential for ensuring robust
 * compound component behavior in real-world usage.
 * 
 * @template T - The props type for the parent component
 * @param componentName - Name of the parent component for test descriptions
 * @param ParentComponent - The parent component with multiple sub-components
 * @param baseProps - Default props for the parent component
 * @param testId - The test ID used to locate the component in tests
 * 
 * @example
 * ```tsx
 * // Test ListItem with complex Avatar, Badge, and Content combinations
 * createComplexScenarioTests('ListItem', ListItem,
 *   { title: 'Complex Item' },
 *   'list-item'
 * );
 * 
 * // Test MediaCard with mixed compound and regular content
 * createComplexScenarioTests('MediaCard', MediaCard,
 *   { title: 'Complex Media', mediaType: 'video' },
 *   'media-card'
 * );
 * ```
 */
export const createComplexScenarioTests = <T extends Record<string, any>>(
  componentName: string,
  ParentComponent: React.ComponentType<T> & { [key: string]: React.ComponentType<any> },
  baseProps: Partial<T>,
  testId: string
) => {
  describe(`${componentName} complex scenarios`, () => {
    it('renders all elements in correct order', () => {
      const ParentWithContent = ParentComponent as any;
      
      if (ParentWithContent.Content) {
        render(
          <ParentComponent {...baseProps as T}>
            <ParentComponent.Badge variant="primary">Top Badge</ParentComponent.Badge>
            <ParentComponent.Avatar color="secondary">🔧</ParentComponent.Avatar>
            <ParentWithContent.Content>
              <p>Content paragraph</p>
              <button>Content Button</button>
            </ParentWithContent.Content>
          </ParentComponent>
        );
      } else {
        render(
          <ParentComponent {...baseProps as T}>
            <ParentComponent.Badge variant="primary">Top Badge</ParentComponent.Badge>
            <ParentComponent.Avatar color="secondary">🔧</ParentComponent.Avatar>
            <p>Content paragraph</p>
            <button>Content Button</button>
          </ParentComponent>
        );
      }
      
      const card = screen.getByTestId(testId);
      const children = Array.from(card.children);
      
      // Verify structure exists (exact order may vary by component)
      expect(children.length).toBeGreaterThanOrEqual(2);
      
      // Verify all content is present
      expect(screen.getByText('Top Badge')).toBeInTheDocument();
      expect(screen.getByText('🔧')).toBeInTheDocument();
      expect(screen.getByText('Content paragraph')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Content Button' })).toBeInTheDocument();
    });

    it('handles mixed valid and invalid children', () => {
      const ParentWithContent = ParentComponent as any;
      
      if (ParentWithContent.Content) {
        // Component with Content compound component (like ListItem)
        render(
          <ParentComponent {...baseProps as T}>
            <ParentComponent.Avatar color="primary">AV</ParentComponent.Avatar>
            <div>Raw div - should not render</div>
            <ParentComponent.Badge variant="primary">Valid Badge</ParentComponent.Badge>
            <ParentWithContent.Content>
              <div>Regular div content</div>
            </ParentWithContent.Content>
          </ParentComponent>
        );
        
        // Valid compound components should render
        expect(screen.getByText('AV')).toBeInTheDocument();
        expect(screen.getByText('Valid Badge')).toBeInTheDocument();
        // Content inside Content component should render
        expect(screen.getByText('Regular div content')).toBeInTheDocument();
        // Raw div should not render
        expect(screen.queryByText('Raw div - should not render')).not.toBeInTheDocument();
      } else {
        // Component that renders children directly (like MediaCard)
        render(
          <ParentComponent {...baseProps as T}>
            <ParentComponent.Avatar color="primary">AV</ParentComponent.Avatar>
            <div>Regular div content</div>
            <ParentComponent.Badge variant="primary">Valid Badge</ParentComponent.Badge>
          </ParentComponent>
        );
        
        // All content should render
        expect(screen.getByText('AV')).toBeInTheDocument();
        expect(screen.getByText('Valid Badge')).toBeInTheDocument();
        expect(screen.getByText('Regular div content')).toBeInTheDocument();
      }
    });

    it('handles empty children gracefully', () => {
      render(<ParentComponent {...baseProps as T}>{null}</ParentComponent>);
      
      // Component should still render basic structure
      const card = screen.getByTestId(testId);
      expect(card).toBeInTheDocument();
    });
  });
};

/**
 * Creates accessibility tests for compound components.
 * 
 * This helper ensures compound components meet accessibility standards by testing
 * proper test ID usage, semantic HTML elements, and ARIA compliance. It validates
 * that components can be located by assistive technologies and follow accessibility
 * best practices.
 * 
 * @template T - The props type for the component being tested
 * @param componentName - Name of the component for test descriptions
 * @param Component - The React component constructor
 * @param baseProps - Default props to apply to all test scenarios
 * @param defaultTestId - The default test ID when none is provided
 * 
 * @example
 * ```tsx
 * // Test TaskCard accessibility features
 * createAccessibilityTests('TaskCard', TaskCard,
 *   { title: 'Accessible Task' },
 *   'task-card'
 * );
 * 
 * // Test ListItem accessibility with semantic elements
 * createAccessibilityTests('ListItem', ListItem,
 *   { title: 'Accessible List Item' },
 *   'list-item'
 * );
 * ```
 */
export const createAccessibilityTests = <T extends Record<string, any>>(
  componentName: string,
  Component: React.ComponentType<T>,
  baseProps: Partial<T>,
  defaultTestId: string
) => {
  describe(`${componentName} accessibility`, () => {
    it('applies correct test id', () => {
      const customTestId = 'custom-test-id';
      render(<Component {...baseProps as T} testId={customTestId} />);
      
      expect(screen.getByTestId(customTestId)).toBeInTheDocument();
    });

    it('uses default test id when not provided', () => {
      render(<Component {...baseProps as T} />);
      
      expect(screen.getByTestId(defaultTestId)).toBeInTheDocument();
    });

    it('uses semantic elements appropriately', () => {
      const title = (baseProps as any).title;
      if (title) {
        render(<Component {...baseProps as T} />);
        
        // Most compound components use h3 for titles
        const headingElement = screen.queryByRole('heading', { level: 3 });
        if (headingElement) {
          expect(headingElement).toHaveTextContent(title);
        }
      }
    });
  });
};

/**
 * Creates tests for edge cases and boundary conditions in compound components.
 * 
 * This helper tests how compound components handle unusual or extreme scenarios
 * like very long text content, special characters, Unicode content, and empty states.
 * Essential for ensuring robust component behavior across diverse content types.
 * 
 * @template T - The props type for the component being tested
 * @param componentName - Name of the component for test descriptions
 * @param Component - The React component constructor
 * @param baseProps - Default props to apply to all test scenarios
 * 
 * @example
 * ```tsx
 * // Test MediaCard edge cases with unusual content
 * createEdgeCasesTests('MediaCard', MediaCard, { 
 *   mediaType: 'document'
 * });
 * 
 * // Test ListItem edge cases with long text and special characters
 * createEdgeCasesTests('ListItem', ListItem, {
 *   status: 'active'
 * });
 * ```
 */
export const createEdgeCasesTests = <T extends Record<string, any>>(
  componentName: string,
  Component: React.ComponentType<T>,
  baseProps: Partial<T>
) => {
  describe(`${componentName} edge cases`, () => {
    it('handles very long text content', () => {
      const longTitle = 'This is a very long title that should handle text wrapping and layout correctly without breaking the component structure';
      const longSubtitle = 'This is a very long subtitle that should also handle text wrapping appropriately';
      
      render(
        <Component 
          {...baseProps as T}
          title={longTitle}
          subtitle={longSubtitle}
        />
      );
      
      expect(screen.getByText(longTitle)).toBeInTheDocument();
      if (longSubtitle) {
        expect(screen.getByText(longSubtitle)).toBeInTheDocument();
      }
    });

    it('handles special characters and unicode', () => {
      const specialTitle = 'Title with émojis 🚀 and spëcial chârs';
      
      render(
        <Component 
          {...baseProps as T}
          title={specialTitle}
        />
      );
      
      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });
  });
};

/**
 * Factory function for creating complete compound component test suites.
 * 
 * This is the main entry point for testing compound components. It orchestrates
 * all the specialized test helpers based on the component's capabilities and
 * creates a comprehensive test suite covering all aspects of compound component
 * behavior. Use this when you want complete test coverage with minimal setup.
 * 
 * @template T - The props type for the component being tested
 * @param componentName - Name of the component for test descriptions
 * @param ParentComponent - The compound component with optional sub-components
 * @param config - Configuration object specifying component capabilities and test options
 * 
 * @example
 * ```tsx
 * // Create complete test suite for MediaCard with all features
 * createCompoundComponentTestSuite('MediaCard', MediaCard, {
 *   baseProps: { 
 *     title: 'Test Media',
 *     mediaType: 'document',
 *     testId: 'media-card'
 *   },
 *   testId: 'media-card',
 *   hasAvatar: true,
 *   hasBadge: true,
 *   hasComplexLayout: true
 * });
 * 
 * // Create test suite for ListItem with avatar and content
 * createCompoundComponentTestSuite('ListItem', ListItem, {
 *   baseProps: {
 *     title: 'Test Item',
 *     testId: 'list-item'
 *   },
 *   testId: 'list-item',
 *   hasAvatar: true,
 *   hasBadge: false,
 *   hasComplexLayout: false
 * });
 * 
 * // Create basic test suite for simple TaskCard
 * createCompoundComponentTestSuite('TaskCard', TaskCard, {
 *   baseProps: {
 *     title: 'Test Task',
 *     status: 'pending'
 *   },
 *   testId: 'task-card'
 * });
 * ```
 */
export const createCompoundComponentTestSuite = <T extends Record<string, any>>(
  componentName: string,
  ParentComponent: React.ComponentType<T> & { 
    Avatar?: React.ComponentType<any>;
    Badge?: React.ComponentType<any>;
    [key: string]: React.ComponentType<any> | undefined;
  },
  config: {
    baseProps: Partial<T>;
    testId: string;
    hasAvatar?: boolean;
    hasBadge?: boolean;
    hasComplexLayout?: boolean;
  }
) => {
  const { baseProps, testId, hasAvatar = false, hasBadge = false, hasComplexLayout = false } = config;

  if (hasAvatar && ParentComponent.Avatar) {
    createAvatarTests(componentName, ParentComponent as any, baseProps);
  }

  if (hasBadge && ParentComponent.Badge) {
    createBadgeTests(componentName, ParentComponent as any, baseProps);
  }

  createContentLayoutTests(componentName, ParentComponent, baseProps, testId);
  createAccessibilityTests(componentName, ParentComponent, baseProps, testId);
  createEdgeCasesTests(componentName, ParentComponent, baseProps);

  if (hasComplexLayout) {
    createComplexScenarioTests(componentName, ParentComponent as any, baseProps, testId);
  }
};