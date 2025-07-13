import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../../../src/components/common/Badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('renders with default props', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByTestId('badge');
    
    expect(badge).toHaveClass('bg-primary'); // default color
    expect(badge).toHaveClass('text-sm'); // default size sm
    expect(badge).toHaveClass('px-3'); // default size sm padding
    expect(badge).toHaveClass('rounded-none'); // default variant status
  });

  describe('variants', () => {
    it('renders status variant correctly', () => {
      render(<Badge variant="status">STATUS</Badge>);
      const badge = screen.getByTestId('badge');
      
      expect(badge).toHaveClass('rounded-none');
      expect(badge).toHaveClass('px-3'); // from size system
      expect(badge).toHaveClass('py-2'); // from size system
    });

    it('renders category variant correctly', () => {
      render(<Badge variant="category">CATEGORY</Badge>);
      const badge = screen.getByTestId('badge');
      
      expect(badge).toHaveClass('rounded-none');
      expect(badge).toHaveClass('px-3'); // from size system
      expect(badge).toHaveClass('py-2'); // from size system
    });

    it('renders count variant correctly', () => {
      render(<Badge variant="count">3</Badge>);
      const badge = screen.getByTestId('badge');
      
      expect(badge).toHaveClass('rounded-full', 'min-w-[2rem]');
      expect(badge).toHaveClass('px-3'); // from size system
      expect(badge).toHaveClass('py-2'); // from size system
    });
  });

  describe('colors', () => {
    it('renders primary color correctly', () => {
      render(<Badge color="primary">Primary</Badge>);
      const badge = screen.getByTestId('badge');
      
      expect(badge).toHaveClass('bg-primary', 'text-white', 'brutal-shadow-dark');
    });

    it('renders error color correctly', () => {
      render(<Badge color="error">Error</Badge>);
      const badge = screen.getByTestId('badge');
      
      expect(badge).toHaveClass('bg-error', 'text-white', 'brutal-shadow-dark');
    });

    it('renders dark color correctly', () => {
      render(<Badge color="dark">Dark</Badge>);
      const badge = screen.getByTestId('badge');
      
      expect(badge).toHaveClass('bg-text-primary', 'text-white', 'brutal-shadow-primary');
    });

    it('renders accent color correctly', () => {
      render(<Badge color="accent">Accent</Badge>);
      const badge = screen.getByTestId('badge');
      
      expect(badge).toHaveClass('bg-accent', 'text-white', 'brutal-shadow-dark');
    });
  });

  describe('sizes', () => {
    it('renders small size correctly', () => {
      render(<Badge size="sm">Small</Badge>);
      const badge = screen.getByTestId('badge');
      
      expect(badge).toHaveClass('text-sm', 'px-3', 'py-2');
    });

    it('renders medium size correctly', () => {
      render(<Badge size="md">Medium</Badge>);
      const badge = screen.getByTestId('badge');
      
      expect(badge).toHaveClass('text-base', 'px-4', 'py-3');
    });

    it('renders large size correctly', () => {
      render(<Badge size="lg">Large</Badge>);
      const badge = screen.getByTestId('badge');
      
      expect(badge).toHaveClass('text-lg', 'px-6', 'py-4');
    });
  });

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByTestId('badge');
    
    expect(badge).toHaveClass('custom-class');
  });

  it('uses custom testId', () => {
    render(<Badge testId="custom-badge">Custom Test ID</Badge>);
    
    expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
  });

  it('applies base styles consistently', () => {
    render(<Badge>Base Styles</Badge>);
    const badge = screen.getByTestId('badge');
    
    expect(badge).toHaveClass(
      'font-mono',
      'font-black',
      'uppercase',
      'tracking-wider',
      'inline-flex',
      'items-center',
      'justify-center',
      'border-text-primary',
      'whitespace-nowrap'
    );
    expect(badge).toHaveClass('border-brutal-sm'); // from size system
  });

  describe('real-world usage examples', () => {
    it('renders overdue status badge', () => {
      render(
        <Badge variant="status" color="error" size="sm">
          OVERDUE
        </Badge>
      );
      
      const badge = screen.getByText('OVERDUE');
      expect(badge).toHaveClass('bg-error', 'text-sm');
    });

    it('renders category badge for HVAC', () => {
      render(
        <Badge variant="category" color="primary">
          HVAC
        </Badge>
      );
      
      const badge = screen.getByText('HVAC');
      expect(badge).toHaveClass('bg-primary', 'rounded-none');
    });

    it('renders notification count badge', () => {
      render(
        <Badge variant="count" color="accent" size="sm">
          3
        </Badge>
      );
      
      const badge = screen.getByText('3');
      expect(badge).toHaveClass('bg-accent', 'rounded-full', 'min-w-[2rem]');
    });
  });
});