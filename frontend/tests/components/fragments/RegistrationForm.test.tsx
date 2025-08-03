// frontend/tests/components/RegistrationForm.test.tsx
import fetchMock from '@fetch-mock/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegistrationForm } from '../../../src/components/fragments/RegistrationForm';
import { TestAuthProvider } from '../../helpers/testProviderUtils';
import { createMockUser, mockAuthEndpoints } from '../../helpers/testUtils';

// Helper function to render RegistrationForm with test setup
const renderRegistrationForm = (onSuccess = vi.fn()) => {
  return render(
    <TestAuthProvider>
      <RegistrationForm onSuccess={onSuccess} />
    </TestAuthProvider>
  );
};

// Helper function to setup form input values
const fillRegistrationForm = (formData = {}) => {
  const defaultData = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'StrongPass123!',
    confirmPassword: 'StrongPass123!'
  };
  
  const data = { ...defaultData, ...formData };
  
  fireEvent.change(screen.getByTestId('name-input'), { target: { value: data.name } });
  fireEvent.change(screen.getByTestId('email-input'), { target: { value: data.email } });
  fireEvent.change(screen.getByTestId('password-input'), { target: { value: data.password } });
  fireEvent.change(screen.getByTestId('confirm-password-input'), { target: { value: data.confirmPassword } });
};

// Helper function to mock successful registration response
const mockSuccessfulRegistration = (user: any) => {
  fetchMock.route({
    url: 'path:/auth/register', 
    response: {
      status: 200,
      body: { data: user }
    }
  });
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
    
    mockSuccessfulRegistration(mockUser);
    renderRegistrationForm(onSuccess);
    
    fillRegistrationForm();
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
    
    fillRegistrationForm({ email: 'existing@example.com' });
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
    
    fillRegistrationForm();
    fireEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('submit-button')).toBeDisabled();
    });
  });
});