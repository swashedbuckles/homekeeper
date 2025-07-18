import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TaskCard } from '../../../src/components/variations/TaskCard';
import { Action } from '../../../src/components/common/Action';
import { Button } from '../../../src/components/common/Button';

describe('TaskCard', () => {
  const defaultProps = {
    title: 'Change HVAC Filter',
    subtitle: 'Central Air System • Living Room',
    status: 'urgent' as const,
    dueDate: 'Due Tomorrow'
  };

  it('renders title, subtitle, and due date', () => {
    render(<TaskCard {...defaultProps} />);
    
    expect(screen.getByText('Change HVAC Filter')).toBeInTheDocument();
    expect(screen.getByText('Central Air System • Living Room')).toBeInTheDocument();
    expect(screen.getByText('Due Tomorrow')).toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(
      <TaskCard {...defaultProps}>
        <Action variant="danger" onClick={() => {}}>Mark Complete</Action>
      </TaskCard>
    );
    
    expect(screen.getByRole('button', { name: 'Mark Complete' })).toBeInTheDocument();
  });

  it('does not render actions section when not provided', () => {
    render(<TaskCard {...defaultProps} />);
    
    // Should not have any buttons when no actions provided
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles multiple actions', () => {
    render(
      <TaskCard {...defaultProps}>
        <Action variant="danger" onClick={() => {}}>Mark Complete</Action>
        <Action variant="outline" onClick={() => {}}>Reschedule</Action>
      </TaskCard>
    );
    
    expect(screen.getByRole('button', { name: 'Mark Complete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reschedule' })).toBeInTheDocument();
  });

  it('calls action handlers when actions are clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    
    render(
      <TaskCard {...defaultProps}>
        <Action variant="danger" onClick={mockOnClick}>Mark Complete</Action>
      </TaskCard>
    );
    
    await user.click(screen.getByRole('button', { name: 'Mark Complete' }));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct status-based border colors', () => {
    const { rerender, container } = render(<TaskCard {...defaultProps} status="urgent" />);
    let card = container.querySelector('[class*="border-l-error"]');
    expect(card).toBeInTheDocument();

    rerender(<TaskCard {...defaultProps} status="normal" />);
    card = container.querySelector('[class*="border-l-secondary"]');
    expect(card).toBeInTheDocument();

    rerender(<TaskCard {...defaultProps} status="future" />);
    card = container.querySelector('[class*="border-l-accent"]');
    expect(card).toBeInTheDocument();

    rerender(<TaskCard {...defaultProps} status="completed" />);
    card = container.querySelector('[class*="border-l-accent"]');
    expect(card).toBeInTheDocument();
  });

  it('applies correct title styling', () => {
    render(<TaskCard {...defaultProps} />);
    
    const title = screen.getByText('Change HVAC Filter');
    expect(title.tagName).toBe('H3');
    expect(title).toHaveClass('font-black', 'uppercase', 'text-text-primary');
  });

  it('applies correct subtitle styling', () => {
    render(<TaskCard {...defaultProps} />);
    
    const subtitle = screen.getByText('Central Air System • Living Room');
    expect(subtitle.tagName).toBe('P');
    expect(subtitle).toHaveClass('font-bold', 'text-text-secondary', 'uppercase');
  });

  it('applies correct due date styling based on status', () => {
    const { rerender } = render(<TaskCard {...defaultProps} status="urgent" />);
    let dueDate = screen.getByText('Due Tomorrow');
    expect(dueDate).toHaveClass('text-error');

    rerender(<TaskCard {...defaultProps} status="normal" />);
    dueDate = screen.getByText('Due Tomorrow');
    expect(dueDate).toHaveClass('text-secondary');

    rerender(<TaskCard {...defaultProps} status="future" />);
    dueDate = screen.getByText('Due Tomorrow');
    expect(dueDate).toHaveClass('text-accent');

    rerender(<TaskCard {...defaultProps} status="completed" />);
    dueDate = screen.getByText('Due Tomorrow');
    expect(dueDate).toHaveClass('text-accent');
  });

  // New composition pattern tests
  describe('Composition Pattern', () => {
    it('supports mixed Action and Button components', () => {
      render(
        <TaskCard {...defaultProps}>
          <Action variant="danger" onClick={() => {}}>Mark Complete</Action>
          <Button variant="outline" size="sm" onClick={() => {}}>Add Notes</Button>
        </TaskCard>
      );
      
      expect(screen.getByRole('button', { name: 'Mark Complete' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add Notes' })).toBeInTheDocument();
    });

    it('validates children and filters out invalid components', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      render(
        <TaskCard {...defaultProps}>
          <Action variant="danger" onClick={() => {}}>Valid Action</Action>
          <div>Invalid Child</div>
          <Button variant="outline" size="sm" onClick={() => {}}>Valid Button</Button>
        </TaskCard>
      );
      
      // Valid components should render
      expect(screen.getByRole('button', { name: 'Valid Action' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Valid Button' })).toBeInTheDocument();
      
      // Invalid component should not render
      expect(screen.queryByText('Invalid Child')).not.toBeInTheDocument();
      
      // Should warn about invalid child
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('TaskCard: Invalid child component <div>')
      );
      
      consoleSpy.mockRestore();
    });

    it('handles empty children gracefully', () => {
      render(<TaskCard {...defaultProps} />);
      
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('handles multiple actions with proper spacing', () => {
      render(
        <TaskCard {...defaultProps}>
          <Action variant="danger" onClick={() => {}}>Complete</Action>
          <Action variant="secondary" onClick={() => {}}>Reschedule</Action>
          <Action variant="outline" onClick={() => {}}>Skip</Action>
        </TaskCard>
      );
      
      const actionsContainer = screen.getByRole('button', { name: 'Complete' }).parentElement;
      expect(actionsContainer).toHaveClass('flex', 'flex-wrap', 'gap-3');
    });
  });

  // TypeScript validation tests (these would fail at compile time in real usage)
  describe('TypeScript Integration', () => {
    it('Action component uses correct default size', () => {
      render(
        <TaskCard {...defaultProps}>
          <Action variant="danger" onClick={() => {}}>Test Action</Action>
        </TaskCard>
      );
      
      const actionButton = screen.getByRole('button', { name: 'Test Action' });
      // Action should have small size by default (from Action component)
      expect(actionButton).toHaveClass('px-3 py-2', 'text-sm'); // sm size classes
    });

    it('Action component can override size', () => {
      render(
        <TaskCard {...defaultProps}>
          <Action variant="danger" size="lg" onClick={() => {}}>Large Action</Action>
        </TaskCard>
      );
      
      const actionButton = screen.getByRole('button', { name: 'Large Action' });
      // Should have large size classes
      expect(actionButton).toHaveClass('px-6 py-4', 'text-lg'); // lg size classes
    });

    it('passes all card props to underlying Card component', () => {
      render(
        <TaskCard 
          {...defaultProps} 
          shadow="double"
          hover
          hoverEffect="lift"
          className="custom-class"
          testId="custom-task-card"
        />
      );
      
      const card = screen.getByTestId('custom-task-card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('custom-class');
    });
  });
});