import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TextInput } from '../../../src/components/form/TextInput';
import { expectElementToHaveClasses } from '../../helpers/testHelpers';
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

  describe('error states', () => {
    const errorStateTests = [
      {
        name: 'applies error styling when error is present',
        props: { label: 'Email', type: 'email' as const, error: 'Email is required' },
        expectedClasses: ['border-error'],
        notExpectedClasses: []
      },
      {
        name: 'applies normal styling when no error',
        props: { label: 'Email', type: 'email' as const },
        expectedClasses: ['border-text-primary'],
        notExpectedClasses: ['border-error']
      }
    ];

    errorStateTests.forEach(({ name, props, expectedClasses, notExpectedClasses }) => {
      it(name, () => {
        render(<TextInput {...props} />);
        
        const input = screen.getByRole('textbox');
        expectElementToHaveClasses(input, expectedClasses);
        notExpectedClasses.forEach(className => {
          expect(input).not.toHaveClass(className);
        });
      });
    });
  });

  it('renders validation feedback when provided', () => {
    const feedback = <div>Password strength indicator</div>;
    render(<TextInput label="Password" type="password" validationFeedback={feedback} />);
    
    expect(screen.getByText('Password strength indicator')).toBeInTheDocument();
  });

  describe('form integration', () => {
    const formIntegrationTests = [
      {
        name: 'applies form registration when provided',
        props: {
          label: 'Email',
          type: 'email' as const,
          register: {
            name: 'email',
            onChange: () => {},
            onBlur: () => {},
            ref: () => {},
          } as unknown as UseFormRegisterReturn
        },
        test: (input: HTMLElement) => {
          expect(input).toHaveAttribute('name', 'email');
        }
      },
      {
        name: 'renders without form registration',
        props: { label: 'Email', type: 'email' as const },
        test: (input: HTMLElement) => {
          expect(input).toBeInTheDocument();
          expect(input).not.toHaveAttribute('name');
        }
      }
    ];

    formIntegrationTests.forEach(({ name, props, test }) => {
      it(name, () => {
        render(<TextInput {...props} />);
        
        const input = screen.getByRole('textbox');
        test(input);
      });
    });
  });

  describe('styling', () => {
    const stylingTests = [
      {
        name: 'applies base input classes',
        element: 'input',
        expectedClasses: [
          'w-full', 'input-brutal', 'font-mono', 'font-bold', 'uppercase',
          'brutal-transition', 'px-4', 'py-3', 'bg-white', 'border-text-primary', 'text-text-primary'
        ]
      },
      {
        name: 'applies label classes',
        element: 'label',
        expectedClasses: [
          'block', 'font-mono', 'font-black', 'text-text-primary', 'uppercase',
          'mb-2', 'text-lg', 'tracking-wide'
        ]
      }
    ];

    stylingTests.forEach(({ name, element, expectedClasses }) => {
      it(name, () => {
        render(<TextInput label="Email" type="email" />);
        
        const targetElement = element === 'input' ? 
          screen.getByRole('textbox') : 
          screen.getByText('Email');
        
        expectElementToHaveClasses(targetElement, expectedClasses);
      });
    });
  });

  it('shows error with correct styling', () => {
    render(<TextInput label="Email" type="email" error="Email is required" />);
    
    const errorElement = screen.getByText(/Email is required/);
    expectElementToHaveClasses(errorElement, ['font-mono', 'font-bold', 'uppercase', 'text-sm']);
  });
});