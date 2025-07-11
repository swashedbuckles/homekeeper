import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Code } from '../../../src/components/common/Code';

describe('Code', () => {
  it('renders children correctly', () => {
    render(<Code>Test Code</Code>);
    expect(screen.getByText('Test Code')).toBeInTheDocument();
  });

  it('renders with default props', () => {
    render(<Code>Default Code</Code>);
    const code = screen.getByTestId('code');
    
    expect(code.tagName).toBe('CODE'); // default variant inline
    expect(code).toHaveClass('text-sm', 'px-2', 'py-1'); // default size medium
  });

  describe('variants', () => {
    it('renders inline variant correctly', () => {
      render(<Code variant="inline">Inline code</Code>);
      const code = screen.getByTestId('code');
      
      expect(code.tagName).toBe('CODE');
      expect(code).toHaveClass('inline-block', 'px-2', 'py-1', 'mx-1');
      expect(code).not.toHaveClass('block', 'whitespace-pre-wrap');
    });

    it('renders block variant correctly', () => {
      render(<Code variant="block">Block code</Code>);
      const code = screen.getByTestId('code');
      
      expect(code.tagName).toBe('PRE');
      expect(code).toHaveClass('block', 'p-4', 'my-2', 'whitespace-pre-wrap', 'brutal-shadow-primary');
      expect(code).not.toHaveClass('inline-block', 'mx-1');
    });
  });

  describe('sizes', () => {
    describe('inline variant sizes', () => {
      it('renders small inline size correctly', () => {
        render(<Code variant="inline" size="small">Small inline</Code>);
        const code = screen.getByTestId('code');
        
        expect(code).toHaveClass('text-xs', 'px-1', 'py-0.5');
      });

      it('renders medium inline size correctly', () => {
        render(<Code variant="inline" size="medium">Medium inline</Code>);
        const code = screen.getByTestId('code');
        
        expect(code).toHaveClass('text-sm', 'px-2', 'py-1');
      });

      it('renders large inline size correctly', () => {
        render(<Code variant="inline" size="large">Large inline</Code>);
        const code = screen.getByTestId('code');
        
        expect(code).toHaveClass('text-base', 'px-3', 'py-1.5');
      });
    });

    describe('block variant sizes', () => {
      it('renders small block size correctly', () => {
        render(<Code variant="block" size="small">Small block</Code>);
        const code = screen.getByTestId('code');
        
        expect(code).toHaveClass('text-sm', 'p-3');
      });

      it('renders medium block size correctly', () => {
        render(<Code variant="block" size="medium">Medium block</Code>);
        const code = screen.getByTestId('code');
        
        expect(code).toHaveClass('text-base', 'p-4');
      });

      it('renders large block size correctly', () => {
        render(<Code variant="block" size="large">Large block</Code>);
        const code = screen.getByTestId('code');
        
        expect(code).toHaveClass('text-lg', 'p-6');
      });
    });
  });

  it('applies custom className', () => {
    render(<Code className="custom-class">Custom class</Code>);
    const code = screen.getByTestId('code');
    
    expect(code).toHaveClass('custom-class');
  });

  it('uses custom testId', () => {
    render(<Code testId="custom-code">Custom test ID</Code>);
    
    expect(screen.getByTestId('custom-code')).toBeInTheDocument();
  });

  it('applies base styles consistently', () => {
    render(<Code>Base styles</Code>);
    const code = screen.getByTestId('code');
    
    expect(code).toHaveClass(
      'font-mono',
      'font-bold',
      'bg-background',
      'border-4',
      'border-text-primary',
      'text-text-primary'
    );
  });

  describe('HTML element selection', () => {
    it('uses <code> element for inline variant', () => {
      render(<Code variant="inline">Inline</Code>);
      const element = screen.getByTestId('code');
      
      expect(element.tagName).toBe('CODE');
    });

    it('uses <pre> element for block variant', () => {
      render(<Code variant="block">Block</Code>);
      const element = screen.getByTestId('code');
      
      expect(element.tagName).toBe('PRE');
    });
  });

  describe('real-world usage examples', () => {
    it('renders model number correctly', () => {
      render(<Code>RF28T5001SR</Code>);
      
      const code = screen.getByText('RF28T5001SR');
      expect(code).toHaveClass('inline-block', 'font-mono', 'border-4');
      expect(code.tagName).toBe('CODE');
    });

    it('renders inline model with context', () => {
      render(
        <span>
          Samsung Refrigerator <Code>RF28T5001SR</Code>
        </span>
      );
      
      const code = screen.getByText('RF28T5001SR');
      expect(code).toHaveClass('inline-block', 'mx-1');
    });

    it('renders small ID code', () => {
      render(<Code size="small">ID: #12345</Code>);
      
      const code = screen.getByText('ID: #12345');
      expect(code).toHaveClass('text-xs', 'px-1', 'py-0.5');
    });

    it('renders technical specifications block', () => {
      const specs = `Serial: 987654321
Manufactured: 2023-01-15
Warranty: 5 years`;
      
      render(
        <Code variant="block" size="large">
          {specs}
        </Code>
      );
      
      const code = screen.getByTestId('code');
      expect(code.tagName).toBe('PRE');
      expect(code).toHaveClass('text-lg', 'p-6', 'whitespace-pre-wrap', 'brutal-shadow-primary');
    });

    it('renders version numbers in documentation', () => {
      render(
        <p>
          Current version: <Code size="small">v2.1.3</Code>
        </p>
      );
      
      const code = screen.getByText('v2.1.3');
      expect(code).toHaveClass('text-xs');
      expect(code.tagName).toBe('CODE');
    });

    it('renders configuration block', () => {
      render(
        <Code variant="block" size="medium">
          {`config:
  name: "HomeKeeper"
  version: "1.0.0"
  environment: "production"`}
        </Code>
      );
      
      const code = screen.getByTestId('code');
      expect(code).toHaveClass('block', 'text-base', 'p-4');
      expect(code.tagName).toBe('PRE');
    });
  });
});