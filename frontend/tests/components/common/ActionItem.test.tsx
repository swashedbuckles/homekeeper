import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ActionItem } from '../../../src/components/common/ActionItem';

describe('ActionItem', () => {
  const defaultProps = {
    title: 'Test Action'
  };

  it('renders title', () => {
    render(<ActionItem {...defaultProps} />);
    
    expect(screen.getByText('Test Action')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<ActionItem {...defaultProps} subtitle="Test subtitle" />);
    
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<ActionItem {...defaultProps} />);
    
    expect(screen.queryByText('Test subtitle')).not.toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    const actions = <button>Custom Action</button>;
    render(<ActionItem {...defaultProps} actions={actions} />);
    
    expect(screen.getByRole('button', { name: 'Custom Action' })).toBeInTheDocument();
  });

  it('does not render actions section when not provided', () => {
    render(<ActionItem {...defaultProps} />);
    
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
    render(<ActionItem {...defaultProps} actions={actions} />);
    
    expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument();
  });

  it('calls action handlers when actions are clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    const actions = <button onClick={mockOnClick}>Click Me</button>;
    
    render(<ActionItem {...defaultProps} actions={actions} />);
    
    await user.click(screen.getByRole('button', { name: 'Click Me' }));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<ActionItem {...defaultProps} />);
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'items-center', 'justify-between', 'p-2', 'bg-background', 'rounded-lg');
  });

  it('applies correct title styling', () => {
    render(<ActionItem {...defaultProps} />);
    
    const title = screen.getByText('Test Action');
    expect(title).toHaveClass('font-mono', 'text-lg', 'font-semibold', 'text-text-primary');
  });

  it('applies correct subtitle styling when provided', () => {
    render(<ActionItem {...defaultProps} subtitle="Test subtitle" />);
    
    const subtitle = screen.getByText('Test subtitle');
    expect(subtitle).toHaveClass('text-text-secondary', 'text-sm');
  });
});