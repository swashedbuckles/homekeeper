// frontend/tests/components/common/TextInput.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TextInput } from '../../../src/components/form/TextInput';
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
    
    // Password input won't have role="textbox", use a different query
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('shows placeholder text', () => {
    render(<TextInput label="Email" type="email" placeholder="Enter your email" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter your email');
  });

  it('displays error message when provided', () => {
    render(<TextInput label="Email" type="email" error="Email is required" />);
    
    expect(screen.getByText(/Email is required/)).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    render(<TextInput label="Email" type="email" error="Email is required" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-error');
  });

  it('applies normal styling when no error', () => {
    render(<TextInput label="Email" type="email" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-text-primary');
    expect(input).not.toHaveClass('border-error');
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
      'input-brutal',
      'font-mono',
      'font-bold',
      'uppercase',
      'brutal-transition',
      'px-4',
      'py-3',
      'bg-white',
      'border-text-primary',
      'text-text-primary'
    );
  });

  it('applies label classes', () => {
    render(<TextInput label="Email" type="email" />);
    
    const label = screen.getByText('Email');
    expect(label).toHaveClass(
      'block',
      'font-mono',
      'font-black',
      'text-text-primary',
      'uppercase',
      'mb-2',
      'text-lg',
      'tracking-wide'
    );
  });

  it('shows error with red text', () => {
    render(<TextInput label="Email" type="email" error="Email is required" />);
    
    // Error text is now inside a div with warning symbol
    const errorElement = screen.getByText(/Email is required/);
    expect(errorElement).toHaveClass('font-mono', 'font-bold', 'uppercase', 'text-sm');
  });
});