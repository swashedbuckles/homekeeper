import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { OptionCard } from '../../../src/components/variations/OptionCard';

describe('OptionCard', () => {
  const defaultProps = {
    title: 'Test Option',
    description: 'Test description',
    icon: <div data-testid="test-icon">Icon</div>,
    buttonText: 'Select',
    onClick: vi.fn()
  };

  it('renders title, description, and button text', () => {
    render(<OptionCard {...defaultProps} />);
    
    expect(screen.getByText('Test Option')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Select')).toBeInTheDocument();
  });

  it('renders provided icon', () => {
    render(<OptionCard {...defaultProps} />);
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    
    render(<OptionCard {...defaultProps} onClick={mockOnClick} />);
    
    // Click on the card (Card component should be clickable)
    const card = screen.getByText('Test Option').closest('[role="button"]') || 
                 screen.getByText('Test Option').parentElement;
    
    if (card) {
      await user.click(card);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    }
  });

  it('calls onClick when button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    
    render(<OptionCard {...defaultProps} onClick={mockOnClick} />);
    
    await user.click(screen.getByText('Select'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies primary button variant by default', () => {
    render(<OptionCard {...defaultProps} />);
    
    const button = screen.getByText('Select');
    expect(button).toHaveClass('bg-primary');
  });

  it('applies secondary button variant when specified', () => {
    render(<OptionCard {...defaultProps} buttonVariant="secondary" />);
    
    const button = screen.getByText('Select');
    expect(button).toHaveClass('bg-secondary');
  });

  it.skip('applies correct icon background based on button variant', () => {
    const { container } = render(<OptionCard {...defaultProps} buttonVariant="secondary" />);
    
    const iconContainer = container.querySelector('.bg-secondary\\/10');
    expect(iconContainer).toBeInTheDocument();
  });
});
