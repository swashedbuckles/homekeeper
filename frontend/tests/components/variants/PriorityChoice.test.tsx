import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PriorityChoice } from '../../../src/components/variations/PriorityChoice';
import { Option } from '../../../src/components/form/Option';

// Helper function to render PriorityChoice with standard options
const renderPriorityChoice = (props = {}) => {
  return render(
    <PriorityChoice name="priority" {...props}>
      <Option value="low">Low</Option>
      <Option value="medium">Medium</Option>
      <Option value="high">High</Option>
    </PriorityChoice>
  );
};

// Helper function to get priority buttons
const getPriorityButtons = () => {
  return {
    low: screen.getByText('Low'),
    medium: screen.getByText('Medium'),
    high: screen.getByText('High')
  };
};

describe('PriorityChoice', () => {
  const priorityTests = [
    {
      name: 'renders priority options',
      test: () => {
        renderPriorityChoice();
        const { low, medium, high } = getPriorityButtons();
        
        expect(low).toBeInTheDocument();
        expect(medium).toBeInTheDocument();
        expect(high).toBeInTheDocument();
      }
    },
    {
      name: 'applies correct color variants based on priority',
      test: () => {
        renderPriorityChoice({ value: 'high' });
        const { high, low } = getPriorityButtons();
        
        expect(high.className).toContain('bg-error');
        expect(low.className).toContain('bg-white');
      }
    },
    {
      name: 'handles priority selection',
      test: () => {
        const onChange = vi.fn();
        renderPriorityChoice({ onChange });
        const { medium } = getPriorityButtons();
        
        fireEvent.click(medium);
        expect(onChange).toHaveBeenCalledWith('medium');
      }
    }
  ];

  priorityTests.forEach(({ name, test }) => {
    it(name, test);
  });
});