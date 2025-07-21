import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Calendar, Wrench } from 'lucide-react';
import { IconChoice } from '../../../src/components/variants/IconChoice';
import { Option } from '../../../src/components/form/Option';

describe('IconChoice', () => {
  it('renders options with default icons', () => {
    render(
      <IconChoice name="frequency">
        <Option value="once">One Time</Option>
        <Option value="recurring">Recurring</Option>
      </IconChoice>
    );

    expect(screen.getByText('One Time')).toBeInTheDocument();
    expect(screen.getByText('Recurring')).toBeInTheDocument();
    
    // Should render SVG icons
    const svgs = screen.getAllByRole('button').map(btn => btn.querySelector('svg'));
    expect(svgs.filter(svg => svg !== null)).toHaveLength(2);
  });

  it('uses custom icon map when provided', () => {
    render(
      <IconChoice 
        name="category" 
        iconMap={{ 
          cleaning: Calendar, 
          maintenance: Wrench 
        }}
      >
        <Option value="cleaning">Cleaning</Option>
        <Option value="maintenance">Maintenance</Option>
      </IconChoice>
    );

    expect(screen.getByText('Cleaning')).toBeInTheDocument();
    expect(screen.getByText('Maintenance')).toBeInTheDocument();
  });

  it('handles selection with icon cards', () => {
    const onChange = vi.fn();
    
    render(
      <IconChoice name="frequency" onChange={onChange}>
        <Option value="once">One Time</Option>
        <Option value="recurring">Recurring</Option>
      </IconChoice>
    );

    fireEvent.click(screen.getByText('One Time'));
    expect(onChange).toHaveBeenCalledWith('once');
  });

  it('applies correct styling for selected state', () => {
    render(
      <IconChoice name="frequency" value="once">
        <Option value="once">One Time</Option>
        <Option value="recurring">Recurring</Option>
      </IconChoice>
    );

    const selectedCard = screen.getByText('One Time').closest('button');
    const unselectedCard = screen.getByText('Recurring').closest('button');
    
    expect(selectedCard?.className).toContain('bg-primary');
    expect(unselectedCard?.className).toContain('bg-white');
  });
});