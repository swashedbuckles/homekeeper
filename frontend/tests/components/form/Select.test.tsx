import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Select, Option } from '../../../src/components/form/Select';

describe('Select Component', () => {
  it('renders with label and trigger button', () => {
    render(
      <Select label="Test Select">
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
        <Option value="option3">Option 3</Option>
      </Select>
    );

    expect(screen.getByText('Test Select')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /select/i })).toBeInTheDocument();
  });

  it('shows placeholder when no option is selected', () => {
    render(
      <Select 
        label="Test Select" 
        placeholder="Choose an option"
      >
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
      </Select>
    );

    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('opens dropdown when trigger is clicked', async () => {
    render(
      <Select 
        label="Test Select" 
        testId="test-select"
      >
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
        <Option value="option4">Option 4</Option>
      </Select>
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
          testId="test-select"
        >
          <Option value="option1">Option 1</Option>
          <Option value="option2">Option 2</Option>
        </Select>
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
        onChange={onChange}
        testId="test-select"
      >
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
        <Option value="option3">Option 3</Option>
      </Select>
    );

    const trigger = screen.getByTestId('test-select-trigger');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    const option1 = screen.getByRole('option', { name: 'Option 1' });
    fireEvent.click(option1);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('option1');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('shows error message when error prop is provided', () => {
    render(
      <Select 
        label="Test Select" 
        error="This field is required"
      >
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
      </Select>
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('shows validation feedback when provided', () => {
    render(
      <Select 
        label="Test Select" 
        validationFeedback="Selection saved successfully"
      >
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
      </Select>
    );

    expect(screen.getByText('Selection saved successfully')).toBeInTheDocument();
  });

  it('integrates with react-hook-form register', () => {
    const mockRegister = {
      name: 'testSelect',
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: vi.fn(),
    };

    render(
      <Select 
        label="Test Select" 
        register={mockRegister}
      >
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
      </Select>
    );

    expect(screen.getByDisplayValue('')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    render(
      <Select 
        label="Large Select" 
        size="lg"
        testId="large-select"
      >
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
      </Select>
    );

    const trigger = screen.getByTestId('large-select-trigger');
    expect(trigger).toHaveClass('text-lg');
  });

  it('renders with search variant', () => {
    render(
      <Select 
        label="Search Select" 
        variant="search"
        testId="search-select"
      >
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
      </Select>
    );

    const trigger = screen.getByTestId('search-select-trigger');
    expect(trigger).toHaveClass('bg-text-primary');
  });

  it('shows error styles when error is present', () => {
    render(
      <Select 
        label="Error Select" 
        error="Error message"
        testId="error-select"
      >
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
      </Select>
    );

    const trigger = screen.getByTestId('error-select-trigger');
    expect(trigger).toHaveClass('border-error');
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <Select 
        label="Disabled Select" 
        disabled={true}
        testId="disabled-select"
      >
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
      </Select>
    );

    const trigger = screen.getByTestId('disabled-select-trigger');
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveClass('opacity-50');
  });

  it('does not open dropdown when disabled', async () => {
    render(
      <Select 
        label="Disabled Select" 
        disabled={true}
        testId="disabled-select"
      >
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
      </Select>
    );

    const trigger = screen.getByTestId('disabled-select-trigger');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('closes dropdown on escape key', async () => {
    render(
      <Select 
        label="Test Select" 
        testId="test-select"
      >
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
      </Select>
    );

    const trigger = screen.getByTestId('test-select-trigger');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('displays selected option value in trigger', () => {
    render(
      <Select 
        label="Test Select" 
        value="option2"
        testId="test-select"
      >
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
        <Option value="option3">Option 3</Option>
      </Select>
    );

    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('shows placeholder when value is empty', () => {
    render(
      <Select 
        label="Test Select" 
        value=""
        placeholder="Select an option"
        testId="test-select"
      >
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
      </Select>
    );

    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('uses defaultValue for uncontrolled usage', async () => {
    const onChange = vi.fn();
    render(
      <Select 
        label="Test Select" 
        defaultValue="option2"
        onChange={onChange}
        testId="test-select"
      >
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
        <Option value="option3">Option 3</Option>
      </Select>
    );

    expect(screen.getByText('Option 2')).toBeInTheDocument();

    const trigger = screen.getByTestId('test-select-trigger');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    const option3 = screen.getByRole('option', { name: 'Option 3' });
    fireEvent.click(option3);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('option3');
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });
  });

  it('shows correct icon rotation when open/closed', async () => {
    render(
      <Select 
        label="Test Select" 
        testId="test-select"
      >
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
      </Select>
    );

    const trigger = screen.getByTestId('test-select-trigger');
    const icon = trigger.querySelector('div[class*="transition-transform"]');
    
    expect(icon).not.toHaveClass('rotate-180');

    fireEvent.click(trigger);

    await waitFor(() => {
      expect(icon).toHaveClass('rotate-180');
    });
  });

  it('calls react-hook-form onChange when option is selected', async () => {
    const mockRegister = {
      name: 'testSelect',
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: vi.fn(),
    };

    render(
      <Select 
        label="Test Select" 
        register={mockRegister}
        testId="test-select"
      >
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
      </Select>
    );

    const trigger = screen.getByTestId('test-select-trigger');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    const option1 = screen.getByRole('option', { name: 'Option 1' });
    fireEvent.click(option1);

    await waitFor(() => {
      expect(mockRegister.onChange).toHaveBeenCalledWith({
        target: { name: 'testSelect', value: 'option1' }
      });
    });
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(
      <Select 
        ref={ref}
        label="Test Select"
      >
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
      </Select>
    );

    expect(ref).toHaveBeenCalled();
  });

  describe('All size variants', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    
    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        render(
          <Select 
            label={`${size.toUpperCase()} Select`}
            size={size}
            testId={`${size}-select`}
          >
            <Option value="option1">Option 1</Option>
            <Option value="option2">Option 2</Option>
          </Select>
        );

        const trigger = screen.getByTestId(`${size}-select-trigger`);
        expect(trigger).toBeInTheDocument();
      });
    });
  });

  describe('Option states', () => {
    it('handles disabled options correctly', async () => {
      render(
        <Select 
          label="Test Select" 
          testId="test-select"
        >
          <Option value="option1">Option 1</Option>
          <Option value="option2" disabled>Disabled Option</Option>
        </Select>
      );

      const trigger = screen.getByTestId('test-select-trigger');
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const disabledOption = screen.getByRole('option', { name: 'Disabled Option' });
      expect(disabledOption).toHaveClass('opacity-50');
      expect(disabledOption).toBeDisabled();
    });

    it('shows selected option with correct styling', async () => {
      render(
        <Select 
          label="Test Select" 
          value="option1"
          testId="test-select"
        >
          <Option value="option1">Option 1</Option>
          <Option value="option2">Option 2</Option>
        </Select>
      );

      const trigger = screen.getByTestId('test-select-trigger');
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const selectedOption = screen.getByRole('option', { name: 'Option 1' });
      expect(selectedOption).toHaveAttribute('aria-selected', 'true');
    });

    it('does not select disabled options when clicked', async () => {
      const onChange = vi.fn();
      render(
        <Select 
          label="Test Select" 
          onChange={onChange}
          testId="test-select"
        >
          <Option value="option1">Option 1</Option>
          <Option value="option2" disabled>Disabled Option</Option>
        </Select>
      );

      const trigger = screen.getByTestId('test-select-trigger');
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const disabledOption = screen.getByRole('option', { name: 'Disabled Option' });
      fireEvent.click(disabledOption);

      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByRole('listbox')).toBeInTheDocument(); // Dropdown should still be open
    });

    it('extracts option data from children correctly', async () => {
      const onChange = vi.fn();
      render(
        <Select 
          label="Test Select" 
          onChange={onChange}
          testId="test-select"
        >
          <Option value="complex-value">Complex Option Text</Option>
          <Option value="simple">Simple</Option>
        </Select>
      );

      const trigger = screen.getByTestId('test-select-trigger');
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const complexOption = screen.getByRole('option', { name: 'Complex Option Text' });
      fireEvent.click(complexOption);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('complex-value');
      });
    });
  });
});