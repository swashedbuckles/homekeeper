import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SearchInput } from '../../../src/components/headers/SearchInput';

describe('SearchInput', () => {
  it('renders with correct placeholder', () => {
    render(<SearchInput />);
    
    const input = screen.getByPlaceholderText('SEARCH MANUALS...');
    expect(input).toBeInTheDocument();
  });

  it('has correct input type', () => {
    render(<SearchInput />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('applies brutal styling classes', () => {
    render(<SearchInput />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass(
      'w-48',
      'px-4',
      'py-3',
      'bg-text-primary',
      'text-white',
      'border-4',
      'border-white',
      'font-bold'
    );
  });

  it('accepts user input', () => {
    render(<SearchInput />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Samsung refrigerator' } });
    
    expect(input.value).toBe('Samsung refrigerator');
  });

  it('applies focus styles when focused', () => {
    render(<SearchInput />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('focus:outline-none', 'focus:bg-background', 'focus:text-text-primary');
  });
});