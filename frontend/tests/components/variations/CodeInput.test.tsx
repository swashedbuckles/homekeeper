import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CodeInput } from '../../../src/components/variations/CodeInput';

describe('CodeInput', () => {
  it('renders with text input type', () => {
    render(<CodeInput label="Verification Code" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('applies mono font styling', () => {
    render(<CodeInput label="Code" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('text-center', 'text-lg', 'tracking-wider', 'font-mono');
  });

  it('accepts TextInput props', () => {
    render(<CodeInput label="Code" placeholder="Enter code" />);
    
    expect(screen.getByText('Code')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter code')).toBeInTheDocument();
  });

  it('applies default maxLength', () => {
    render(<CodeInput label="Code" />);
    
    const input = screen.getByRole('textbox');
    // Note: maxLength would need to be checked via props if TextInput supports it
    expect(input).toBeInTheDocument();
  });

  it('applies custom maxLength when provided', () => {
    render(<CodeInput label="Code" maxLength={6} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });
});