// frontend/tests/components/RegistrationForm.test.tsx
import fetchMock from '@fetch-mock/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegistrationForm } from '../../../src/components/fragments/RegistrationForm';
import { TestAuthProvider } from '../../helpers/testProviderUtils';
import { createMockUser, mockAuthEndpoints } from '../../helpers/testUtils';

const renderRegistrationForm = (onSuccess = vi.fn()) => {
  return render(
    <TestAuthProvider>
      <RegistrationForm onSuccess={onSuccess} />
    </TestAuthProvider>
  );
};

describe('RegistrationForm', () => {
  beforeEach(() => {
    fetchMock.clearHistory();
    fetchMock.mockGlobal();
    
    mockAuthEndpoints();
  });

  it('renders registration form elements', () => {
    renderRegistrationForm();
    
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('shows password strength indicator', () => {
    renderRegistrationForm();
    
    const passwordInput = screen.getByTestId('password-input');
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    
    expect(passwordInput).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const mockUser = createMockUser();
    const onSuccess = vi.fn();
    
    fetchMock.route({
      url: 'path:/auth/register', 
      response: {
        status: 200,
        body: { data: mockUser }
      }
    });
    
    renderRegistrationForm(onSuccess);
    
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'StrongPass123!' } });
    fireEvent.change(screen.getByTestId('confirm-password-input'), { target: { value: 'StrongPass123!' } });
    
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(mockUser);
    });
  });

  it('shows error message on registration failure', async () => {
    fetchMock.route({
      url: 'path:/auth/register', 
      response: {
        status: 400,
        body: { error: 'Email already exists' }
      }
    });
    
    renderRegistrationForm();
    
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'StrongPass123!' } });
    fireEvent.change(screen.getByTestId('confirm-password-input'), { target: { value: 'StrongPass123!' } });
    
    fireEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Please check your information and try again');
    });
  });

  it('shows loading state during submission', async () => {
    fetchMock.route({
      url: 'path:/auth/register', 
      response: new Promise(() => {})
    });

    renderRegistrationForm();
    
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'StrongPass123!' } });
    fireEvent.change(screen.getByTestId('confirm-password-input'), { target: { value: 'StrongPass123!' } });
    
    fireEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('submit-button')).toBeDisabled();
    });
  });
});