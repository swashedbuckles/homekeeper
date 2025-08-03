import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Code } from '../../../src/components/common/Code';

// Helper function to render Code and get code element
const renderCode = (children = 'Test Code', props = {}) => {
  render(<Code {...props}>{children}</Code>);
  return screen.getByTestId(props.testId || 'code');
};

describe('Code', () => {
  it('renders children correctly', () => {
    renderCode();
    expect(screen.getByText('Test Code')).toBeInTheDocument();
  });

  it('renders with default props', () => {
    const code = renderCode('Default Code');
    expect(code.tagName).toBe('CODE');
    expect(code).toHaveClass('text-base', 'px-4', 'py-3');
  });

  const variantTests = [
    {
      name: 'renders inline variant correctly',
      variant: 'inline',
      expectedTag: 'CODE',
      expectedClasses: ['inline-block', 'mx-1'],
      notExpectedClasses: ['block', 'whitespace-pre-wrap']
    },
    {
      name: 'renders block variant correctly',
      variant: 'block',
      expectedTag: 'PRE',
      expectedClasses: ['block', 'p-4', 'my-2', 'whitespace-pre-wrap', 'brutal-shadow-primary'],
      notExpectedClasses: ['inline-block', 'mx-1']
    }
  ];

  describe('variants', () => {
    variantTests.forEach(({ name, variant, expectedTag, expectedClasses, notExpectedClasses }) => {
      it(name, () => {
        const code = renderCode(`${variant} code`, { variant });
        
        expect(code.tagName).toBe(expectedTag);
        expectedClasses.forEach(className => {
          expect(code).toHaveClass(className);
        });
        notExpectedClasses.forEach(className => {
          expect(code).not.toHaveClass(className);
        });
      });
    });
  });

  const sizeTests = [
    // Inline variant sizes
    { name: 'renders small inline size correctly', variant: 'inline', size: 'sm', expectedClasses: ['text-sm', 'px-3', 'py-2'] },
    { name: 'renders medium inline size correctly', variant: 'inline', size: 'md', expectedClasses: ['text-base', 'px-4', 'py-3'] },
    { name: 'renders large inline size correctly', variant: 'inline', size: 'lg', expectedClasses: ['text-lg', 'px-6', 'py-4'] },
    // Block variant sizes
    { name: 'renders small block size correctly', variant: 'block', size: 'sm', expectedClasses: ['text-sm', 'p-3'] },
    { name: 'renders medium block size correctly', variant: 'block', size: 'md', expectedClasses: ['text-base', 'p-4'] },
    { name: 'renders large block size correctly', variant: 'block', size: 'lg', expectedClasses: ['text-lg', 'p-6'] }
  ];

  describe('sizes', () => {
    sizeTests.forEach(({ name, variant, size, expectedClasses }) => {
      it(name, () => {
        const code = renderCode(`${size} ${variant}`, { variant, size });
        expectedClasses.forEach(className => {
          expect(code).toHaveClass(className);
        });
      });
    });
  });

  const propTests = [
    {
      name: 'applies custom className',
      props: { className: 'custom-class' },
      test: (code: HTMLElement) => expect(code).toHaveClass('custom-class')
    },
    {
      name: 'uses custom testId',
      props: { testId: 'custom-code' },
      test: () => expect(screen.getByTestId('custom-code')).toBeInTheDocument()
    },
    {
      name: 'applies base styles consistently',
      props: {},
      test: (code: HTMLElement) => {
        const expectedClasses = [
          'font-mono', 'font-bold', 'bg-background',
          'border-brutal-md', 'border-text-primary', 'text-text-primary'
        ];
        expectedClasses.forEach(className => {
          expect(code).toHaveClass(className);
        });
      }
    }
  ];

  propTests.forEach(({ name, props, test }) => {
    it(name, () => {
      const code = renderCode('test code', props);
      test(code);
    });
  });

  const elementTests = [
    { name: 'uses <code> element for inline variant', variant: 'inline', expectedTag: 'CODE' },
    { name: 'uses <pre> element for block variant', variant: 'block', expectedTag: 'PRE' }
  ];

  describe('HTML element selection', () => {
    elementTests.forEach(({ name, variant, expectedTag }) => {
      it(name, () => {
        const element = renderCode('element test', { variant });
        expect(element.tagName).toBe(expectedTag);
      });
    });
  });

  const realWorldExamples = [
    {
      name: 'renders model number correctly',
      content: 'RF28T5001SR',
      props: {},
      expectedClasses: ['inline-block', 'font-mono', 'border-brutal-md'],
      expectedTag: 'CODE'
    },
    {
      name: 'renders inline model with context',
      content: 'RF28T5001SR',
      props: {},
      expectedClasses: ['inline-block', 'mx-1'],
      wrapper: (children: React.ReactNode) => <span>Samsung Refrigerator {children}</span>
    },
    {
      name: 'renders small ID code',
      content: 'ID: #12345',
      props: { size: 'sm' },
      expectedClasses: ['text-sm', 'px-3', 'py-2']
    },
    {
      name: 'renders technical specifications block',
      content: 'Serial: 987654321\nManufactured: 2023-01-15\nWarranty: 5 years',
      props: { variant: 'block', size: 'lg' },
      expectedClasses: ['text-lg', 'p-6', 'whitespace-pre-wrap', 'brutal-shadow-primary'],
      useTestId: true
    },
    {
      name: 'renders version numbers in documentation',
      content: 'v2.1.3',
      props: { size: 'sm' },
      expectedClasses: ['text-sm'],
      expectedTag: 'CODE',
      wrapper: (children: React.ReactNode) => <p>Current version: {children}</p>
    },
    {
      name: 'renders configuration block',
      content: 'config:\n  name: "HomeKeeper"\n  version: "1.0.0"\n  environment: "production"',
      props: { variant: 'block', size: 'md' },
      expectedClasses: ['block', 'text-base', 'p-4'],
      useTestId: true
    }
  ];

  describe('real-world usage examples', () => {
    realWorldExamples.forEach(({ name, content, props, expectedClasses, expectedTag, wrapper, useTestId }) => {
      it(name, () => {
        const codeElement = <Code {...props}>{content}</Code>;
        
        if (wrapper) {
          render(wrapper(codeElement));
        } else {
          render(codeElement);
        }
        
        const code = useTestId ? screen.getByTestId('code') : screen.getByText(content);
        
        expectedClasses.forEach(className => {
          expect(code).toHaveClass(className);
        });
        
        if (expectedTag) {
          expect(code.tagName).toBe(expectedTag);
        }
      });
    });
  });
});