import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChoiceCore } from '../../../src/components/common/ChoiceCore';
import type { OptionRenderProps } from '../../../src/components/common/ChoiceCore';
import { Option } from '../../../src/components/form/Option';
import type { AllowedOptionChildren } from '../../../src/lib/validation/children';

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

// Helper function to render ChoiceCore with standard options
const renderChoiceCore = (props = {}, children?: AllowedOptionChildren) => {
  const defaultChildren = [
    <Option key="a" value="a">Option A</Option>,
    <Option key="b" value="b">Option B</Option>
  ];
  
  return render(
    <ChoiceCore name="test" renderOption={testRenderer} {...props}>
      {children || defaultChildren}
    </ChoiceCore>
  );
};

// Helper function to get option elements
const getOptionElements = () => {
  return {
    optionA: screen.getByText('Option A'),
    optionB: screen.getByText('Option B')
  };
};

describe('ChoiceCore', () => {
  it('renders options using provided renderer', () => {
    renderChoiceCore();
    const { optionA, optionB } = getOptionElements();
    
    expect(optionA).toBeInTheDocument();
    expect(optionB).toBeInTheDocument();
  });

  const selectionTests = [
    {
      name: 'handles single selection',
      props: { onChange: vi.fn() },
      test: (props: any) => {
        renderChoiceCore(props);
        const { optionA } = getOptionElements();
        
        fireEvent.click(optionA);
        expect(props.onChange).toHaveBeenCalledWith('a');
      }
    },
    {
      name: 'handles multiple selection',
      props: { multiple: true, onChange: vi.fn() },
      test: (props: any) => {
        renderChoiceCore(props);
        const { optionA, optionB } = getOptionElements();
        
        fireEvent.click(optionA);
        expect(props.onChange).toHaveBeenCalledWith(['a']);
        
        fireEvent.click(optionB);
        expect(props.onChange).toHaveBeenCalledWith(['a', 'b']);
      }
    }
  ];

  selectionTests.forEach(({ name, props, test }) => {
    it(name, () => {
      test(props);
    });
  });

  it('handles controlled value', () => {
    const onChange = vi.fn();
    
    const { rerender } = render(
      <ChoiceCore name="test" value="a" renderOption={testRenderer} onChange={onChange}>
        <Option value="a">Option A</Option>
        <Option value="b">Option B</Option>
      </ChoiceCore>
    );

    // Initial state - Option A should be selected
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

  const displayTests = [
    {
      name: 'displays label when provided',
      props: { label: 'Test Label' },
      expectedText: 'Test Label'
    },
    {
      name: 'displays error when provided',
      props: { error: 'Test error' },
      expectedText: '⚠ Test error'
    }
  ];

  displayTests.forEach(({ name, props, expectedText }) => {
    it(name, () => {
      const children = [<Option key="a" value="a">Option A</Option>];
      renderChoiceCore(props, children);
      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });
  });

  it('handles disabled options', () => {
    const onChange = vi.fn();
    const children = [
      <Option key="a" value="a" disabled>Option A</Option>,
      <Option key="b" value="b">Option B</Option>
    ];
    
    renderChoiceCore({ onChange }, children);
    const { optionA, optionB } = getOptionElements();

    fireEvent.click(optionA);
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(optionB);
    expect(onChange).toHaveBeenCalledWith('b');
  });
});