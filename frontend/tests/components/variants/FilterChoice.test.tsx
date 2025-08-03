import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterChoice } from '../../../src/components/variations/FilterChoice';
import { Option } from '../../../src/components/form/Option';

// Helper function to render FilterChoice with standard options
const renderFilterChoice = (props = {}, children?: React.ReactNode) => {
  const defaultChildren = [
    <Option key="all" value="all">All</Option>,
    <Option key="active" value="active">Active</Option>,
    <Option key="completed" value="completed">Completed</Option>
  ];
  
  return render(
    <FilterChoice name="filters" {...props}>
      {children || defaultChildren}
    </FilterChoice>
  );
};

// Helper function to get filter buttons
const getFilterButtons = () => {
  return {
    all: screen.getByText('All'),
    active: screen.getByText('Active'),
    completed: screen.getByText('Completed')
  };
};

describe('FilterChoice', () => {
  it('renders filter options', () => {
    renderFilterChoice();
    const { all, active, completed } = getFilterButtons();
    
    expect(all).toBeInTheDocument();
    expect(active).toBeInTheDocument();
    expect(completed).toBeInTheDocument();
  });

  it('handles multiple filter selection', () => {
    const onChange = vi.fn();
    const children = [
      <Option key="active" value="active">Active</Option>,
      <Option key="completed" value="completed">Completed</Option>
    ];
    
    renderFilterChoice({ multiple: true, onChange }, children);
    const active = screen.getByText('Active');
    const completed = screen.getByText('Completed');

    fireEvent.click(active);
    expect(onChange).toHaveBeenCalledWith(['active']);

    fireEvent.click(completed);
    expect(onChange).toHaveBeenCalledWith(['active', 'completed']);
  });

  const stylingTests = [
    {
      name: 'applies secondary (blue) variant for selected filters',
      props: { value: ['active'] },
      expectedClasses: {
        active: 'bg-secondary',
        completed: 'bg-white'
      }
    }
  ];

  stylingTests.forEach(({ name, props, expectedClasses }) => {
    it(name, () => {
      const children = [
        <Option key="active" value="active">Active</Option>,
        <Option key="completed" value="completed">Completed</Option>
      ];
      
      renderFilterChoice(props, children);
      const active = screen.getByText('Active');
      const completed = screen.getByText('Completed');
      
      expect(active.className).toContain(expectedClasses.active);
      expect(completed.className).toContain(expectedClasses.completed);
    });
  });
});