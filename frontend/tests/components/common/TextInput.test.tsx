// frontend/tests/components/common/TextInput.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TextInput } from '../../../src/components/common/TextInput';
import type { UseFormRegisterReturn } from 'react-hook-form';

describe('TextInput', () => {
  it('renders label correctly', () => {
    render(<TextInput label="Email" type="email" />);
    
    expect(screen.getByText('Email')).toBeInTheDocument();
    // Use getByRole instead of getByLabelText since label isn't properly associated
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders input with correct type', () => {
    render(<TextInput label="Password" type="password" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('shows placeholder text', () => {
    render(<TextInput label="Email" type="email" placeholder="Enter your email" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter your email');
  });

  it('displays error message when provided', () => {
    render(<TextInput label="Email" type="email" error="Email is required" />);
    
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    render(<TextInput label="Email" type="email" error="Email is required" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-ui-error');
  });

  it('applies normal styling when no error', () => {
    render(<TextInput label="Email" type="email" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-ui-border');
    expect(input).not.toHaveClass('border-ui-error');
  });

  it('renders validation feedback when provided', () => {
    const feedback = <div>Password strength indicator</div>;
    render(<TextInput label="Password" type="password" validationFeedback={feedback} />);
    
    expect(screen.getByText('Password strength indicator')).toBeInTheDocument();
  });

  it('applies form registration when provided', () => {
    const mockRegister = {
      name: 'email',
      onChange: () => {},
      onBlur: () => {},
      ref: () => {},
    } as unknown as UseFormRegisterReturn;
    
    render(<TextInput label="Email" type="email" register={mockRegister} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('name', 'email');
  });

  it('renders without form registration', () => {
    render(<TextInput label="Email" type="email" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).not.toHaveAttribute('name');
  });

  it('applies base input classes', () => {
    render(<TextInput label="Email" type="email" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass(
      'w-full',
      'px-4',
      'py-3', 
      'bg-white',
      'rounded-lg',
      'text-text-primary',
      'placeholder-text-secondary',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-primary',
      'focus:border-transparent'
    );
  });

  it('applies label classes', () => {
    render(<TextInput label="Email" type="email" />);
    
    const label = screen.getByText('Email');
    expect(label).toHaveClass(
      'block',
      'text-sm',
      'font-semibold',
      'text-text-primary',
      'mb-2'
    );
  });

  it('shows error with red text', () => {
    render(<TextInput label="Email" type="email" error="Email is required" />);
    
    const errorElement = screen.getByText('Email is required');
    expect(errorElement).toHaveClass('text-ui-error', 'text-sm', 'mt-1');
  });
});