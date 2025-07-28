import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PriorityChoice } from '../../../src/components/variations/PriorityChoice';
import { Option } from '../../../src/components/form/Option';

describe('PriorityChoice', () => {
  it('renders priority options', () => {
    render(
      <PriorityChoice name="priority">
        <Option value="low">Low</Option>
        <Option value="medium">Medium</Option>
        <Option value="high">High</Option>
      </PriorityChoice>
    );

    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('applies correct color variants based on priority', () => {
    render(
      <PriorityChoice name="priority" value="high">
        <Option value="low">Low</Option>
        <Option value="medium">Medium</Option>
        <Option value="high">High</Option>
      </PriorityChoice>
    );

    const highButton = screen.getByText('High');
    const lowButton = screen.getByText('Low');
    
    // High priority should use danger (red) variant when selected
    expect(highButton.className).toContain('bg-error');
    // Unselected should use tertiary (white) variant
    expect(lowButton.className).toContain('bg-white');
  });

  it('handles priority selection', () => {
    const onChange = vi.fn();
    
    render(
      <PriorityChoice name="priority" onChange={onChange}>
        <Option value="low">Low</Option>
        <Option value="medium">Medium</Option>
        <Option value="high">High</Option>
      </PriorityChoice>
    );

    fireEvent.click(screen.getByText('Medium'));
    expect(onChange).toHaveBeenCalledWith('medium');
  });
});