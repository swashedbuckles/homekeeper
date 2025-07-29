import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../../../src/components/common/Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading text when loading', () => {
    render(<Button loading loadingText="Processing...">Click me</Button>);
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.queryByText('Click me')).not.toBeInTheDocument();
  });

  it('uses default loading text when none provided', () => {
    render(<Button loading>Click me</Button>);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');

    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary');

    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-transparent');
  });

  it('applies full width class when full prop is true', () => {
    render(<Button full>Full width</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('sets correct button type', () => {
    const { rerender } = render(<Button type="submit">Submit</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');

    rerender(<Button type="reset">Reset</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'reset');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  describe('Shadow Functionality', () => {
    describe('Default Shadow Behavior', () => {
      it('applies shadow by default for primary variant', () => {
        render(<Button variant="primary">Primary Button</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('brutal-shadow-dark'); // md size gets dark shadow
      });

      it('applies shadow by default for secondary variant', () => {
        render(<Button variant="secondary">Secondary Button</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('brutal-shadow-dark');
      });

      it('applies shadow by default for tertiary variant', () => {
        render(<Button variant="tertiary">Tertiary Button</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('brutal-shadow-dark');
      });

      it('applies shadow by default for danger variant', () => {
        render(<Button variant="danger">Danger Button</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('brutal-shadow-dark');
      });

      it('applies shadow by default for accent variant', () => {
        render(<Button variant="accent">Accent Button</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('brutal-shadow-dark');
      });

      it('does not apply shadow by default for outline variant', () => {
        render(<Button variant="outline">Outline Button</Button>);
        
        const button = screen.getByRole('button');
        expect(button).not.toHaveClass('brutal-shadow-dark', 'brutal-shadow-dark-sm');
      });

      it('does not apply shadow by default for text variant', () => {
        render(<Button variant="text">Text Button</Button>);
        
        const button = screen.getByRole('button');
        expect(button).not.toHaveClass('brutal-shadow-dark', 'brutal-shadow-dark-sm');
      });
    });

    describe('Size-Based Shadow Mapping', () => {
      it('applies small shadow for xs size buttons', () => {
        render(<Button size="xs">Extra Small</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('brutal-shadow-dark-sm');
      });

      it('applies small shadow for sm size buttons', () => {
        render(<Button size="sm">Small</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('brutal-shadow-dark-sm');
      });

      it('applies standard shadow for md size buttons', () => {
        render(<Button size="md">Medium</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('brutal-shadow-dark');
      });

      it('applies standard shadow for lg size buttons', () => {
        render(<Button size="lg">Large</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('brutal-shadow-dark');
      });

      it('applies standard shadow for xl size buttons', () => {
        render(<Button size="xl">Extra Large</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('brutal-shadow-dark');
      });
    });

    describe('Explicit Shadow Control', () => {
      it('applies shadow when shadow={true} is explicitly set', () => {
        render(<Button variant="outline" shadow={true}>Outline with Shadow</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('brutal-shadow-dark'); // md size gets dark shadow
      });

      it('removes shadow when shadow={false} is explicitly set', () => {
        render(<Button variant="primary" shadow={false}>Primary without Shadow</Button>);
        
        const button = screen.getByRole('button');
        expect(button).not.toHaveClass('brutal-shadow-dark', 'brutal-shadow-dark-sm');
      });

      it('respects size-based shadow when shadow={true} on small button', () => {
        render(<Button variant="outline" size="sm" shadow={true}>Small Outline with Shadow</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('brutal-shadow-dark-sm');
      });

      it('removes shadow from small button when shadow={false}', () => {
        render(<Button variant="primary" size="xs" shadow={false}>Small Primary without Shadow</Button>);
        
        const button = screen.getByRole('button');
        expect(button).not.toHaveClass('brutal-shadow-dark', 'brutal-shadow-dark-sm');
      });
    });

    describe('Shadow with Different Variants', () => {
      it('can add shadow to text variant', () => {
        render(<Button variant="text" shadow={true}>Text with Shadow</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('brutal-shadow-dark');
      });

      it('can remove shadow from primary variant', () => {
        render(<Button variant="primary" shadow={false}>Primary without Shadow</Button>);
        
        const button = screen.getByRole('button');
        expect(button).not.toHaveClass('brutal-shadow-dark');
      });

      it('maintains all other variant styles when shadow is modified', () => {
        render(<Button variant="secondary" shadow={false}>Secondary without Shadow</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-secondary', 'text-white', 'border-text-primary');
        expect(button).not.toHaveClass('brutal-shadow-dark');
      });
    });

    describe('Shadow Integration with Other Props', () => {
      it('maintains shadow behavior when disabled', () => {
        render(<Button variant="primary" disabled>Disabled Primary</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('brutal-shadow-dark');
        expect(button).toHaveClass('disabled:opacity-50');
      });

      it('maintains shadow behavior when loading', () => {
        render(<Button variant="primary" loading>Loading Primary</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('brutal-shadow-dark');
      });

      it('works with full width buttons', () => {
        render(<Button variant="primary" full>Full Width Primary</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('brutal-shadow-dark', 'w-full');
      });

      it('works with custom className', () => {
        render(<Button variant="primary" shadow={false} className="custom-class">Custom Primary</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
        expect(button).not.toHaveClass('brutal-shadow-dark');
      });
    });

    describe('Real-world Shadow Usage', () => {
      it('renders Action component default (small shadow)', () => {
        // This simulates how Action component would use Button
        render(<Button variant="primary" size="sm">Action Button</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('brutal-shadow-dark-sm');
      });

      it('renders clean list item actions without shadows', () => {
        render(<Button variant="primary" size="sm" shadow={false}>Clean Action</Button>);
        
        const button = screen.getByRole('button');
        expect(button).not.toHaveClass('brutal-shadow-dark', 'brutal-shadow-dark-sm');
      });

      it('renders mixed shadow usage in list items', () => {
        const { container } = render(
          <div>
            <Button variant="primary" size="sm" shadow={false}>No Shadow</Button>
            <Button variant="secondary" size="sm">With Shadow</Button>
            <Button variant="outline" size="sm">Natural (no shadow)</Button>
          </div>
        );
        
        const buttons = container.querySelectorAll('button');
        expect(buttons[0]).not.toHaveClass('brutal-shadow-dark-sm'); // explicit false
        expect(buttons[1]).toHaveClass('brutal-shadow-dark-sm'); // default true
        expect(buttons[2]).not.toHaveClass('brutal-shadow-dark-sm'); // outline default false
      });

      it('renders hero button with large shadow', () => {
        render(<Button variant="primary" size="xl">Hero CTA Button</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('brutal-shadow-dark'); // xl still gets standard shadow
      });
    });

    describe('Shadow Edge Cases', () => {
      it('handles undefined shadow prop correctly', () => {
        render(<Button variant="primary" shadow={undefined}>Undefined Shadow</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('brutal-shadow-dark'); // should use default behavior
      });

      it('preserves existing class order with shadow classes', () => {
        render(<Button variant="primary" size="sm" className="custom">Custom Button</Button>);
        
        const button = screen.getByRole('button');
        const classes = button.className.split(' ');
        expect(classes).toContain('brutal-shadow-dark-sm');
        expect(classes).toContain('custom');
        expect(classes).toContain('bg-primary');
      });

      it('works correctly when shadow prop changes dynamically', () => {
        const { rerender } = render(<Button variant="primary" shadow={true}>Dynamic Shadow</Button>);
        
        let button = screen.getByRole('button');
        expect(button).toHaveClass('brutal-shadow-dark');
        
        rerender(<Button variant="primary" shadow={false}>Dynamic Shadow</Button>);
        button = screen.getByRole('button');
        expect(button).not.toHaveClass('brutal-shadow-dark');
      });
    });
  });
});