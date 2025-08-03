import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MobileMenuToggle } from '../../../src/components/headers/MobileMenuToggle';

// Helper function to render MobileMenuToggle with default props
const renderMobileMenuToggle = (props = {}) => {
  const defaultProps = {
    isOpen: false,
    setIsOpen: vi.fn()
  };
  return render(<MobileMenuToggle {...defaultProps} {...props} />);
};

// Helper function to get toggle button
const getToggleButton = () => screen.getByLabelText('Toggle menu');

describe('MobileMenuToggle', () => {
  const mockSetIsOpen = vi.fn();

  beforeEach(() => {
    mockSetIsOpen.mockClear();
  });

  it('renders toggle button with accessibility label', () => {
    render(<MobileMenuToggle isOpen={false} setIsOpen={mockSetIsOpen} />);
    
    const button = screen.getByLabelText('Toggle menu');
    expect(button).toBeInTheDocument();
  });

  it('calls setIsOpen when clicked', () => {
    render(<MobileMenuToggle isOpen={false} setIsOpen={mockSetIsOpen} />);
    
    const button = screen.getByLabelText('Toggle menu');
    fireEvent.click(button);
    
    expect(mockSetIsOpen).toHaveBeenCalledTimes(1);
    expect(mockSetIsOpen).toHaveBeenCalledWith(true);
  });

  it('toggles state correctly when already open', () => {
    render(<MobileMenuToggle isOpen={true} setIsOpen={mockSetIsOpen} />);
    
    const button = screen.getByLabelText('Toggle menu');
    fireEvent.click(button);
    
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it('applies default color variant styling', () => {
    render(<MobileMenuToggle isOpen={false} setIsOpen={mockSetIsOpen} />);
    
    const button = screen.getByLabelText('Toggle menu');
    expect(button).toHaveClass('bg-primary'); // default variant
  });

  it('applies secondary color variant when specified', () => {
    render(<MobileMenuToggle isOpen={false} setIsOpen={mockSetIsOpen} colorVariant="secondary" />);
    
    const button = screen.getByLabelText('Toggle menu');
    expect(button).toHaveClass('bg-secondary');
  });

  it('applies accent color variant when specified', () => {
    render(<MobileMenuToggle isOpen={false} setIsOpen={mockSetIsOpen} colorVariant="accent" />);
    
    const button = screen.getByLabelText('Toggle menu');
    expect(button).toHaveClass('bg-accent');
  });

  it('applies base styling classes', () => {
    render(<MobileMenuToggle isOpen={false} setIsOpen={mockSetIsOpen} />);
    
    const button = screen.getByLabelText('Toggle menu');
    expect(button).toHaveClass(
      'md:hidden',
      'w-10',
      'h-10',
      'border-0',
      'border-text-primary',
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'gap-1',
      'p-2',
      'transition-all',
      'duration-300'
    );
  });

  it('contains hamburger lines', () => {
    const { container } = render(<MobileMenuToggle isOpen={false} setIsOpen={mockSetIsOpen} />);
    
    // Should have 3 hamburger lines (divs with w-full class)
    const lines = container.querySelectorAll('div.w-full');
    expect(lines).toHaveLength(3);
  });

  it('applies correct styling to hamburger lines', () => {
    const { container } = render(<MobileMenuToggle isOpen={false} setIsOpen={mockSetIsOpen} />);
    
    const lines = container.querySelectorAll('div.w-full');
    lines.forEach(line => {
      expect(line).toHaveClass('w-full', 'h-0.5', 'bg-white', 'transition-all', 'duration-300');
    });
  });

  it('does not have open animation classes when closed', () => {
    const { getByLabelText } = render(<MobileMenuToggle isOpen={false} setIsOpen={mockSetIsOpen} />);
    
    const button = getByLabelText('Toggle menu');
    expect(button).not.toHaveClass('hamburger-open');
  });

  // Note: The animation classes for open state are typically handled by the parent component
  // or CSS animations, so we don't test those in unit tests
});