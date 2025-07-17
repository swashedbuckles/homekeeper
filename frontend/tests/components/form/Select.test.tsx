import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Select, type SelectOption } from '../../../src/components/form/Select';

const mockOptions: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3', disabled: true },
  { value: 'option4', label: 'Option 4' }
];

describe('Select Component', () => {
  it('renders with label and trigger button', () => {
    render(
      <Select 
        label="Test Select" 
        options={mockOptions}
      />
    );

    expect(screen.getByText('Test Select')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /select/i })).toBeInTheDocument();
  });

  it('shows placeholder when no option is selected', () => {
    render(
      <Select 
        label="Test Select" 
        options={mockOptions}
        placeholder="Choose an option"
      />
    );

    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('opens dropdown when trigger is clicked', async () => {
    render(
      <Select 
        label="Test Select" 
        options={mockOptions}
        testId="test-select"
      />
    );

    const trigger = screen.getByTestId('test-select-trigger');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option 4' })).toBeInTheDocument();
    });
  });

  it('closes dropdown when clicking outside', async () => {
    render(
      <div>
        <Select 
          label="Test Select" 
          options={mockOptions}
          testId="test-select"
        />
        <div data-testid="outside">Outside element</div>
      </div>
    );

    const trigger = screen.getByTestId('test-select-trigger');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    const outsideElement = screen.getByTestId('outside');
    fireEvent.mouseDown(outsideElement);

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('selects option when clicked', async () => {
    const onChange = vi.fn();
    render(
      <Select 
        label="Test Select" 
        options={mockOptions}
        onChange={onChange}
        testId="test-select"
      />
    );

    const trigger = screen.getByTestId('test-select-trigger');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    const option = screen.getByTestId('test-select-option-option2');
    fireEvent.click(option);

    expect(onChange).toHaveBeenCalledWith('option2');
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    render(
      <Select 
        label="Test Select" 
        options={mockOptions}
        error={errorMessage}
      />
    );

    expect(screen.getByText(`⚠ ${errorMessage}`)).toBeInTheDocument();
  });

  it('displays validation feedback when provided', () => {
    const feedbackContent = 'Selection saved successfully';
    render(
      <Select 
        label="Test Select" 
        options={mockOptions}
        validationFeedback={feedbackContent}
      />
    );

    expect(screen.getByText(feedbackContent)).toBeInTheDocument();
  });

  it('shows required indicator when register.required is true', () => {
    const mockRegister = {
      name: 'testSelect',
      required: true,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: vi.fn()
    };

    render(
      <Select 
        label="Test Select" 
        options={mockOptions}
        register={mockRegister}
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('applies correct size classes to trigger', () => {
    render(
      <Select 
        label="Large Select" 
        options={mockOptions}
        size="lg"
        testId="large-select"
      />
    );

    const trigger = screen.getByTestId('large-select-trigger');
    expect(trigger).toHaveClass('px-6', 'py-4', 'text-lg', 'border-brutal-lg');
  });

  it('applies search variant styles', () => {
    render(
      <Select 
        label="Search Select" 
        options={mockOptions}
        variant="search"
        testId="search-select"
      />
    );

    const trigger = screen.getByTestId('search-select-trigger');
    expect(trigger).toHaveClass('bg-text-primary', 'border-white', 'text-white');
  });

  it('applies error styles when error is present', () => {
    render(
      <Select 
        label="Error Select" 
        options={mockOptions}
        error="Error message"
        testId="error-select"
      />
    );

    const trigger = screen.getByTestId('error-select-trigger');
    expect(trigger).toHaveClass('border-error', 'focus:brutal-shadow-error');
  });

  it('handles disabled state correctly', () => {
    render(
      <Select 
        label="Disabled Select" 
        options={mockOptions}
        disabled
        testId="disabled-select"
      />
    );

    const trigger = screen.getByTestId('disabled-select-trigger');
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveClass('opacity-50', 'cursor-not-allowed');

    fireEvent.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('renders disabled options correctly', async () => {
    render(
      <Select 
        label="Test Select" 
        options={mockOptions}
        testId="test-select"
      />
    );

    const trigger = screen.getByTestId('test-select-trigger');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    const disabledOption = screen.getByTestId('test-select-option-option3');
    expect(disabledOption).toBeDisabled();
    expect(disabledOption).toHaveClass('opacity-50');
    expect(disabledOption).toHaveClass('cursor-not-allowed');
  });

  it('applies grouped styling when grouped prop is true', () => {
    const { container } = render(
      <Select 
        label="Grouped Select" 
        options={mockOptions}
        grouped
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('mb-4');
    expect(wrapper).not.toHaveClass('w-full');
  });

  it('rotates chevron icon when opened/closed', async () => {
    const { container } = render(
      <Select 
        label="Test Select" 
        options={mockOptions}
        testId="test-select"
      />
    );

    const trigger = screen.getByTestId('test-select-trigger');
    const chevronContainer = container.querySelector('.transition-transform');

    expect(chevronContainer).not.toHaveClass('rotate-180');

    fireEvent.click(trigger);
    await waitFor(() => {
      expect(chevronContainer).toHaveClass('rotate-180');
    });

    fireEvent.click(trigger);
    await waitFor(() => {
      expect(chevronContainer).not.toHaveClass('rotate-180');
    });
  });

  it('handles controlled value correctly', () => {
    const { rerender } = render(
      <Select 
        label="Controlled Select" 
        options={mockOptions}
        value="option1"
        testId="controlled-select"
      />
    );

    const trigger = screen.getByTestId('controlled-select-trigger');
    expect(trigger).toHaveTextContent('Option 1');

    rerender(
      <Select 
        label="Controlled Select" 
        options={mockOptions}
        value="option2"
        testId="controlled-select"
      />
    );

    expect(trigger).toHaveTextContent('Option 2');
  });

  it('handles uncontrolled value with defaultValue', async () => {
    const onChange = vi.fn();
    render(
      <Select 
        label="Uncontrolled Select" 
        options={mockOptions}
        defaultValue="option1"
        onChange={onChange}
        testId="uncontrolled-select"
      />
    );

    const trigger = screen.getByTestId('uncontrolled-select-trigger');
    expect(trigger).toHaveTextContent('Option 1');

    fireEvent.click(trigger);
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    const option = screen.getByTestId('uncontrolled-select-option-option2');
    fireEvent.click(option);

    expect(onChange).toHaveBeenCalledWith('option2');
    expect(trigger).toHaveTextContent('Option 2');
  });

  it('handles keyboard navigation - Escape key', async () => {
    render(
      <Select 
        label="Test Select" 
        options={mockOptions}
        testId="test-select"
      />
    );

    const trigger = screen.getByTestId('test-select-trigger');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('integrates with react-hook-form register', async () => {
    const mockRegister = {
      name: 'testSelect',
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: vi.fn()
    };

    render(
      <Select 
        label="Test Select" 
        options={mockOptions}
        register={mockRegister}
        testId="test-select"
      />
    );

    const trigger = screen.getByTestId('test-select-trigger');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    const option = screen.getByTestId('test-select-option-option2');
    fireEvent.click(option);

    expect(mockRegister.onChange).toHaveBeenCalledWith({
      target: { name: 'testSelect', value: 'option2' }
    });
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(
      <Select 
        ref={ref}
        label="Test Select" 
        options={mockOptions}
      />
    );

    expect(ref).toHaveBeenCalled();
  });

  describe('Size variants', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    
    it.each(sizes)('applies correct classes for %s size', (size) => {
      const sizeClassMap = {
        xs: ['px-2', 'py-1', 'text-xs', 'border-2'],
        sm: ['px-3', 'py-2', 'text-sm', 'border-brutal-sm'], 
        md: ['px-4', 'py-3', 'text-base', 'border-brutal-md'],
        lg: ['px-6', 'py-4', 'text-lg', 'border-brutal-lg'],
        xl: ['px-8', 'py-4', 'text-xl', 'border-brutal-lg']
      };

      render(
        <Select 
          label={`${size} Select`}
          options={mockOptions}
          size={size}
          testId={`${size}-select`}
        />
      );

      const trigger = screen.getByTestId(`${size}-select-trigger`);
      sizeClassMap[size].forEach(className => {
        expect(trigger).toHaveClass(className);
      });
    });
  });

  describe('Icon sizing', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    
    it.each(sizes)('sizes chevron icon correctly for %s size', (size) => {
      const { container } = render(
        <Select 
          label={`${size} Select`}
          options={mockOptions}
          size={size}
        />
      );

      const iconSizeMap = {
        xs: ['w-3', 'h-3'],
        sm: ['w-4', 'h-4'],
        md: ['w-5', 'h-5'],
        lg: ['w-6', 'h-6'],
        xl: ['w-8', 'h-8']
      };

      const chevronContainer = container.querySelector('.transition-transform');
      expect(chevronContainer).toBeInTheDocument();
      
      iconSizeMap[size].forEach(className => {
        expect(chevronContainer).toHaveClass(className);
      });
    });
  });

  describe('Accessibility', () => {
    it('associates label with hidden input via htmlFor and id', () => {
      render(
        <Select 
          label="Accessible Select" 
          options={mockOptions}
        />
      );

      const hiddenInput = document.getElementById('select-accessible-select');
      const label = screen.getByText('Accessible Select');
      
      expect(hiddenInput).toHaveAttribute('id', 'select-accessible-select');
      expect(label).toHaveAttribute('for', 'select-accessible-select');
    });

    it('provides proper ARIA attributes for dropdown', async () => {
      render(
        <Select 
          label="Test Select" 
          options={mockOptions}
          testId="test-select"
        />
      );

      const trigger = screen.getByTestId('test-select-trigger');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');

      fireEvent.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('provides proper ARIA attributes for options', async () => {
      render(
        <Select 
          label="Test Select" 
          options={mockOptions}
          value="option1"
          testId="test-select"
        />
      );

      const trigger = screen.getByTestId('test-select-trigger');
      fireEvent.click(trigger);

      await waitFor(() => {
        const selectedOption = screen.getByTestId('test-select-option-option1');
        const unselectedOption = screen.getByTestId('test-select-option-option2');
        
        expect(selectedOption).toHaveAttribute('aria-selected', 'true');
        expect(unselectedOption).toHaveAttribute('aria-selected', 'false');
      });
    });
  });

  describe('Option styling', () => {
    it('applies selected option styling correctly', async () => {
      render(
        <Select 
          label="Test Select" 
          options={mockOptions}
          value="option1"
          testId="test-select"
        />
      );

      const trigger = screen.getByTestId('test-select-trigger');
      fireEvent.click(trigger);

      await waitFor(() => {
        const selectedOption = screen.getByTestId('test-select-option-option1');
        expect(selectedOption).toHaveClass('bg-accent', 'text-white');
      });
    });

    it('applies hover effects to non-disabled options', async () => {
      render(
        <Select 
          label="Test Select" 
          options={mockOptions}
          testId="test-select"
        />
      );

      const trigger = screen.getByTestId('test-select-trigger');
      fireEvent.click(trigger);

      await waitFor(() => {
        const enabledOption = screen.getByTestId('test-select-option-option1');
        const disabledOption = screen.getByTestId('test-select-option-option3');
        
        expect(enabledOption).toHaveClass('brutal-hover-press-small');
        expect(disabledOption).not.toHaveClass('brutal-hover-press-small');
      });
    });
  });
});