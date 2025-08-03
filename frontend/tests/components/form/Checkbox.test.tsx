import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CheckBox } from '../../../src/components/form/Checkbox';
import { expectElementToHaveClasses } from '../../helpers/testHelpers';

describe('CheckBox', () => {
  it('renders label correctly', () => {
    render(<CheckBox label="Accept terms" />);
    
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders with default props', () => {
    render(<CheckBox label="Default checkbox" />);
    
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('w-8', 'h-8'); // default md size
    expect(checkbox).toHaveClass('checked:bg-accent'); // default accent color
    expect(checkbox).not.toBeChecked();
  });

  describe('sizes', () => {
    const sizeTests = [
      {
        size: 'xs',
        props: { label: 'Extra small', size: 'xs' as const },
        expectedClasses: ['w-5', 'h-5', 'border-2']
      },
      {
        size: 'sm', 
        props: { label: 'Small', size: 'sm' as const },
        expectedClasses: ['w-6', 'h-6', 'border-brutal-sm']
      },
      {
        size: 'md',
        props: { label: 'Medium', size: 'md' as const },
        expectedClasses: ['w-8', 'h-8', 'border-brutal-md']
      },
      {
        size: 'lg',
        props: { label: 'Large', size: 'lg' as const },
        expectedClasses: ['w-10', 'h-10', 'border-brutal-lg']
      },
      {
        size: 'xl',
        props: { label: 'Extra large', size: 'xl' as const },
        expectedClasses: ['w-12', 'h-12', 'border-brutal-lg']
      }
    ];

    sizeTests.forEach(({ size, props, expectedClasses }) => {
      it(`renders ${size} size correctly`, () => {
        render(<CheckBox {...props} />);
        
        const checkbox = screen.getByRole('checkbox');
        expectElementToHaveClasses(checkbox, expectedClasses);
      });
    });
  });

  describe('colors', () => {
    const colorTests = [
      { color: 'accent', expectedClass: 'checked:bg-accent' },
      { color: 'primary', expectedClass: 'checked:bg-primary' },
      { color: 'error', expectedClass: 'checked:bg-error' },
      { color: 'success', expectedClass: 'checked:bg-success' }
    ];

    colorTests.forEach(({ color, expectedClass }) => {
      it(`renders ${color} color correctly`, () => {
        render(<CheckBox label={color.charAt(0).toUpperCase() + color.slice(1)} color={color as any} />);
        
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toHaveClass(expectedClass);
      });
    });
  });

  describe('behavior patterns', () => {
    describe('controlled mode', () => {
      const controlledTests = [
        {
          name: 'respects controlled checked prop',
          props: { label: 'Controlled', checked: true, onChange: vi.fn() },
          test: (checkbox: HTMLElement) => expect(checkbox).toBeChecked()
        },
        {
          name: 'calls onChange when clicked',
          props: { label: 'Controlled', checked: false, onChange: vi.fn() },
          test: (checkbox: HTMLElement, props: any) => {
            fireEvent.click(checkbox);
            expect(props.onChange).toHaveBeenCalledTimes(1);
          }
        }
      ];

      controlledTests.forEach(({ name, props, test }) => {
        it(name, () => {
          render(<CheckBox {...props} />);
          const checkbox = screen.getByRole('checkbox');
          test(checkbox, props);
        });
      });

      it('updates checked state when props change', () => {
        const { rerender } = render(<CheckBox label="Controlled" checked={false} onChange={vi.fn()} />);
        
        let checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
        
        rerender(<CheckBox label="Controlled" checked={true} onChange={vi.fn()} />);
        checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
      });
    });

    describe('uncontrolled mode', () => {
      it('toggles state when clicked', () => {
        render(<CheckBox label="Uncontrolled" />);
        
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
        
        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();
        
        fireEvent.click(checkbox);
        expect(checkbox).not.toBeChecked();
      });

      it('respects defaultChecked prop', () => {
        render(<CheckBox label="Default checked" defaultChecked />);
        
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
        
        fireEvent.click(checkbox);
        expect(checkbox).not.toBeChecked();
      });
    });
  });

  describe('disabled state', () => {
    it('applies disabled styling and behavior', () => {
      const handleChange = vi.fn();
      render(<CheckBox label="Disabled" disabled onChange={handleChange} />);
      
      const checkbox = screen.getByRole('checkbox');
      const label = checkbox.closest('label');
      
      expect(checkbox).toBeDisabled();
      expectElementToHaveClasses(checkbox, ['cursor-not-allowed', 'opacity-50']);
      expectElementToHaveClasses(label!, ['cursor-not-allowed', 'opacity-50']);
      
      fireEvent.click(checkbox);
      expect(handleChange).not.toHaveBeenCalled();
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('checkmark visibility', () => {
    const visibilityTests = [
      { checked: true, expectedOpacity: 'opacity-100', description: 'shows checkmark when checked' },
      { checked: false, expectedOpacity: 'opacity-0', description: 'hides checkmark when unchecked' }
    ];

    visibilityTests.forEach(({ checked, expectedOpacity, description }) => {
      it(description, () => {
        render(<CheckBox label="Test" checked={checked} onChange={vi.fn()} />);
        
        const checkmarkContainer = screen.getByRole('checkbox').parentElement?.querySelector(`.${expectedOpacity}`);
        expect(checkmarkContainer).toBeInTheDocument();
      });
    });
  });

  describe('integration and customization', () => {
    const customTests = [
      {
        name: 'applies custom className',
        props: { label: 'Custom', className: 'custom-class' },
        test: () => {
          const checkbox = screen.getByRole('checkbox');
          expect(checkbox).toHaveClass('custom-class');
        }
      },
      {
        name: 'uses custom testId',
        props: { label: 'Custom test', testId: 'custom-checkbox' },
        test: () => expect(screen.getByTestId('custom-checkbox')).toBeInTheDocument()
      },
      {
        name: 'passes through native props',
        props: { label: 'Native props', name: 'test-name', value: 'test-value' },
        test: () => {
          const checkbox = screen.getByRole('checkbox');
          expect(checkbox).toHaveAttribute('name', 'test-name');
          expect(checkbox).toHaveAttribute('value', 'test-value');
        }
      }
    ];

    customTests.forEach(({ name, props, test }) => {
      it(name, () => {
        render(<CheckBox {...props} />);
        test();
      });
    });

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

  describe('styling and accessibility', () => {
    it('applies base styles consistently', () => {
      render(<CheckBox label="Base styles" />);
      
      const checkbox = screen.getByRole('checkbox');
      expectElementToHaveClasses(checkbox, [
        'appearance-none', 'bg-background', 'border-text-primary', 'cursor-pointer'
      ]);
    });

    const focusTests = [
      {
        name: 'applies focus styles when enabled',
        props: { label: 'Focusable' },
        expectedClasses: ['focus:outline-none', 'focus:ring-2', 'focus:ring-primary'],
        shouldHave: true
      },
      {
        name: 'does not apply focus styles when disabled',
        props: { label: 'Disabled focus', disabled: true },
        expectedClasses: ['focus:outline-none', 'focus:ring-2', 'focus:ring-primary'],
        shouldHave: false
      }
    ];

    focusTests.forEach(({ name, props, expectedClasses, shouldHave }) => {
      it(name, () => {
        render(<CheckBox {...props} />);
        const checkbox = screen.getByRole('checkbox');
        
        expectedClasses.forEach(className => {
          if (shouldHave) {
            expect(checkbox).toHaveClass(className);
          } else {
            expect(checkbox).not.toHaveClass(className);
          }
        });
      });
    });
  });
});