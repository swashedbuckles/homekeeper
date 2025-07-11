import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ListItem } from '../../../src/components/common/ListItem';

describe('ListItem', () => {
  const defaultProps = {
    title: 'Test Action'
  };

  it('renders title', () => {
    render(<ListItem {...defaultProps} />);
    
    expect(screen.getByText('Test Action')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<ListItem {...defaultProps} subtitle="Test subtitle" />);
    
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<ListItem {...defaultProps} />);
    
    expect(screen.queryByText('Test subtitle')).not.toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    const actions = <button>Custom Action</button>;
    render(<ListItem {...defaultProps} actions={actions} />);
    
    expect(screen.getByRole('button', { name: 'Custom Action' })).toBeInTheDocument();
  });

  it('does not render actions section when not provided', () => {
    render(<ListItem {...defaultProps} />);
    
    // Should not have any buttons when no actions provided
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles multiple actions', () => {
    const actions = (
      <div>
        <button>Action 1</button>
        <button>Action 2</button>
      </div>
    );
    render(<ListItem {...defaultProps} actions={actions} />);
    
    expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument();
  });

  it('calls action handlers when actions are clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    const actions = <button onClick={mockOnClick}>Click Me</button>;
    
    render(<ListItem {...defaultProps} actions={actions} />);
    
    await user.click(screen.getByRole('button', { name: 'Click Me' }));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<ListItem {...defaultProps} />);
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'items-center', 'justify-between', 'p-6', 'bg-white', 'border-brutal-lg', 'border-text-primary', 'font-mono');
  });

  it('applies correct title styling', () => {
    render(<ListItem {...defaultProps} />);
    
    const title = screen.getByText('Test Action');
    expect(title).toHaveClass('font-bold', 'text-xl', 'text-text-primary', 'uppercase', 'tracking-wide', 'mb-2');
  });

  it('applies correct subtitle styling when provided', () => {
    render(<ListItem {...defaultProps} subtitle="Test subtitle" />);
    
    const subtitle = screen.getByText('Test subtitle');
    expect(subtitle).toHaveClass('text-text-secondary', 'text-sm');
  });
});