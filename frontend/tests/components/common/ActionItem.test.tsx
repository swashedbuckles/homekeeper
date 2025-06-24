import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ActionItem } from '../../../src/components/common/ActionItem';

describe('ActionItem', () => {
  const defaultProps = {
    title: 'Test Action',
    actionText: 'Click Me',
    onAction: vi.fn()
  };

  it('renders title and action button', () => {
    render(<ActionItem {...defaultProps} />);
    
    expect(screen.getByText('Test Action')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<ActionItem {...defaultProps} subtitle="Test subtitle" />);
    
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<ActionItem {...defaultProps} />);
    
    expect(screen.queryByText('Test subtitle')).not.toBeInTheDocument();
  });

  it('calls onAction when button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnAction = vi.fn();
    
    render(<ActionItem {...defaultProps} onAction={mockOnAction} />);
    
    await user.click(screen.getByRole('button', { name: 'Click Me' }));
    expect(mockOnAction).toHaveBeenCalledTimes(1);
  });

  it('applies correct button variant', () => {
    render(<ActionItem {...defaultProps} actionVariant="primary" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');
  });

  it('uses default text variant when no actionVariant provided', () => {
    render(<ActionItem {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-primary');
  });
});
