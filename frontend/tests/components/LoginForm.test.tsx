import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import fetchMock from '@fetch-mock/vitest';
import { LoginForm } from '../../src/components/LoginForm';
import { TestAuthProvider } from '../helpers/testProviderUtils';
import { createMockUser } from '../helpers/testUtils';

const renderLoginForm = (onSuccess = vi.fn()) => {
  return render(
    <TestAuthProvider>
      <LoginForm onSuccess={onSuccess} />
    </TestAuthProvider>
  );
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
    
    fetchMock.route({
      url: 'path:/auth/login', 
      response: {
        status: 200,
        body: { data: mockUser }}
    });

    fetchMock.route({
      url: 'path:/auth/csrf-token', 
      response: {
        status: 200,
        body: { csrfToken: 'mock-token' }}
    });
    
    renderLoginForm(onSuccess);
    
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(mockUser);
    });
  });

  it('shows error message on login failure', async () => {
      fetchMock.route({
        url: 'path:/auth/refresh',
        response: {
          status: 200,
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
    
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'wrongpassword' } });
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
        body: { csrfToken: 'mock-token' }}
    });
    
    renderLoginForm();
    
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('submit-button')).toBeDisabled();
    });
  });
});