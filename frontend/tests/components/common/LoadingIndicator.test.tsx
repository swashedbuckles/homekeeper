import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingIndicator } from '../../../src/components/common/LoadingIndicator';

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
    it('applies correct styles for small size', () => {
      const { container } = render(<LoadingIndicator size="sm" />);
      
      const squares = container.querySelectorAll('.animate-pulse');
      squares.forEach(square => {
        expect(square).toHaveClass('w-3', 'h-3');
      });
      
      // Check for small gap between squares
      const squareContainer = container.querySelector('.gap-1');
      expect(squareContainer).toBeInTheDocument();
    });

    it('applies correct styles for medium size (default)', () => {
      const { container } = render(<LoadingIndicator size="md" />);
      
      const squares = container.querySelectorAll('.animate-pulse');
      squares.forEach(square => {
        expect(square).toHaveClass('w-4', 'h-4');
      });
      
      // Check for medium gap between squares
      const squareContainer = container.querySelector('.gap-2');
      expect(squareContainer).toBeInTheDocument();
    });

    it('applies correct styles for large size', () => {
      const { container } = render(<LoadingIndicator size="lg" />);
      
      const squares = container.querySelectorAll('.animate-pulse');
      squares.forEach(square => {
        expect(square).toHaveClass('w-6', 'h-6');
      });
      
      // Check for large gap between squares
      const squareContainer = container.querySelector('.gap-3');
      expect(squareContainer).toBeInTheDocument();
    });

    it('defaults to medium size when size prop is not provided', () => {
      const { container } = render(<LoadingIndicator />);
      
      const squares = container.querySelectorAll('.animate-pulse');
      squares.forEach(square => {
        expect(square).toHaveClass('w-4', 'h-4');
      });
    });
  });

  describe('Color Variants', () => {
    it('applies default color variant correctly', () => {
      const { container } = render(<LoadingIndicator variant="default" />);
      
      const squares = container.querySelectorAll('.animate-pulse');
      expect(squares[0]).toHaveClass('bg-primary');
      expect(squares[1]).toHaveClass('bg-secondary');
      expect(squares[2]).toHaveClass('bg-accent');
    });

    it('applies primary color variant correctly', () => {
      const { container } = render(<LoadingIndicator variant="primary" />);
      
      const squares = container.querySelectorAll('.animate-pulse');
      expect(squares[0]).toHaveClass('bg-primary');
      expect(squares[1]).toHaveClass('bg-primary/80');
      expect(squares[2]).toHaveClass('bg-primary/60');
    });

    it('applies secondary color variant correctly', () => {
      const { container } = render(<LoadingIndicator variant="secondary" />);
      
      const squares = container.querySelectorAll('.animate-pulse');
      expect(squares[0]).toHaveClass('bg-secondary');
      expect(squares[1]).toHaveClass('bg-secondary/80');
      expect(squares[2]).toHaveClass('bg-secondary/60');
    });

    it('applies accent color variant correctly', () => {
      const { container } = render(<LoadingIndicator variant="accent" />);
      
      const squares = container.querySelectorAll('.animate-pulse');
      expect(squares[0]).toHaveClass('bg-accent');
      expect(squares[1]).toHaveClass('bg-accent/80');
      expect(squares[2]).toHaveClass('bg-accent/60');
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
      
      // Look for any paragraph tags that would contain a message
      const messageParagraph = container.querySelector('p');
      expect(messageParagraph).not.toBeInTheDocument();
    });

    it('applies correct message styling', () => {
      const message = 'Loading...';
      render(<LoadingIndicator message={message} size="md" />);
      
      const messageParagraph = screen.getByText(message);
      expect(messageParagraph).toHaveClass(
        'text-text-secondary',
        'font-mono',
        'font-bold',
        'uppercase',
        'tracking-wide',
        'mt-4',
        'text-center',
        'text-sm' // md size uses text-sm
      );
    });

    it('applies correct message size for small indicator', () => {
      const message = 'Loading...';
      render(<LoadingIndicator message={message} size="sm" />);
      
      const messageParagraph = screen.getByText(message);
      expect(messageParagraph).toHaveClass('text-xs');
    });

    it('applies correct message size for large indicator', () => {
      const message = 'Loading...';
      render(<LoadingIndicator message={message} size="lg" />);
      
      const messageParagraph = screen.getByText(message);
      expect(messageParagraph).toHaveClass('text-base');
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

  describe('Animation Delays and Styling', () => {
    it('applies correct animation delays to squares', () => {
      const { container } = render(<LoadingIndicator />);
      
      const squares = container.querySelectorAll('.animate-pulse');
      expect(squares[0]).toHaveStyle({ animationDelay: '0ms' });
      expect(squares[1]).toHaveStyle({ animationDelay: '200ms' });
      expect(squares[2]).toHaveStyle({ animationDelay: '400ms' });
    });

    it('applies pulse animation to all squares', () => {
      const { container } = render(<LoadingIndicator />);
      
      const squares = container.querySelectorAll('.animate-pulse');
      squares.forEach(square => {
        expect(square).toHaveClass('animate-pulse');
      });
    });

    it('applies brutal styling to squares', () => {
      const { container } = render(<LoadingIndicator />);
      
      const squares = container.querySelectorAll('.animate-pulse');
      squares.forEach(square => {
        expect(square).toHaveClass(
          'border-brutal-sm',
          'border-text-primary',
          'flex-shrink-0'
        );
      });
    });

    it('maintains consistent square container layout', () => {
      const { container } = render(<LoadingIndicator />);
      
      const squareContainer = container.querySelector('.flex.items-center.justify-center');
      expect(squareContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility Considerations', () => {
    it('provides testId for automated testing', () => {
      render(<LoadingIndicator />);
      
      const indicator = screen.getByTestId('loading-indicator');
      expect(indicator).toBeInTheDocument();
    });

    it('accepts custom testId for better test identification', () => {
      const customTestId = 'dashboard-loading';
      render(<LoadingIndicator testId={customTestId} />);
      
      expect(screen.getByTestId(customTestId)).toBeInTheDocument();
    });

    it('provides semantic message text when message is provided', () => {
      const message = 'Loading your data, please wait...';
      render(<LoadingIndicator message={message} />);
      
      // Message should be accessible to screen readers
      const messageElement = screen.getByText(message);
      expect(messageElement.tagName.toLowerCase()).toBe('p');
    });

    it('maintains accessible contrast with brutal borders', () => {
      const { container } = render(<LoadingIndicator />);
      
      const squares = container.querySelectorAll('.animate-pulse');
      squares.forEach(square => {
        expect(square).toHaveClass('border-text-primary');
      });
    });

    it('uses semantic HTML structure', () => {
      const { container } = render(<LoadingIndicator message="Loading..." />);
      
      // Should use div for container and p for message
      expect(container.firstChild?.nodeName).toBe('DIV');
      expect(screen.getByText('Loading...').tagName.toLowerCase()).toBe('p');
    });
  });

  describe('Component Integration', () => {
    it('works with all size and variant combinations', () => {
      const sizes = ['sm', 'md', 'lg'] as const;
      const variants = ['default', 'primary', 'secondary', 'accent'] as const;
      
      sizes.forEach(size => {
        variants.forEach(variant => {
          const { container, unmount } = render(<LoadingIndicator size={size} variant={variant} />);
          
          const indicator = screen.getByTestId('loading-indicator');
          expect(indicator).toBeInTheDocument();
          
          const squares = container.querySelectorAll('.animate-pulse');
          expect(squares).toHaveLength(3);
          
          unmount();
        });
      });
    });

    it('works with inline mode and custom message combination', () => {
      const message = 'Processing request...';
      const { container } = render(<LoadingIndicator inline message={message} />);
      
      const indicator = container.firstChild;
      expect(indicator).toHaveClass('flex', 'flex-col', 'items-center');
      expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('maintains proper styling with all props combined', () => {
      const { container } = render(
        <LoadingIndicator 
          size="lg"
          variant="primary"
          inline
          message="Loading large content..."
          className="custom-loader"
          testId="complex-loader"
        />
      );
      
      const indicator = screen.getByTestId('complex-loader');
      expect(indicator).toHaveClass('custom-loader', 'flex', 'flex-col', 'items-center');
      
      const squares = container.querySelectorAll('.animate-pulse');
      expect(squares).toHaveLength(3);
      expect(squares[0]).toHaveClass('bg-primary', 'w-6', 'h-6');
      
      const message = screen.getByText('Loading large content...');
      expect(message).toHaveClass('text-base'); // lg size uses text-base
    });
  });

  describe('Component Lifecycle', () => {
    it('renders immediately without delays', () => {
      const { container } = render(<LoadingIndicator />);
      
      const indicator = screen.getByTestId('loading-indicator');
      expect(indicator).toBeInTheDocument();
      
      const squares = container.querySelectorAll('.animate-pulse');
      expect(squares).toHaveLength(3);
    });

    it('can be unmounted cleanly', () => {
      const { unmount } = render(<LoadingIndicator />);
      
      expect(() => unmount()).not.toThrow();
    });

    it('handles prop changes correctly', () => {
      const { rerender, container } = render(<LoadingIndicator size="sm" />);
      
      let squares = container.querySelectorAll('.animate-pulse');
      expect(squares[0]).toHaveClass('w-3', 'h-3');
      
      rerender(<LoadingIndicator size="lg" />);
      squares = container.querySelectorAll('.animate-pulse');
      expect(squares[0]).toHaveClass('w-6', 'h-6');
    });
  });

  describe('Display Name', () => {
    it('has correct displayName for debugging', () => {
      expect(LoadingIndicator.displayName).toBe('LoadingIndicator');
    });
  });
});