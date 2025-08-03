import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../../../src/components/common/Badge';
import { expectTestIdToHaveClasses } from '../../helpers/testHelpers';
import { createVariantTests, createSizeTests, createBasicRenderingTests } from '../../helpers/componentTestHelpers';

describe('Badge', () => {
  // Basic rendering tests
  createBasicRenderingTests('Badge', Badge, [
    {
      description: 'renders children correctly',
      props: { children: 'Test Badge' } as any,
      expectedText: 'Test Badge'
    }
  ]);

  it('renders with default props', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByTestId('badge');
    
    expect(badge).toHaveClass('bg-primary'); // default color
    expect(badge).toHaveClass('text-sm'); // default size sm
    expect(badge).toHaveClass('px-3'); // default size sm padding
    expect(badge).toHaveClass('rounded-none'); // default variant status
  });

  // Variant tests using factory
  createVariantTests('Badge', Badge, [
    {
      name: 'status',
      props: { variant: 'status', children: 'STATUS' },
      expectedClasses: ['rounded-none', 'px-3', 'py-2'],
      testId: 'badge'
    },
    {
      name: 'category',
      props: { variant: 'category', children: 'CATEGORY' },
      expectedClasses: ['rounded-none', 'px-3', 'py-2'],
      testId: 'badge'
    },
    {
      name: 'count',
      props: { variant: 'count', children: '3' },
      expectedClasses: ['rounded-full', 'min-w-[2rem]', 'px-3', 'py-2'],
      testId: 'badge'
    }
  ]);

  // Color tests using factory  
  createVariantTests('Badge', Badge, [
    {
      name: 'primary color',
      props: { color: 'primary', children: 'Primary' },
      expectedClasses: ['bg-primary', 'text-white', 'brutal-shadow-dark'],
      testId: 'badge'
    },
    {
      name: 'error color',
      props: { color: 'error', children: 'Error' },
      expectedClasses: ['bg-error', 'text-white', 'brutal-shadow-dark'],
      testId: 'badge'
    },
    {
      name: 'dark color',
      props: { color: 'dark', children: 'Dark' },
      expectedClasses: ['bg-text-primary', 'text-white', 'brutal-shadow-primary'],
      testId: 'badge'
    },
    {
      name: 'accent color',
      props: { color: 'accent', children: 'Accent' },
      expectedClasses: ['bg-accent', 'text-white', 'brutal-shadow-dark'],
      testId: 'badge'
    }
  ]);

  // Size tests using factory
  createSizeTests('Badge', Badge, [
    {
      size: 'sm',
      props: { size: 'sm', children: 'Small' },
      expectedClasses: ['text-sm', 'px-3', 'py-2'],
      testId: 'badge'
    },
    {
      size: 'md', 
      props: { size: 'md', children: 'Medium' },
      expectedClasses: ['text-base', 'px-4', 'py-3'],
      testId: 'badge'
    },
    {
      size: 'lg',
      props: { size: 'lg', children: 'Large' },
      expectedClasses: ['text-lg', 'px-6', 'py-4'],
      testId: 'badge'
    }
  ]);

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    expectTestIdToHaveClasses('badge', ['custom-class']);
  });

  it('uses custom testId', () => {
    render(<Badge testId="custom-badge">Custom Test ID</Badge>);
    
    expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
  });

  it('applies base styles consistently', () => {
    render(<Badge>Base Styles</Badge>);
    expectTestIdToHaveClasses('badge', [
      'font-mono', 'font-black', 'uppercase', 'tracking-wider', 
      'inline-flex', 'items-center', 'justify-center', 'border-text-primary', 
      'whitespace-nowrap', 'border-brutal-sm'
    ]);
  });

  // Real-world usage integration tests
  createBasicRenderingTests('Badge', Badge, [
    {
      description: 'renders overdue status badge',
      props: { variant: 'status', color: 'error', size: 'sm', children: 'OVERDUE' } as any,
      expectedText: 'OVERDUE'
    },
    {
      description: 'renders category badge for HVAC',
      props: { variant: 'category', color: 'primary', children: 'HVAC' } as any,
      expectedText: 'HVAC'
    },
    {
      description: 'renders notification count badge',
      props: { variant: 'count', color: 'accent', size: 'sm', children: '3' } as any,
      expectedText: '3'
    }
  ]);
});