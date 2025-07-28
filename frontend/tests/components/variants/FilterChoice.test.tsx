import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterChoice } from '../../../src/components/variations/FilterChoice';
import { Option } from '../../../src/components/form/Option';

describe('FilterChoice', () => {
  it('renders filter options', () => {
    render(
      <FilterChoice name="filters">
        <Option value="all">All</Option>
        <Option value="active">Active</Option>
        <Option value="completed">Completed</Option>
      </FilterChoice>
    );

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('handles multiple filter selection', () => {
    const onChange = vi.fn();
    
    render(
      <FilterChoice name="filters" multiple onChange={onChange}>
        <Option value="active">Active</Option>
        <Option value="completed">Completed</Option>
      </FilterChoice>
    );

    fireEvent.click(screen.getByText('Active'));
    expect(onChange).toHaveBeenCalledWith(['active']);

    fireEvent.click(screen.getByText('Completed'));
    expect(onChange).toHaveBeenCalledWith(['active', 'completed']);
  });

  it('applies secondary (blue) variant for selected filters', () => {
    render(
      <FilterChoice name="filters" value={['active']}>
        <Option value="active">Active</Option>
        <Option value="completed">Completed</Option>
      </FilterChoice>
    );

    const activeButton = screen.getByText('Active');
    const completedButton = screen.getByText('Completed');
    
    // Selected filter should use secondary (blue) variant
    expect(activeButton.className).toContain('bg-secondary');
    // Unselected should use tertiary (white) variant
    expect(completedButton.className).toContain('bg-white');
  });
});