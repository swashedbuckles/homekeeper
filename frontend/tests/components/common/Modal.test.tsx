import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Modal } from '../../../src/components/common/Modal';

// Mock createPortal to render in the current DOM for testing
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (children: React.ReactNode) => children,
  };
});

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    // Clear any document.body modifications before each test
    document.body.style.overflow = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Clean up after each test
    document.body.style.overflow = '';
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders modal content when isOpen is true', () => {
      render(<Modal {...defaultProps} />);
      
      expect(screen.getByText('Modal content')).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('does not render modal when isOpen is false', () => {
      render(<Modal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders modal with correct ARIA attributes', () => {
      render(
        <Modal {...defaultProps} ariaLabelledBy="modal-title">
          <h2 id="modal-title">Modal Title</h2>
          <div>Modal content</div>
        </Modal>
      );
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
      expect(modal).toHaveAttribute('tabIndex', '-1');
    });

    it('applies correct CSS classes for styling and z-index', () => {
      render(<Modal {...defaultProps} />);
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('fixed', 'inset-0', 'z-60');
    });
  });

  describe('Focus Management', () => {
    it('focuses the modal when opened', async () => {
      // Create a button to have initial focus
      const { rerender } = render(
        <div>
          <button>Outside button</button>
          <Modal {...defaultProps} isOpen={false} />
        </div>
      );
      
      const outsideButton = screen.getByText('Outside button');
      outsideButton.focus();
      expect(document.activeElement).toBe(outsideButton);
      
      // Open modal
      rerender(
        <div>
          <button>Outside button</button>
          <Modal {...defaultProps} isOpen={true} />
        </div>
      );
      
      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(document.activeElement).toBe(modal);
      });
    });

    it('restores focus to previous element when closed', async () => {
      // Create a button to have initial focus
      render(
        <div>
          <button>Outside button</button>
          <Modal {...defaultProps} isOpen={false} />
        </div>
      );
      
      const outsideButton = screen.getByText('Outside button');
      outsideButton.focus();
      
      // Store reference to focused element
      const originalFocus = document.activeElement;
      
      // Open and then close modal
      const { rerender } = render(
        <div>
          <button>Outside button</button>
          <Modal {...defaultProps} isOpen={true} />
        </div>
      );
      
      rerender(
        <div>
          <button>Outside button</button>
          <Modal {...defaultProps} isOpen={false} />
        </div>
      );
      
      await waitFor(() => {
        expect(document.activeElement).toBe(originalFocus);
      });
    });
  });

  describe('Body Scroll Prevention', () => {
    it('prevents body scroll when modal is open', () => {
      render(<Modal {...defaultProps} />);
      
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll when modal is closed', () => {
      const { rerender } = render(<Modal {...defaultProps} />);
      
      expect(document.body.style.overflow).toBe('hidden');
      
      rerender(<Modal {...defaultProps} isOpen={false} />);
      
      expect(document.body.style.overflow).toBe('');
    });

    it('cleans up body scroll on unmount', () => {
      const { unmount } = render(<Modal {...defaultProps} />);
      
      expect(document.body.style.overflow).toBe('hidden');
      
      unmount();
      
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Keyboard Navigation', () => {
    it('closes modal when Escape key is pressed', () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      
      const modal = screen.getByRole('dialog');
      fireEvent.keyDown(modal, { key: 'Escape' });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not close modal when other keys are pressed', () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      
      const modal = screen.getByRole('dialog');
      fireEvent.keyDown(modal, { key: 'Enter' });
      fireEvent.keyDown(modal, { key: 'Space' });
      fireEvent.keyDown(modal, { key: 'Tab' });
      
      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not close modal when Escape is pressed but onClose is not provided', () => {
      render(<Modal isOpen={true} children={<div>Content</div>} />);
      
      const modal = screen.getByRole('dialog');
      // Should not throw error
      expect(() => fireEvent.keyDown(modal, { key: 'Escape' })).not.toThrow();
    });
  });

  describe('Backdrop Click', () => {
    it('closes modal when backdrop area is clicked', () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      
      // The backdrop click handler is on the container div, not the backdrop div
      // Find the container div (has flex and items-center classes)
      const container = document.querySelector('.flex.items-center.justify-center');
      expect(container).toBeInTheDocument();
      
      if (container) {
        fireEvent.click(container);
        expect(onClose).toHaveBeenCalledTimes(1);
      }
    });

    it('does not close when clicking the backdrop div directly', () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      
      // Find the backdrop div (the one with backdrop-blur class)
      const backdrop = document.querySelector('.backdrop-blur-md');
      expect(backdrop).toBeInTheDocument();
      
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(onClose).not.toHaveBeenCalled();
      }
    });

    it('does not close modal when clicking inside the card content', () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      
      const content = screen.getByText('Modal content');
      fireEvent.click(content);
      
      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not close modal when backdrop area is clicked but onClose is not provided', () => {
      render(<Modal isOpen={true} children={<div>Content</div>} />);
      
      const container = document.querySelector('.flex.items-center.justify-center');
      
      if (container) {
        // Should not throw error
        expect(() => fireEvent.click(container)).not.toThrow();
      }
    });
  });

  describe('Accessibility', () => {
    it('has correct role and ARIA attributes', () => {
      render(<Modal {...defaultProps} ariaLabelledBy="test-title" />);
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('role', 'dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby', 'test-title');
    });

    it('works without ariaLabelledBy prop', () => {
      render(<Modal {...defaultProps} />);
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('role', 'dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).not.toHaveAttribute('aria-labelledby');
    });
  });

  describe('Integration with Card component', () => {
    it('renders children inside a Card component', () => {
      render(
        <Modal {...defaultProps}>
          <div data-testid="modal-content">Test content</div>
        </Modal>
      );
      
      const content = screen.getByTestId('modal-content');
      expect(content).toBeInTheDocument();
      
      // Check that Card component classes are present
      const cardElement = content.closest('[class*="bg-"]');
      expect(cardElement).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid open/close cycles', async () => {
      const onClose = vi.fn();
      const { rerender } = render(<Modal {...defaultProps} onClose={onClose} isOpen={false} />);
      
      // Rapidly toggle modal
      rerender(<Modal {...defaultProps} onClose={onClose} isOpen={true} />);
      rerender(<Modal {...defaultProps} onClose={onClose} isOpen={false} />);
      rerender(<Modal {...defaultProps} onClose={onClose} isOpen={true} />);
      
      // Should handle without errors
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('handles modal with complex content', () => {
      const complexContent = (
        <div>
          <h2>Modal Title</h2>
          <form>
            <input type="text" placeholder="Test input" />
            <button type="submit">Submit</button>
          </form>
          <div>
            <button>Cancel</button>
            <button>Confirm</button>
          </div>
        </div>
      );
      
      render(<Modal {...defaultProps}>{complexContent}</Modal>);
      
      expect(screen.getByText('Modal Title')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });
  });
});