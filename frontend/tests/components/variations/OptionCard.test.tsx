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
    onButtonClick: vi.fn()
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

  it('calls onClick when card is clicked (without button)', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    
    // Remove buttonText and onButtonClick so card becomes clickable
    const propsWithoutButton = {
      title: 'Test Option',
      description: 'Test description',
      icon: <div data-testid="test-icon">Icon</div>,
      onClick: mockOnClick
    };
    
    render(<OptionCard {...propsWithoutButton} />);
    
    // Click on the card
    const card = screen.getByTestId('card');
    await user.click(card);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnButtonClick = vi.fn();
    
    render(<OptionCard {...defaultProps} onButtonClick={mockOnButtonClick} />);
    
    await user.click(screen.getByText('Select'));
    expect(mockOnButtonClick).toHaveBeenCalledTimes(1);
  });

  it('applies outline button variant by default (not selected)', () => {
    render(<OptionCard {...defaultProps} />);
    
    const button = screen.getByText('Select');
    expect(button).toHaveClass('bg-transparent', 'border-text-primary');
  });

  it('applies primary button variant when selected', () => {
    render(<OptionCard {...defaultProps} selected={true} />);
    
    const button = screen.getByText('Select');
    expect(button).toHaveClass('bg-primary');
  });

  it.skip('applies correct icon background based on button variant', () => {
    const { container } = renderOptionCard();
    
    const iconContainer = container.querySelector('.bg-secondary\\/10');
    expect(iconContainer).toBeInTheDocument();
  });
});
