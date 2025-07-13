import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CheckBox } from '../../../src/components/form/Checkbox';

describe('CheckBox', () => {
  it('renders label correctly', () => {
    render(<CheckBox label="Accept terms" />);
    
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders with default props', () => {
    render(<CheckBox label="Default checkbox" />);
    
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('w-10', 'h-10'); // default md size
    expect(checkbox).toHaveClass('checked:bg-accent'); // default accent color
    expect(checkbox).not.toBeChecked();
  });

  describe('sizes', () => {
    it('renders xs size correctly', () => {
      render(<CheckBox label="Extra small" size="xs" />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('w-6', 'h-6');
      expect(checkbox).toHaveClass('border-2');
    });

    it('renders sm size correctly', () => {
      render(<CheckBox label="Small" size="sm" />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('w-8', 'h-8');
      expect(checkbox).toHaveClass('border-brutal-sm');
    });

    it('renders md size correctly', () => {
      render(<CheckBox label="Medium" size="md" />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('w-10', 'h-10');
      expect(checkbox).toHaveClass('border-brutal-md');
    });

    it('renders lg size correctly', () => {
      render(<CheckBox label="Large" size="lg" />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('w-12', 'h-12');
      expect(checkbox).toHaveClass('border-brutal-lg');
    });

    it('renders xl size correctly', () => {
      render(<CheckBox label="Extra large" size="xl" />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('w-12', 'h-12');
      expect(checkbox).toHaveClass('border-brutal-lg');
    });
  });

  describe('colors', () => {
    it('renders accent color correctly', () => {
      render(<CheckBox label="Accent" color="accent" />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('checked:bg-accent');
    });

    it('renders primary color correctly', () => {
      render(<CheckBox label="Primary" color="primary" />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('checked:bg-primary');
    });

    it('renders error color correctly', () => {
      render(<CheckBox label="Error" color="error" />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('checked:bg-error');
    });

    it('renders success color correctly', () => {
      render(<CheckBox label="Success" color="success" />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('checked:bg-success');
    });
  });

  describe('controlled behavior', () => {
    it('respects controlled checked prop', () => {
      render(<CheckBox label="Controlled" checked={true} onChange={vi.fn()} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('calls onChange when clicked in controlled mode', () => {
      const handleChange = vi.fn();
      render(<CheckBox label="Controlled" checked={false} onChange={handleChange} />);
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      
      expect(handleChange).toHaveBeenCalledTimes(1);
      // Just check that onChange was called, the exact event structure is implementation detail
      expect(handleChange).toHaveBeenCalled();
    });

    it('updates checked state in controlled mode', () => {
      const { rerender } = render(<CheckBox label="Controlled" checked={false} onChange={vi.fn()} />);
      
      let checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      
      rerender(<CheckBox label="Controlled" checked={true} onChange={vi.fn()} />);
      checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });
  });

  describe('uncontrolled behavior', () => {
    it('toggles state when clicked in uncontrolled mode', () => {
      render(<CheckBox label="Uncontrolled" />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      
      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('starts checked with defaultChecked', () => {
      render(<CheckBox label="Default checked" defaultChecked />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('can be unchecked when defaultChecked', () => {
      render(<CheckBox label="Default checked" defaultChecked />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
      
      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('disabled state', () => {
    it('renders disabled styling', () => {
      render(<CheckBox label="Disabled" disabled />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
      expect(checkbox).toHaveClass('cursor-not-allowed', 'opacity-50');
    });

    it('does not respond to clicks when disabled', () => {
      const handleChange = vi.fn();
      render(<CheckBox label="Disabled" disabled onChange={handleChange} />);
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      
      expect(handleChange).not.toHaveBeenCalled();
      expect(checkbox).not.toBeChecked();
    });

    it('applies disabled styling to label', () => {
      render(<CheckBox label="Disabled" disabled />);
      
      const label = screen.getByRole('checkbox').closest('label');
      expect(label).toHaveClass('cursor-not-allowed', 'opacity-50');
    });
  });

  describe('checkmark visibility', () => {
    it('shows checkmark when checked', () => {
      render(<CheckBox label="Checked" checked={true} onChange={vi.fn()} />);
      
      // Check for checkmark icon container
      const checkmarkContainer = screen.getByRole('checkbox').parentElement?.querySelector('.opacity-100');
      expect(checkmarkContainer).toBeInTheDocument();
    });

    it('hides checkmark when unchecked', () => {
      render(<CheckBox label="Unchecked" checked={false} onChange={vi.fn()} />);
      
      // Check for checkmark icon container
      const checkmarkContainer = screen.getByRole('checkbox').parentElement?.querySelector('.opacity-0');
      expect(checkmarkContainer).toBeInTheDocument();
    });
  });

  describe('custom props', () => {
    it('applies custom className', () => {
      render(<CheckBox label="Custom" className="custom-class" />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('custom-class');
    });

    it('uses custom testId', () => {
      render(<CheckBox label="Custom test" testId="custom-checkbox" />);
      
      expect(screen.getByTestId('custom-checkbox')).toBeInTheDocument();
    });

    it('passes through native props', () => {
      render(<CheckBox label="Native props" name="test-name" value="test-value" />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('name', 'test-name');
      expect(checkbox).toHaveAttribute('value', 'test-value');
    });
  });

  describe('form integration', () => {
    it('works with react-hook-form register', () => {
      const mockRegister = {
        name: 'terms',
        onChange: vi.fn(),
        onBlur: vi.fn(),
        ref: vi.fn()
      };

      render(<CheckBox label="Terms" register={mockRegister} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('name', 'terms');
    });
  });

  it('applies base styles consistently', () => {
    render(<CheckBox label="Base styles" />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass(
      'appearance-none',
      'bg-background',
      'border-text-primary',
      'cursor-pointer'
    );
  });

  describe('focus styles', () => {
    it('applies focus styles when not disabled', () => {
      render(<CheckBox label="Focusable" />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-primary');
    });

    it('does not apply focus styles when disabled', () => {
      render(<CheckBox label="Disabled focus" disabled />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-primary');
    });
  });
});