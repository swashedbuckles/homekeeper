import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChoiceCore } from '../../../src/components/common/ChoiceCore';
import type { OptionRenderProps } from '../../../src/components/common/ChoiceCore';
import { Option } from '../../../src/components/form/Option';

// Simple test renderer
const testRenderer = ({ option, isSelected, isDisabled, onClick }: OptionRenderProps) => (
  <button 
    onClick={onClick}
    disabled={isDisabled}
    className={isSelected ? 'selected' : 'unselected'}
  >
    {option.label}
  </button>
);

describe('ChoiceCore', () => {
  it('renders options using provided renderer', () => {
    render(
      <ChoiceCore name="test" renderOption={testRenderer}>
        <Option value="a">Option A</Option>
        <Option value="b">Option B</Option>
      </ChoiceCore>
    );

    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('handles single selection', () => {
    const onChange = vi.fn();
    
    render(
      <ChoiceCore name="test" renderOption={testRenderer} onChange={onChange}>
        <Option value="a">Option A</Option>
        <Option value="b">Option B</Option>
      </ChoiceCore>
    );

    fireEvent.click(screen.getByText('Option A'));
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('handles multiple selection', () => {
    const onChange = vi.fn();
    
    render(
      <ChoiceCore name="test" multiple renderOption={testRenderer} onChange={onChange}>
        <Option value="a">Option A</Option>
        <Option value="b">Option B</Option>
      </ChoiceCore>
    );

    fireEvent.click(screen.getByText('Option A'));
    expect(onChange).toHaveBeenCalledWith(['a']);
    
    fireEvent.click(screen.getByText('Option B'));
    expect(onChange).toHaveBeenCalledWith(['a', 'b']);
  });

  it('handles controlled value', () => {
    const onChange = vi.fn();
    
    const { rerender } = render(
      <ChoiceCore name="test" value="a" renderOption={testRenderer} onChange={onChange}>
        <Option value="a">Option A</Option>
        <Option value="b">Option B</Option>
      </ChoiceCore>
    );

    // Option A should be selected
    expect(screen.getByText('Option A')).toHaveClass('selected');
    expect(screen.getByText('Option B')).toHaveClass('unselected');

    // Click Option B
    fireEvent.click(screen.getByText('Option B'));
    expect(onChange).toHaveBeenCalledWith('b');

    // Rerender with new value
    rerender(
      <ChoiceCore name="test" value="b" renderOption={testRenderer} onChange={onChange}>
        <Option value="a">Option A</Option>
        <Option value="b">Option B</Option>
      </ChoiceCore>
    );

    // Option B should now be selected
    expect(screen.getByText('Option A')).toHaveClass('unselected');
    expect(screen.getByText('Option B')).toHaveClass('selected');
  });

  it('displays label when provided', () => {
    render(
      <ChoiceCore name="test" label="Test Label" renderOption={testRenderer}>
        <Option value="a">Option A</Option>
      </ChoiceCore>
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('displays error when provided', () => {
    render(
      <ChoiceCore name="test" error="Test error" renderOption={testRenderer}>
        <Option value="a">Option A</Option>
      </ChoiceCore>
    );

    expect(screen.getByText('⚠ Test error')).toBeInTheDocument();
  });

  it('handles disabled options', () => {
    const onChange = vi.fn();
    
    render(
      <ChoiceCore name="test" renderOption={testRenderer} onChange={onChange}>
        <Option value="a" disabled>Option A</Option>
        <Option value="b">Option B</Option>
      </ChoiceCore>
    );

    fireEvent.click(screen.getByText('Option A'));
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText('Option B'));
    expect(onChange).toHaveBeenCalledWith('b');
  });
});