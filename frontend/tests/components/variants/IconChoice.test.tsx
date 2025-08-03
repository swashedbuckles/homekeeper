import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Calendar, Wrench } from 'lucide-react';
import { IconChoice } from '../../../src/components/variations/IconChoice';
import { Option } from '../../../src/components/form/Option';

// Helper function to render IconChoice with standard options
const renderIconChoice = (props = {}, children?: React.ReactNode) => {
  const defaultChildren = [
    <Option key="once" value="once">One Time</Option>,
    <Option key="recurring" value="recurring">Recurring</Option>
  ];
  
  return render(
    <IconChoice name="frequency" {...props}>
      {children || defaultChildren}
    </IconChoice>
  );
};

// Helper function to get option elements
const getOptionElements = () => {
  return {
    oneTime: screen.getByText('One Time'),
    recurring: screen.getByText('Recurring'),
    allButtons: screen.getAllByRole('button')
  };
};

// Helper function to count SVG icons
const countSvgIcons = () => {
  const buttons = screen.getAllByRole('button');
  return buttons.map(btn => btn.querySelector('svg')).filter(svg => svg !== null).length;
};

describe('IconChoice', () => {
  const basicTests = [
    {
      name: 'renders options with default icons',
      test: () => {
        renderIconChoice();
        const { oneTime, recurring } = getOptionElements();
        
        expect(oneTime).toBeInTheDocument();
        expect(recurring).toBeInTheDocument();
        expect(countSvgIcons()).toBe(2);
      }
    },
    {
      name: 'uses custom icon map when provided',
      test: () => {
        const iconMap = { cleaning: Calendar, maintenance: Wrench };
        const children = [
          <Option key="cleaning" value="cleaning">Cleaning</Option>,
          <Option key="maintenance" value="maintenance">Maintenance</Option>
        ];
        
        render(
          <IconChoice name="category" iconMap={iconMap}>
            {children}
          </IconChoice>
        );
        
        expect(screen.getByText('Cleaning')).toBeInTheDocument();
        expect(screen.getByText('Maintenance')).toBeInTheDocument();
      }
    },
    {
      name: 'handles selection with icon cards',
      test: () => {
        const onChange = vi.fn();
        renderIconChoice({ onChange });
        const { oneTime } = getOptionElements();
        
        fireEvent.click(oneTime);
        expect(onChange).toHaveBeenCalledWith('once');
      }
    },
    {
      name: 'applies correct styling for selected state',
      test: () => {
        renderIconChoice({ value: 'once' });
        const selectedCard = screen.getByText('One Time').closest('button');
        const unselectedCard = screen.getByText('Recurring').closest('button');
        
        expect(selectedCard?.className).toContain('bg-primary');
        expect(unselectedCard?.className).toContain('bg-white');
      }
    }
  ];

  basicTests.forEach(({ name, test }) => {
    it(name, test);
  });
});