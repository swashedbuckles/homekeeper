import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DefaultChoice } from '../../../src/components/variations/DefaultChoice';
import { Option } from '../../../src/components/form/Option';

// Helper function to render DefaultChoice with standard options
const renderDefaultChoice = (props = {}) => {
  return render(
    <DefaultChoice name="test" {...props}>
      <Option value="a">Option A</Option>
      <Option value="b">Option B</Option>
    </DefaultChoice>
  );
};

// Helper function to get option buttons
const getOptionButtons = () => {
  return {
    optionA: screen.getByText('Option A'),
    optionB: screen.getByText('Option B'),
    allButtons: screen.getAllByRole('button')
  };
};

describe('DefaultChoice', () => {
  const basicTests = [
    {
      name: 'renders with Button components',
      test: () => {
        renderDefaultChoice();
        const { allButtons, optionA, optionB } = getOptionButtons();
        expect(allButtons).toHaveLength(2);
        expect(optionA).toBeInTheDocument();
        expect(optionB).toBeInTheDocument();
      }
    },
    {
      name: 'handles selection changes',
      test: () => {
        const onChange = vi.fn();
        renderDefaultChoice({ onChange });
        const { optionA } = getOptionButtons();
        
        fireEvent.click(optionA);
        expect(onChange).toHaveBeenCalledWith('a');
      }
    },
    {
      name: 'shows selected state with accent variant',
      test: () => {
        renderDefaultChoice({ value: 'a' });
        const { optionA, optionB } = getOptionButtons();
        
        expect(optionA.className).toContain('bg-accent');
        expect(optionB.className).toContain('bg-white');
      }
    }
  ];

  basicTests.forEach(({ name, test }) => {
    it(name, test);
  });
});