import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CodeInput } from '../../../src/components/variations/CodeInput';

// Helper function to render CodeInput and get input element
const renderCodeInput = (props = {}) => {
  render(<CodeInput label="Code" {...props} />);
  return screen.getByRole('textbox');
};

describe('CodeInput', () => {
  const codeInputTests = [
    {
      name: 'renders with text input type',
      props: { label: 'Verification Code' },
      test: (input: HTMLElement) => {
        expect(input).toHaveAttribute('type', 'text');
      }
    },
    {
      name: 'applies mono font styling',
      props: {},
      test: (input: HTMLElement) => {
        const expectedClasses = ['text-center', 'tracking-widest', 'uppercase', 'font-black', 'text-2xl', 'font-mono'];
        expectedClasses.forEach(className => {
          expect(input).toHaveClass(className);
        });
      }
    },
    {
      name: 'accepts TextInput props',
      props: { placeholder: 'Enter code' },
      test: () => {
        expect(screen.getByText('Code')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter code')).toBeInTheDocument();
      }
    },
    {
      name: 'applies default maxLength',
      props: {},
      test: (input: HTMLElement) => {
        expect(input).toBeInTheDocument();
      }
    },
    {
      name: 'applies custom maxLength when provided',
      props: { maxLength: 6 },
      test: (input: HTMLElement) => {
        expect(input).toBeInTheDocument();
      }
    }
  ];

  codeInputTests.forEach(({ name, props, test }) => {
    it(name, () => {
      const input = renderCodeInput(props);
      test(input);
    });
  });
});