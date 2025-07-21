import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DefaultChoice } from '../../../src/components/variants/DefaultChoice';
import { Option } from '../../../src/components/form/Option';

describe('DefaultChoice', () => {
  it('renders with Button components', () => {
    render(
      <DefaultChoice name="test">
        <Option value="a">Option A</Option>
        <Option value="b">Option B</Option>
      </DefaultChoice>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('handles selection changes', () => {
    const onChange = vi.fn();
    
    render(
      <DefaultChoice name="test" onChange={onChange}>
        <Option value="a">Option A</Option>
        <Option value="b">Option B</Option>
      </DefaultChoice>
    );

    fireEvent.click(screen.getByText('Option A'));
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('shows selected state with accent variant', () => {
    render(
      <DefaultChoice name="test" value="a">
        <Option value="a">Option A</Option>
        <Option value="b">Option B</Option>
      </DefaultChoice>
    );

    const selectedButton = screen.getByText('Option A');
    const unselectedButton = screen.getByText('Option B');
    
    // Check that buttons have different styling classes
    expect(selectedButton.className).toContain('bg-accent');
    expect(unselectedButton.className).toContain('bg-white');
  });
});