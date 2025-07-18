import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ListItem } from '../../../src/components/common/ListItem';
import { Action } from '../../../src/components/common/Action';
import { Button } from '../../../src/components/common/Button';

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
    render(
      <ListItem {...defaultProps}>
        <Action variant="primary" onClick={() => {}}>Custom Action</Action>
      </ListItem>
    );
    
    expect(screen.getByRole('button', { name: 'Custom Action' })).toBeInTheDocument();
  });

  it('does not render actions section when not provided', () => {
    render(<ListItem {...defaultProps} />);
    
    // Should not have any buttons when no actions provided
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles multiple actions', () => {
    render(
      <ListItem {...defaultProps}>
        <Action variant="primary" onClick={() => {}}>Action 1</Action>
        <Action variant="outline" onClick={() => {}}>Action 2</Action>
      </ListItem>
    );
    
    expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument();
  });

  it('calls action handlers when actions are clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    
    render(
      <ListItem {...defaultProps}>
        <Action variant="primary" onClick={mockOnClick}>Click Me</Action>
      </ListItem>
    );
    
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

  // New composition pattern tests
  describe('Composition Pattern', () => {
    it('supports mixed Action and Button components', () => {
      render(
        <ListItem {...defaultProps}>
          <Action variant="primary" onClick={() => {}}>Action Button</Action>
          <Button variant="outline" size="sm" onClick={() => {}}>Regular Button</Button>
        </ListItem>
      );
      
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Regular Button' })).toBeInTheDocument();
    });

    it('validates children and filters out invalid components', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      render(
        <ListItem {...defaultProps}>
          <Action variant="primary" onClick={() => {}}>Valid Action</Action>
          <div>Invalid Child</div>
          <Button variant="outline" size="sm" onClick={() => {}}>Valid Button</Button>
        </ListItem>
      );
      
      // Valid components should render
      expect(screen.getByRole('button', { name: 'Valid Action' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Valid Button' })).toBeInTheDocument();
      
      // Invalid component should not render
      expect(screen.queryByText('Invalid Child')).not.toBeInTheDocument();
      
      // Should warn about invalid child
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('ListItem: Invalid child component <div>')
      );
      
      consoleSpy.mockRestore();
    });

    it('handles empty children gracefully', () => {
      render(<ListItem {...defaultProps} />);
      
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('handles multiple actions with proper spacing', () => {
      render(
        <ListItem {...defaultProps}>
          <Action variant="primary" onClick={() => {}}>Action 1</Action>
          <Action variant="secondary" onClick={() => {}}>Action 2</Action>
          <Action variant="outline" onClick={() => {}}>Action 3</Action>
        </ListItem>
      );
      
      const actionsContainer = screen.getByRole('button', { name: 'Action 1' }).parentElement;
      expect(actionsContainer).toHaveClass('flex', 'gap-2');
    });
  });

  // TypeScript validation tests (these would fail at compile time in real usage)
  describe('TypeScript Integration', () => {
    it('Action component uses correct default size', () => {
      render(
        <ListItem {...defaultProps}>
          <Action variant="primary" onClick={() => {}}>Test Action</Action>
        </ListItem>
      );
      
      const actionButton = screen.getByRole('button', { name: 'Test Action' });
      // Action should have small size by default (from Action component)
      expect(actionButton).toHaveClass('px-3 py-2', 'text-sm'); // sm size classes
    });

    it('Action component can override size', () => {
      render(
        <ListItem {...defaultProps}>
          <Action variant="primary" size="lg" onClick={() => {}}>Large Action</Action>
        </ListItem>
      );
      
      const actionButton = screen.getByRole('button', { name: 'Large Action' });
      // Should have large size classes
      expect(actionButton).toHaveClass('px-6 py-4', 'text-lg'); // lg size classes
    });
  });
});