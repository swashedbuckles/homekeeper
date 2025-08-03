import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SearchInput } from '../../../src/components/headers/SearchInput';

// Helper function to render SearchInput and get input element
const renderSearchInput = () => {
  render(<SearchInput />);
  return screen.getByRole('textbox') as HTMLInputElement;
};

describe('SearchInput', () => {
  const searchInputTests = [
    {
      name: 'renders with correct placeholder',
      test: () => {
        render(<SearchInput />);
        const input = screen.getByPlaceholderText('SEARCH MANUALS...');
        expect(input).toBeInTheDocument();
      }
    },
    {
      name: 'has correct input type',
      test: () => {
        const input = renderSearchInput();
        expect(input).toHaveAttribute('type', 'text');
      }
    },
    {
      name: 'applies brutal styling classes',
      test: () => {
        const input = renderSearchInput();
        const expectedClasses = [
          'w-48', 'px-4', 'py-3', 'bg-text-primary', 'text-white',
          'border-brutal-md', 'border-white', 'font-bold'
        ];
        expectedClasses.forEach(className => {
          expect(input).toHaveClass(className);
        });
      }
    },
    {
      name: 'accepts user input',
      test: () => {
        const input = renderSearchInput();
        fireEvent.change(input, { target: { value: 'Samsung refrigerator' } });
        expect(input.value).toBe('Samsung refrigerator');
      }
    },
    {
      name: 'applies focus styles when focused',
      test: () => {
        const input = renderSearchInput();
        const focusClasses = ['focus:outline-none', 'focus:bg-background', 'focus:text-text-primary'];
        focusClasses.forEach(className => {
          expect(input).toHaveClass(className);
        });
      }
    }
  ];

  searchInputTests.forEach(({ name, test }) => {
    it(name, test);
  });
});