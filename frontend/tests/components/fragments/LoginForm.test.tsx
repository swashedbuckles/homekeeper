import fetchMock from '@fetch-mock/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from '../../../src/components/fragments/LoginForm';
import { TestAuthProvider } from '../../helpers/testProviderUtils';
import { createMockUser } from '../../helpers/testUtils';

// Helper function to render LoginForm with test setup
const renderLoginForm = (onSuccess = vi.fn()) => {
  return render(
    <TestAuthProvider>
      <LoginForm onSuccess={onSuccess} />
    </TestAuthProvider>
  );
};

// Helper function to setup form input values
const fillLoginForm = (email = 'test@example.com', password = 'password123') => {
  fireEvent.change(screen.getByTestId('email-input'), { target: { value: email } });
  fireEvent.change(screen.getByTestId('password-input'), { target: { value: password } });
};

// Helper function to mock successful login response
const mockSuccessfulLogin = (user: any) => {
  fetchMock.route({
    url: 'path:/auth/login', 
    response: {
      status: 200,
      body: { data: user }
    }
  });

  fetchMock.route({
    url: 'path:/auth/csrf-token', 
    response: {
      status: 200,
      body: { csrfToken: 'mock-token' }
    }
  });
};

describe('LoginForm', () => {
  beforeEach(() => {
    fetchMock.clearHistory();
    fetchMock.mockGlobal();
    // mockAuthEndpoints();
  });

  it('renders login form elements', () => {
    renderLoginForm();
    
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const mockUser = createMockUser();
    const onSuccess = vi.fn();
    
    mockSuccessfulLogin(mockUser);
    renderLoginForm(onSuccess);
    
    fillLoginForm();
    fireEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(mockUser);
    });
  });

  it('shows error message on login failure', async () => {
    fetchMock.route({
      url: 'path:/auth/refresh',
      response: {
        status: 401,
        body: { error: 'Session expired' }
      }
    });

    fetchMock.route({
      url: 'path:/auth/login',
      allowRelativeUrls: true,
      response: {
        status: 401,
        body: { error: 'Invalid credentials' }
      }
    });
    
    renderLoginForm();
    
    fillLoginForm('test@example.com', 'wrongpassword');
    fireEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Invalid email or password.');
    });
  });

  it('shows loading state during submission', async () => {
    fetchMock.route({
      url: 'path:/auth/login', 
      response: new Promise(() => {})
    });

    fetchMock.route({
      url: 'path:/auth/csrf-token', 
      response: {
        status: 200,
        body: { csrfToken: 'mock-token' }
      }
    });
    
    renderLoginForm();
    
    fillLoginForm();
    fireEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('submit-button')).toBeDisabled();
    });
  });
});