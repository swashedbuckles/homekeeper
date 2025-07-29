import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ListItem } from '../../../src/components/common/ListItem';
import { Action } from '../../../src/components/common/Action';
import { Button } from '../../../src/components/common/Button';

describe('ListItem (Compound Component)', () => {
  const defaultProps = {
    title: 'Test ListItem'
  };

  describe('Basic Rendering', () => {
    it('renders title correctly', () => {
      render(<ListItem {...defaultProps} />);
      
      expect(screen.getByText('Test ListItem')).toBeInTheDocument();
    });

    it('renders subtitle when provided', () => {
      render(<ListItem {...defaultProps} subtitle="Test subtitle" />);
      
      expect(screen.getByText('Test subtitle')).toBeInTheDocument();
    });

    it('does not render subtitle when not provided', () => {
      render(<ListItem {...defaultProps} />);
      
      expect(screen.queryByText('Test subtitle')).not.toBeInTheDocument();
    });

    it('applies correct CSS classes for basic structure', () => {
      const { container } = render(<ListItem {...defaultProps} />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('flex', 'flex-col', 'md:flex-row', 'items-start', 'md:items-center', 'justify-between');
      expect(wrapper).toHaveClass('p-4', 'md:p-6', 'bg-white', 'font-mono');
    });

    it('applies correct title styling', () => {
      render(<ListItem {...defaultProps} />);
      
      const title = screen.getByText('Test ListItem');
      expect(title).toHaveClass('font-bold', 'text-lg', 'md:text-xl', 'uppercase', 'tracking-wide', 'mb-2');
    });

    it('applies correct subtitle styling when provided', () => {
      render(<ListItem {...defaultProps} subtitle="Test subtitle" />);
      
      const subtitle = screen.getByText('Test subtitle');
      expect(subtitle).toHaveClass('text-sm', 'font-bold', 'uppercase', 'tracking-wide');
    });
  });

  describe('Status Variants', () => {
    it('applies default status (no special border)', () => {
      const { container } = render(<ListItem {...defaultProps} status="default" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('border-4', 'md:border-6', 'border-text-primary');
      expect(wrapper).not.toHaveClass('border-l-8', 'border-l-12');
    });

    it('applies urgent status with red left border', () => {
      const { container } = render(<ListItem {...defaultProps} status="urgent" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('border-l-8', 'md:border-l-12', 'border-l-error');
    });

    it('applies completed status with green left border', () => {
      const { container } = render(<ListItem {...defaultProps} status="completed" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('border-l-8', 'md:border-l-12', 'border-l-accent');
    });

    it('applies info status with blue left border', () => {
      const { container } = render(<ListItem {...defaultProps} status="info" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('border-l-8', 'md:border-l-12', 'border-l-secondary');
    });
  });

  describe('Interactive Behavior', () => {
    it('handles click events when onClick is provided', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();
      
      render(<ListItem {...defaultProps} onClick={mockOnClick} />);
      
      const wrapper = screen.getByTestId('new-list-item');
      await user.click(wrapper);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('applies cursor-pointer when clickable', () => {
      const { container } = render(<ListItem {...defaultProps} onClick={() => {}} />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('cursor-pointer');
    });

    it('applies hover effects when hover prop is true', () => {
      const { container } = render(<ListItem {...defaultProps} hover />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('cursor-pointer');
    });

    it('does not apply interactive styles when not clickable', () => {
      const { container } = render(<ListItem {...defaultProps} />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).not.toHaveClass('cursor-pointer');
    });
  });

  describe('Avatar Compound Component', () => {
    it('renders avatar when provided', () => {
      render(
        <ListItem {...defaultProps}>
          <ListItem.Avatar color="primary">JD</ListItem.Avatar>
        </ListItem>
      );
      
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('does not render avatar section when not provided', () => {
      render(<ListItem {...defaultProps} />);
      
      // Avatar section should not exist
      expect(screen.queryByText('JD')).not.toBeInTheDocument();
    });

    it('applies correct avatar styling', () => {
      render(
        <ListItem {...defaultProps}>
          <ListItem.Avatar color="primary">JD</ListItem.Avatar>
        </ListItem>
      );
      
      const avatar = screen.getByText('JD');
      expect(avatar).toHaveClass(
        'w-12', 'h-12', 'md:w-16', 'md:h-16',
        'border-3', 'md:border-4', 'border-text-primary',
        'flex', 'items-center', 'justify-center',
        'text-lg', 'md:text-2xl', 'font-black',
        'flex-shrink-0',
        'bg-primary', 'text-white'
      );
    });

    it('applies different color variants correctly', () => {
      render(
        <ListItem {...defaultProps}>
          <ListItem.Avatar color="secondary">AB</ListItem.Avatar>
        </ListItem>
      );
      
      const avatar = screen.getByText('AB');
      expect(avatar).toHaveClass('bg-secondary', 'text-white');
    });

    it('handles emoji avatars', () => {
      render(
        <ListItem {...defaultProps}>
          <ListItem.Avatar color="accent">🔥</ListItem.Avatar>
        </ListItem>
      );
      
      expect(screen.getByText('🔥')).toBeInTheDocument();
    });
  });

  describe('Badge Compound Component', () => {
    it('renders single badge when provided', () => {
      render(
        <ListItem {...defaultProps}>
          <ListItem.Badge variant="primary">Urgent</ListItem.Badge>
        </ListItem>
      );
      
      expect(screen.getByText('Urgent')).toBeInTheDocument();
    });

    it('renders multiple badges when provided', () => {
      render(
        <ListItem {...defaultProps}>
          <ListItem.Badge variant="danger">Overdue</ListItem.Badge>
          <ListItem.Badge variant="secondary">High Priority</ListItem.Badge>
        </ListItem>
      );
      
      expect(screen.getByText('Overdue')).toBeInTheDocument();
      expect(screen.getByText('High Priority')).toBeInTheDocument();
    });

    it('does not render badges section when not provided', () => {
      render(<ListItem {...defaultProps} />);
      
      expect(screen.queryByText('Urgent')).not.toBeInTheDocument();
    });

    it('applies correct badge styling', () => {
      render(
        <ListItem {...defaultProps}>
          <ListItem.Badge variant="danger">Error</ListItem.Badge>
        </ListItem>
      );
      
      const badge = screen.getByText('Error');
      expect(badge).toHaveClass(
        'px-2', 'py-1',
        'border-2', 'border-text-primary',
        'font-black', 'text-xs',
        'uppercase',
        'inline-block',
        'bg-error', 'text-white'
      );
    });

    it('positions badges in flex container with gap', () => {
      render(
        <ListItem {...defaultProps}>
          <ListItem.Badge variant="primary">Badge 1</ListItem.Badge>
          <ListItem.Badge variant="secondary">Badge 2</ListItem.Badge>
        </ListItem>
      );
      
      const badge1 = screen.getByText('Badge 1');
      const badgesContainer = badge1.parentElement;
      expect(badgesContainer).toHaveClass('flex', 'flex-wrap', 'gap-2');
    });
  });

  describe('Actions Compound Component', () => {
    it('renders actions when provided', () => {
      render(
        <ListItem {...defaultProps}>
          <ListItem.Actions>
            <Action variant="primary">Complete</Action>
          </ListItem.Actions>
        </ListItem>
      );
      
      expect(screen.getByRole('button', { name: 'Complete' })).toBeInTheDocument();
    });

    it('renders multiple actions', () => {
      render(
        <ListItem {...defaultProps}>
          <ListItem.Actions>
            <Action variant="primary">Complete</Action>
            <Action variant="outline">Reschedule</Action>
          </ListItem.Actions>
        </ListItem>
      );
      
      expect(screen.getByRole('button', { name: 'Complete' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Reschedule' })).toBeInTheDocument();
    });

    it('does not render actions section when not provided', () => {
      render(<ListItem {...defaultProps} />);
      
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('handles action clicks correctly', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();
      
      render(
        <ListItem {...defaultProps}>
          <ListItem.Actions>
            <Action variant="primary" onClick={mockOnClick}>Click Me</Action>
          </ListItem.Actions>
        </ListItem>
      );
      
      await user.click(screen.getByRole('button', { name: 'Click Me' }));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('applies responsive layout classes', () => {
      render(
        <ListItem {...defaultProps}>
          <ListItem.Actions>
            <Action variant="primary">Action</Action>
          </ListItem.Actions>
        </ListItem>
      );
      
      const actionButton = screen.getByRole('button', { name: 'Action' });
      const actionsContainer = actionButton.parentElement;
      expect(actionsContainer).toHaveClass(
        'ml-6', 'flex-shrink-0', 'flex', 'gap-2',
        'flex-col', 'sm:flex-row'
      );
    });

    it('supports mixed Action and Button components', () => {
      render(
        <ListItem {...defaultProps}>
          <ListItem.Actions>
            <Action variant="primary">Action Button</Action>
            <Button variant="outline" size="sm">Regular Button</Button>
          </ListItem.Actions>
        </ListItem>
      );
      
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Regular Button' })).toBeInTheDocument();
    });
  });

  describe('Complex Compound Usage', () => {
    it('renders all compound components together', () => {
      render(
        <ListItem {...defaultProps} subtitle="Complex example" status="urgent">
          <ListItem.Avatar color="primary">JS</ListItem.Avatar>
          <ListItem.Badge variant="danger">Overdue</ListItem.Badge>
          <ListItem.Badge variant="secondary">High Priority</ListItem.Badge>
          <ListItem.Actions>
            <Action variant="primary">Primary Action</Action>
            <Action variant="outline">Secondary Action</Action>
          </ListItem.Actions>
        </ListItem>
      );
      
      // Check all elements are present
      expect(screen.getByText('Test ListItem')).toBeInTheDocument();
      expect(screen.getByText('Complex example')).toBeInTheDocument();
      expect(screen.getByText('JS')).toBeInTheDocument();
      expect(screen.getByText('Overdue')).toBeInTheDocument();
      expect(screen.getByText('High Priority')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Primary Action' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Secondary Action' })).toBeInTheDocument();
    });

    it('handles mixed interaction scenarios correctly', async () => {
      const user = userEvent.setup();
      const listItemClick = vi.fn();
      const actionClick = vi.fn();
      
      render(
        <ListItem {...defaultProps} onClick={listItemClick}>
          <ListItem.Avatar color="primary">JS</ListItem.Avatar>
          <ListItem.Actions>
            <Action variant="primary" onClick={(e) => { e.stopPropagation(); actionClick(); }}>
              Action
            </Action>
          </ListItem.Actions>
        </ListItem>
      );
      
      // Click the action button - should only trigger action click
      await user.click(screen.getByRole('button', { name: 'Action' }));
      expect(actionClick).toHaveBeenCalledTimes(1);
      expect(listItemClick).not.toHaveBeenCalled();
      
      // Click the avatar area - should trigger list item click
      await user.click(screen.getByText('JS'));
      expect(listItemClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Layout and Styling', () => {
    it('applies correct main content layout', () => {
      render(
        <ListItem {...defaultProps} subtitle="Test subtitle">
          <ListItem.Badge variant="primary">Badge</ListItem.Badge>
        </ListItem>
      );
      
      const title = screen.getByText('Test ListItem');
      const mainContent = title.closest('.flex-1');
      expect(mainContent).toHaveClass('flex-1');
    });

    it('positions avatar with correct spacing', () => {
      render(
        <ListItem {...defaultProps}>
          <ListItem.Avatar color="primary">AV</ListItem.Avatar>
        </ListItem>
      );
      
      const avatar = screen.getByText('AV');
      const avatarContainer = avatar.parentElement?.parentElement;
      expect(avatarContainer).toHaveClass('flex', 'flex-col', 'md:flex-row', 'items-start', 'md:items-center', 'justify-between');
      expect(avatarContainer).toHaveClass('p-4', 'md:p-6', 'bg-white', 'border-4', 'md:border-6', 'border-text-primary', 'font-mono');
    });

    it('handles responsive design classes correctly', () => {
      const { container } = render(<ListItem {...defaultProps} />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('p-4', 'md:p-6', 'border-4', 'md:border-6');
    });
  });

  describe('Accessibility', () => {
    it('applies correct test id', () => {
      render(<ListItem {...defaultProps} testId="custom-test-id" />);
      
      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
    });

    it('uses default test id when not provided', () => {
      render(<ListItem {...defaultProps} />);
      
      expect(screen.getByTestId('new-list-item')).toBeInTheDocument();
    });

    it('maintains semantic structure with headings and content', () => {
      render(
        <ListItem {...defaultProps} subtitle="Subtitle text">
          <ListItem.Avatar color="primary">AV</ListItem.Avatar>
          <ListItem.Badge variant="primary">Status</ListItem.Badge>
          <ListItem.Actions>
            <Action variant="primary">Action</Action>
          </ListItem.Actions>
        </ListItem>
      );
      
      // Title should be in a semantic heading-like div
      const title = screen.getByText('Test ListItem');
      expect(title).toHaveClass('font-bold', 'text-lg', 'md:text-xl', 'uppercase');
      
      // Actions should be properly labeled buttons
      const action = screen.getByRole('button', { name: 'Action' });
      expect(action).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children gracefully', () => {
      render(<ListItem {...defaultProps}>{null}</ListItem>);
      
      expect(screen.getByText('Test ListItem')).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('handles mixed valid and invalid children', () => {
      render(
        <ListItem {...defaultProps}>
          <ListItem.Avatar color="primary">AV</ListItem.Avatar>
          <div>Invalid child</div>
          <ListItem.Badge variant="primary">Valid Badge</ListItem.Badge>
        </ListItem>
      );
      
      // Valid components should render
      expect(screen.getByText('AV')).toBeInTheDocument();
      expect(screen.getByText('Valid Badge')).toBeInTheDocument();
      
      // Invalid component should be ignored silently (compound component pattern)
      expect(screen.queryByText('Invalid child')).not.toBeInTheDocument();
    });

    it('handles very long titles and subtitles', () => {
      const longTitle = 'This is a very long title that should handle text wrapping and layout correctly without breaking the component structure';
      const longSubtitle = 'This is a very long subtitle that should also handle text wrapping appropriately';
      
      render(<ListItem title={longTitle} subtitle={longSubtitle} />);
      
      expect(screen.getByText(longTitle)).toBeInTheDocument();
      expect(screen.getByText(longSubtitle)).toBeInTheDocument();
    });
  });
});