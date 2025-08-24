import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HOUSEHOLD_ROLE } from '@homekeeper/shared';

import { InviteForm } from '../../../src/components/fragments/InviteForm';

describe('InviteForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderInviteForm = (props = {}) => {
    const defaultProps = {
      onSubmit: mockOnSubmit,
      isLoading: false
    };
    
    return render(<InviteForm {...defaultProps} {...props} />);
  };

  describe('rendering', () => {
    it('should render all form fields', () => {
      renderInviteForm();

      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByText('Initial Role *')).toBeInTheDocument();
      expect(screen.getByLabelText(/personal message/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send invitation/i })).toBeInTheDocument();
    });

    it('should have correct default values', () => {
      renderInviteForm();

      const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
      const messageTextarea = screen.getByLabelText(/personal message/i) as HTMLTextAreaElement;

      expect(emailInput.value).toBe('');
      expect(messageTextarea.value).toBe('');
    });

    it('should show loading state when isLoading is true', () => {
      renderInviteForm({ isLoading: true });

      const submitButton = screen.getByRole('button', { name: /sending/i });
      expect(submitButton).toBeDisabled();
      
      const emailInput = screen.getByLabelText(/email address/i);
      const messageTextarea = screen.getByLabelText(/personal message/i);
      
      expect(emailInput).toBeDisabled();
      expect(messageTextarea).toBeDisabled();
    });
  });

  describe('form validation', () => {
    it('should prevent submission with invalid email', async () => {
      renderInviteForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', { name: /send invitation/i });

      // Enter invalid email
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(submitButton);

      // Form validation should prevent submission
      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('form submission', () => {
    it('should submit form with valid email and default role', async () => {
      renderInviteForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', { name: /send invitation/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          role: HOUSEHOLD_ROLE.GUEST
        });
      });
    });

    it('should submit form with default guest role', async () => {
      renderInviteForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', { name: /send invitation/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          role: HOUSEHOLD_ROLE.GUEST
        });
      });
    });

    it('should include personal message when provided', async () => {
      renderInviteForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const messageTextarea = screen.getByLabelText(/personal message/i);
      const submitButton = screen.getByRole('button', { name: /send invitation/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(messageTextarea, { target: { value: 'Please join our household!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          role: HOUSEHOLD_ROLE.GUEST,
          message: 'Please join our household!'
        });
      });
    });

    it('should trim whitespace from inputs', async () => {
      renderInviteForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const messageTextarea = screen.getByLabelText(/personal message/i);
      const submitButton = screen.getByRole('button', { name: /send invitation/i });

      fireEvent.change(emailInput, { target: { value: '  test@example.com  ' } });
      fireEvent.change(messageTextarea, { target: { value: '  Hello!  ' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          role: HOUSEHOLD_ROLE.GUEST,
          message: 'Hello!'
        });
      });
    });

    it('should not include message field if empty or whitespace only', async () => {
      renderInviteForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const messageTextarea = screen.getByLabelText(/personal message/i);
      const submitButton = screen.getByRole('button', { name: /send invitation/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(messageTextarea, { target: { value: '   ' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          role: HOUSEHOLD_ROLE.GUEST
        });
      });
    });

    it('should reset form after successful submission', async () => {
      mockOnSubmit.mockResolvedValue(undefined);
      renderInviteForm();

      const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
      const messageTextarea = screen.getByLabelText(/personal message/i) as HTMLTextAreaElement;
      const submitButton = screen.getByRole('button', { name: /send invitation/i });

      // Fill out form
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(messageTextarea, { target: { value: 'Test message' } });

      // Submit form
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });

      // Form should be reset
      await waitFor(() => {
        expect(emailInput.value).toBe('');
        expect(messageTextarea.value).toBe('');
      });
    });

    it('should handle submission errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockOnSubmit.mockRejectedValue(new Error('Submission failed'));
      renderInviteForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', { name: /send invitation/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to submit invitation:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });

  describe('role selection', () => {
    it('should render role selection field', () => {
      renderInviteForm();
      
      expect(screen.getByText('Initial Role *')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper form labels', () => {
      renderInviteForm();

      expect(screen.getByLabelText(/email address \*/i)).toBeInTheDocument();
      expect(screen.getByText('Initial Role *')).toBeInTheDocument();
      expect(screen.getByLabelText(/personal message \(optional\)/i)).toBeInTheDocument();
    });

    it('should contain a form element', () => {
      const { container } = renderInviteForm();

      // Check form element exists
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('should have submit button', () => {
      renderInviteForm();

      const submitButton = screen.getByRole('button', { name: /send invitation/i });
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('responsive design', () => {
    it('should have responsive spacing classes', () => {
      const { container } = renderInviteForm();
      
      const form = container.querySelector('form');
      expect(form).toHaveClass('space-y-4', 'md:space-y-6');
    });
  });
});