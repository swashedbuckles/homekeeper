import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router';
import { TextLink } from '../../../src/components/common/TextLink';

// Wrapper for React Router tests
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('TextLink', () => {
  it('renders children correctly', () => {
    render(<TextLink href="#">Test Link</TextLink>);
    expect(screen.getByText('Test Link')).toBeInTheDocument();
  });

  it('renders with default props as external link', () => {
    render(<TextLink href="#">Default Link</TextLink>);
    const link = screen.getByTestId('text-link');
    
    expect(link.tagName).toBe('A');
    expect(link).toHaveClass('text-primary', 'text-base', 'border-b-4');
  });

  describe('routing behavior', () => {
    it('renders as React Router Link when "to" prop is provided', () => {
      render(
        <RouterWrapper>
          <TextLink to="/internal">Internal Link</TextLink>
        </RouterWrapper>
      );
      
      const link = screen.getByTestId('text-link');
      expect(link.tagName).toBe('A'); // React Router Link renders as <a>
      expect(link).toHaveAttribute('href', '/internal');
    });

    it('renders as <a> tag when "href" prop is provided', () => {
      render(<TextLink href="https://example.com">External Link</TextLink>);
      
      const link = screen.getByTestId('text-link');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('renders as <a> tag when only onClick is provided', () => {
      const mockClick = vi.fn();
      render(<TextLink onClick={mockClick}>Click Handler</TextLink>);
      
      const link = screen.getByTestId('text-link');
      expect(link.tagName).toBe('A');
      expect(link).not.toHaveAttribute('href');
    });
  });

  describe('variants', () => {
    it('renders primary variant correctly', () => {
      render(<TextLink variant="primary" href="#">Primary</TextLink>);
      const link = screen.getByTestId('text-link');
      
      expect(link).toHaveClass('text-primary', 'border-primary');
    });

    it('renders secondary variant correctly', () => {
      render(<TextLink variant="secondary" href="#">Secondary</TextLink>);
      const link = screen.getByTestId('text-link');
      
      expect(link).toHaveClass('text-secondary', 'border-secondary');
    });

    it('renders subtle variant correctly', () => {
      render(<TextLink variant="subtle" href="#">Subtle</TextLink>);
      const link = screen.getByTestId('text-link');
      
      expect(link).toHaveClass('text-text-secondary', 'border-text-secondary');
    });

    it('renders danger variant correctly', () => {
      render(<TextLink variant="danger" href="#">Danger</TextLink>);
      const link = screen.getByTestId('text-link');
      
      expect(link).toHaveClass('text-error', 'border-error');
    });
  });

  describe('sizes', () => {
    it('renders small size correctly', () => {
      render(<TextLink size="small" href="#">Small</TextLink>);
      const link = screen.getByTestId('text-link');
      
      expect(link).toHaveClass('text-sm', 'border-b-2');
    });

    it('renders medium size correctly', () => {
      render(<TextLink size="medium" href="#">Medium</TextLink>);
      const link = screen.getByTestId('text-link');
      
      expect(link).toHaveClass('text-base', 'border-b-4');
    });

    it('renders large size correctly', () => {
      render(<TextLink size="large" href="#">Large</TextLink>);
      const link = screen.getByTestId('text-link');
      
      expect(link).toHaveClass('text-lg', 'border-b-4');
    });
  });

  describe('target prop', () => {
    it('applies target="_blank" correctly', () => {
      render(<TextLink href="https://example.com" target="_blank">External</TextLink>);
      const link = screen.getByTestId('text-link');
      
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('does not add rel attribute for non-blank targets', () => {
      render(<TextLink href="#" target="_self">Self</TextLink>);
      const link = screen.getByTestId('text-link');
      
      expect(link).toHaveAttribute('target', '_self');
      expect(link).not.toHaveAttribute('rel');
    });
  });

  describe('onClick behavior', () => {
    it('calls onClick handler when provided', () => {
      const mockClick = vi.fn();
      render(<TextLink onClick={mockClick} href="#">Click Me</TextLink>);
      
      fireEvent.click(screen.getByTestId('text-link'));
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it('prevents default when onClick is provided', () => {
      const mockClick = vi.fn();
      render(<TextLink onClick={mockClick} href="#">Click Me</TextLink>);
      
      const link = screen.getByTestId('text-link');
      const clickEvent = new MouseEvent('click', { bubbles: true });
      const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
      
      fireEvent(link, clickEvent);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('works with React Router Link and onClick', () => {
      const mockClick = vi.fn();
      render(
        <RouterWrapper>
          <TextLink to="/test" onClick={mockClick}>Router Link</TextLink>
        </RouterWrapper>
      );
      
      fireEvent.click(screen.getByTestId('text-link'));
      expect(mockClick).toHaveBeenCalledTimes(1);
    });
  });

  it('applies custom className', () => {
    render(<TextLink className="custom-class" href="#">Custom</TextLink>);
    const link = screen.getByTestId('text-link');
    
    expect(link).toHaveClass('custom-class');
  });

  it('uses custom testId', () => {
    render(<TextLink testId="custom-link" href="#">Custom Test ID</TextLink>);
    
    expect(screen.getByTestId('custom-link')).toBeInTheDocument();
  });

  it('applies base styles consistently', () => {
    render(<TextLink href="#">Base Styles</TextLink>);
    const link = screen.getByTestId('text-link');
    
    expect(link).toHaveClass(
      'font-mono',
      'font-bold',
      'uppercase',
      'tracking-wide',
      'cursor-pointer',
      'transition-all',
      'duration-100',
      'ease-in-out',
      'border-b-4'
    );
  });

  describe('real-world usage examples', () => {
    it('renders footer privacy link correctly', () => {
      render(
        <TextLink href="#" variant="subtle" className="text-white hover:text-primary">
          Privacy
        </TextLink>
      );
      
      const link = screen.getByText('Privacy');
      expect(link).toHaveClass('text-text-secondary', 'text-white', 'hover:text-primary');
    });

    it('renders internal navigation link', () => {
      render(
        <RouterWrapper>
          <TextLink to="/manuals" variant="primary" size="large">
            View All Manuals
          </TextLink>
        </RouterWrapper>
      );
      
      const link = screen.getByText('View All Manuals');
      expect(link).toHaveClass('text-primary', 'text-lg');
      expect(link).toHaveAttribute('href', '/manuals');
    });

    it('renders external documentation link', () => {
      render(
        <TextLink href="https://docs.example.com" variant="secondary" target="_blank">
          External Documentation
        </TextLink>
      );
      
      const link = screen.getByText('External Documentation');
      expect(link).toHaveClass('text-secondary');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders clickable action link', () => {
      const mockAction = vi.fn();
      render(
        <TextLink onClick={mockAction} variant="danger" size="small">
          Delete Item
        </TextLink>
      );
      
      const link = screen.getByText('Delete Item');
      expect(link).toHaveClass('text-error', 'text-sm');
      
      fireEvent.click(link);
      expect(mockAction).toHaveBeenCalled();
    });
  });
});