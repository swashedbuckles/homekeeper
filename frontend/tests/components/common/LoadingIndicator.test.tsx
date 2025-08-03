import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingIndicator } from '../../../src/components/common/LoadingIndicator';
import { expectElementToHaveClasses } from '../../helpers/testHelpers';

describe('LoadingIndicator', () => {
  describe('Default Rendering and Basic Functionality', () => {
    it('renders the loading indicator with default props', () => {
      render(<LoadingIndicator />);
      
      const indicator = screen.getByTestId('loading-indicator');
      expect(indicator).toBeInTheDocument();
    });

    it('renders three loading squares', () => {
      const { container } = render(<LoadingIndicator />);
      
      // Find all div elements with animate-pulse class (the loading squares)
      const squares = container.querySelectorAll('.animate-pulse');
      expect(squares).toHaveLength(3);
    });

    it('renders in centered layout by default', () => {
      const { container } = render(<LoadingIndicator />);
      
      const indicator = container.firstChild;
      expect(indicator).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center');
    });

    it('sets default testId correctly', () => {
      render(<LoadingIndicator />);
      
      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    const sizeTests = [
      {
        size: 'small',
        props: { size: 'sm' as const },
        squareClasses: ['w-3', 'h-3'],
        gapClass: 'gap-1'
      },
      {
        size: 'medium',
        props: { size: 'md' as const },
        squareClasses: ['w-4', 'h-4'],
        gapClass: 'gap-2'
      },
      {
        size: 'large',
        props: { size: 'lg' as const },
        squareClasses: ['w-6', 'h-6'],
        gapClass: 'gap-3'
      }
    ];

    sizeTests.forEach(({ size, props, squareClasses, gapClass }) => {
      it(`applies correct styles for ${size} size`, () => {
        const { container } = render(<LoadingIndicator {...props} />);
        
        const squares = container.querySelectorAll('.animate-pulse');
        squares.forEach(square => {
          expectElementToHaveClasses(square as HTMLElement, squareClasses);
        });
        
        const squareContainer = container.querySelector(`.${gapClass}`);
        expect(squareContainer).toBeInTheDocument();
      });
    });

    it('defaults to medium size when size prop is not provided', () => {
      const { container } = render(<LoadingIndicator />);
      
      const squares = container.querySelectorAll('.animate-pulse');
      squares.forEach(square => {
        expectElementToHaveClasses(square as HTMLElement, ['w-4', 'h-4']);
      });
    });
  });

  describe('Color Variants', () => {
    const colorTests = [
      {
        variant: 'default',
        props: { variant: 'default' as const },
        expectedSquareClasses: ['bg-primary', 'bg-secondary', 'bg-accent']
      },
      {
        variant: 'primary',
        props: { variant: 'primary' as const },
        expectedSquareClasses: ['bg-primary', 'bg-primary/80', 'bg-primary/60']
      },
      {
        variant: 'secondary',
        props: { variant: 'secondary' as const },
        expectedSquareClasses: ['bg-secondary', 'bg-secondary/80', 'bg-secondary/60']
      },
      {
        variant: 'accent',
        props: { variant: 'accent' as const },
        expectedSquareClasses: ['bg-accent', 'bg-accent/80', 'bg-accent/60']
      }
    ];

    colorTests.forEach(({ variant, props, expectedSquareClasses }) => {
      it(`applies ${variant} color variant correctly`, () => {
        const { container } = render(<LoadingIndicator {...props} />);
        
        const squares = container.querySelectorAll('.animate-pulse');
        expectedSquareClasses.forEach((expectedClass, index) => {
          expect(squares[index]).toHaveClass(expectedClass);
        });
      });
    });

    it('defaults to default variant when variant prop is not provided', () => {
      const { container } = render(<LoadingIndicator />);
      
      const squares = container.querySelectorAll('.animate-pulse');
      expect(squares[0]).toHaveClass('bg-primary');
      expect(squares[1]).toHaveClass('bg-secondary');
      expect(squares[2]).toHaveClass('bg-accent');
    });
  });

  describe('Layout Modes', () => {
    it('renders in centered layout by default', () => {
      const { container } = render(<LoadingIndicator />);
      
      const indicator = container.firstChild;
      expect(indicator).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center');
      expect(indicator).not.toHaveClass('flex-col');
    });

    it('renders in inline layout when inline prop is true', () => {
      const { container } = render(<LoadingIndicator inline />);
      
      const indicator = container.firstChild;
      expect(indicator).toHaveClass('flex', 'flex-col', 'items-center');
      expect(indicator).not.toHaveClass('min-h-screen', 'justify-center');
    });

    it('applies correct structure for centered layout', () => {
      const { container } = render(<LoadingIndicator />);
      
      // Centered layout should have a nested text-center div
      const textCenterDiv = container.querySelector('.text-center');
      expect(textCenterDiv).toBeInTheDocument();
    });

    it('applies correct structure for inline layout', () => {
      const { container } = render(<LoadingIndicator inline />);
      
      // Inline layout should not have a nested text-center div
      const textCenterDiv = container.querySelector('.text-center');
      expect(textCenterDiv).not.toBeInTheDocument();
    });
  });

  describe('Custom Messages', () => {
    it('displays custom message when provided', () => {
      const message = 'Loading your dashboard...';
      render(<LoadingIndicator message={message} />);
      
      expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('does not display message when not provided', () => {
      const { container } = render(<LoadingIndicator />);
      
      const messageParagraph = container.querySelector('p');
      expect(messageParagraph).not.toBeInTheDocument();
    });

    describe('Message sizing', () => {
      const messageSizeTests = [
        { size: 'sm' as const, expectedClass: 'text-xs' },
        { size: 'md' as const, expectedClass: 'text-sm' },
        { size: 'lg' as const, expectedClass: 'text-base' }
      ];

      messageSizeTests.forEach(({ size, expectedClass }) => {
        it(`applies correct message size for ${size} indicator`, () => {
          const message = 'Loading...';
          render(<LoadingIndicator message={message} size={size} />);
          
          const messageParagraph = screen.getByText(message);
          expect(messageParagraph).toHaveClass(expectedClass);
        });
      });
    });

    it('applies correct base message styling', () => {
      const message = 'Loading...';
      render(<LoadingIndicator message={message} size="md" />);
      
      const messageParagraph = screen.getByText(message);
      expectElementToHaveClasses(messageParagraph, [
        'text-text-secondary', 'font-mono', 'font-bold',
        'uppercase', 'tracking-wide', 'mt-4', 'text-center'
      ]);
    });

    it('displays message in both centered and inline modes', () => {
      const message = 'Custom loading message';
      
      const { rerender } = render(<LoadingIndicator message={message} />);
      expect(screen.getByText(message)).toBeInTheDocument();
      
      rerender(<LoadingIndicator message={message} inline />);
      expect(screen.getByText(message)).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('applies custom className correctly', () => {
      const customClass = 'custom-loading-class';
      const { container } = render(<LoadingIndicator className={customClass} />);
      
      const indicator = container.firstChild;
      expect(indicator).toHaveClass(customClass);
    });

    it('applies custom testId correctly', () => {
      const customTestId = 'my-custom-loading-indicator';
      render(<LoadingIndicator testId={customTestId} />);
      
      expect(screen.getByTestId(customTestId)).toBeInTheDocument();
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });

    it('combines custom className with default styles', () => {
      const customClass = 'my-custom-styles';
      const { container } = render(<LoadingIndicator className={customClass} />);
      
      const indicator = container.firstChild;
      expect(indicator).toHaveClass(customClass);
      expect(indicator).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center');
    });

    it('combines custom className with inline styles', () => {
      const customClass = 'my-inline-styles';
      const { container } = render(<LoadingIndicator className={customClass} inline />);
      
      const indicator = container.firstChild;
      expect(indicator).toHaveClass(customClass);
      expect(indicator).toHaveClass('flex', 'flex-col', 'items-center');
    });
  });

  describe('Animation and Styling', () => {
    it('applies correct animation delays and styling to squares', () => {
      const { container } = render(<LoadingIndicator />);
      
      const squares = container.querySelectorAll('.animate-pulse');
      const expectedDelays = ['0ms', '200ms', '400ms'];
      
      squares.forEach((square, index) => {
        expect(square).toHaveStyle({ animationDelay: expectedDelays[index] });
        expect(square).toHaveClass('animate-pulse');
        expectElementToHaveClasses(square as HTMLElement, [
          'border-brutal-sm', 'border-text-primary', 'flex-shrink-0'
        ]);
      });
    });

    it('maintains consistent square container layout', () => {
      const { container } = render(<LoadingIndicator />);
      
      const squareContainer = container.querySelector('.flex.items-center.justify-center');
      expect(squareContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    const accessibilityTests = [
      {
        name: 'provides default testId',
        props: {},
        expectedTestId: 'loading-indicator'
      },
      {
        name: 'accepts custom testId',
        props: { testId: 'dashboard-loading' },
        expectedTestId: 'dashboard-loading'
      }
    ];

    accessibilityTests.forEach(({ name, props, expectedTestId }) => {
      it(name, () => {
        render(<LoadingIndicator {...props} />);
        expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
      });
    });

    it('uses semantic HTML structure with proper message element', () => {
      const message = 'Loading your data, please wait...';
      const { container } = render(<LoadingIndicator message={message} />);
      
      expect(container.firstChild?.nodeName).toBe('DIV');
      const messageElement = screen.getByText(message);
      expect(messageElement.tagName.toLowerCase()).toBe('p');
    });

    it('maintains accessible contrast', () => {
      const { container } = render(<LoadingIndicator />);
      
      const squares = container.querySelectorAll('.animate-pulse');
      squares.forEach(square => {
        expect(square).toHaveClass('border-text-primary');
      });
    });
  });

  describe('Component Integration', () => {
    it('works with all size and variant combinations', () => {
      const sizes = ['sm', 'md', 'lg'] as const;
      const variants = ['default', 'primary', 'secondary', 'accent'] as const;
      
      sizes.forEach(size => {
        variants.forEach(variant => {
          const { container, unmount } = render(<LoadingIndicator size={size} variant={variant} />);
          
          expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
          expect(container.querySelectorAll('.animate-pulse')).toHaveLength(3);
          
          unmount();
        });
      });
    });

    const integrationTests = [
      {
        name: 'works with inline mode and custom message',
        props: { inline: true, message: 'Processing request...' },
        test: (container: HTMLElement) => {
          expect(container.firstChild).toHaveClass('flex', 'flex-col', 'items-center');
          expect(screen.getByText('Processing request...')).toBeInTheDocument();
        }
      },
      {
        name: 'maintains proper styling with all props combined',
        props: {
          size: 'lg' as const,
          variant: 'primary' as const,
          inline: true,
          message: 'Loading large content...',
          className: 'custom-loader',
          testId: 'complex-loader'
        },
        test: (container: HTMLElement) => {
          const indicator = screen.getByTestId('complex-loader');
          expectElementToHaveClasses(indicator, ['custom-loader', 'flex', 'flex-col', 'items-center']);
          
          const squares = container.querySelectorAll('.animate-pulse');
          expect(squares).toHaveLength(3);
          expectElementToHaveClasses(squares[0] as HTMLElement, ['bg-primary', 'w-6', 'h-6']);
          
          const message = screen.getByText('Loading large content...');
          expect(message).toHaveClass('text-base');
        }
      }
    ];

    integrationTests.forEach(({ name, props, test }) => {
      it(name, () => {
        const { container } = render(<LoadingIndicator {...props} />);
        test(container);
      });
    });
  });

  describe('Component Lifecycle', () => {
    it('renders immediately and handles lifecycle correctly', () => {
      const { container, unmount } = render(<LoadingIndicator />);
      
      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
      expect(container.querySelectorAll('.animate-pulse')).toHaveLength(3);
      expect(() => unmount()).not.toThrow();
    });

    it('handles prop changes correctly', () => {
      const { rerender, container } = render(<LoadingIndicator size="sm" />);
      
      let squares = container.querySelectorAll('.animate-pulse');
      expectElementToHaveClasses(squares[0] as HTMLElement, ['w-3', 'h-3']);
      
      rerender(<LoadingIndicator size="lg" />);
      squares = container.querySelectorAll('.animate-pulse');
      expectElementToHaveClasses(squares[0] as HTMLElement, ['w-6', 'h-6']);
    });

    it('has correct displayName for debugging', () => {
      expect(LoadingIndicator.displayName).toBe('LoadingIndicator');
    });
  });
});