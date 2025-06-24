import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Card } from '../../../src/components/common/Card';

describe('Card', () => {
  it('renders children content', () => {
    render(<Card>Test card content</Card>);
    
    expect(screen.getByText('Test card content')).toBeInTheDocument();
  });

  it('renders as div by default', () => {
    const { container } = render(<Card>Content</Card>);
    
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('renders as button when onClick is provided', () => {
    const mockOnClick = vi.fn();
    render(<Card onClick={mockOnClick}>Clickable content</Card>);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    const { container } = render(<Card>Content</Card>);
    
    const card = container.firstChild;
    expect(card).toHaveClass('bg-white', 'border-ui-border', 'shadow-sm');
  });

  it('applies subtle variant styles', () => {
    const { container } = render(<Card variant="subtle">Content</Card>);
    
    const card = container.firstChild;
    expect(card).toHaveClass('bg-background', 'border-ui-border');
  });

  it('applies correct padding styles', () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    
    const card = container.firstChild;
    expect(card).toHaveClass('p-8');
  });

  it('applies hover styles when clickable', () => {
    const { container } = render(<Card clickable>Content</Card>);
    
    const card = container.firstChild;
    expect(card).toHaveClass('hover:shadow-sm', 'transition-shadow', 'cursor-pointer');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    
    render(<Card onClick={mockOnClick}>Clickable</Card>);
    
    await user.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    
    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });
});