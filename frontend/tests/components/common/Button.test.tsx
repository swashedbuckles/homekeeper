import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../../../src/components/common/Button';
import { 
  expectTextToBeVisible, 
  expectTextNotToBeVisible,
  expectButtonToHaveClasses,
  expectShadowClasses,
  expectNoShadowClasses
} from '../../helpers/testHelpers';
import { 
  createVariantTests, 
  createSizeTests, 
  createShadowTests,
  createBasicRenderingTests
} from '../../helpers/componentTestHelpers';

describe('Button', () => {
  // Basic rendering tests
  createBasicRenderingTests('Button', Button, [
    {
      description: 'renders children correctly',
      props: { children: 'Click me' } as any,
      expectedText: 'Click me',
      expectedRole: 'button'
    }
  ]);

  // Core interaction tests
  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Core functionality tests
  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading text when loading', () => {
    render(<Button loading loadingText="Processing...">Click me</Button>);
    
    expectTextToBeVisible('Processing...');
    expectTextNotToBeVisible('Click me');
  });

  it('uses default loading text when none provided', () => {
    render(<Button loading>Click me</Button>);
    expectTextToBeVisible('Loading...');
  });

  // Variant tests using factory
  createVariantTests('Button', Button, [
    {
      name: 'primary',
      props: { variant: 'primary', children: 'Primary' },
      expectedClasses: ['bg-primary']
    },
    {
      name: 'secondary', 
      props: { variant: 'secondary', children: 'Secondary' },
      expectedClasses: ['bg-secondary']
    },
    {
      name: 'outline',
      props: { variant: 'outline', children: 'Outline' },
      expectedClasses: ['bg-transparent']
    }
  ]);

  it('applies full width class when full prop is true', () => {
    render(<Button full>Full width</Button>);
    expectButtonToHaveClasses('Full width', ['w-full']);
  });

  it('sets correct button type', () => {
    const { rerender } = render(<Button type="submit">Submit</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');

    rerender(<Button type="reset">Reset</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'reset');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Button</Button>);
    expectButtonToHaveClasses('Button', ['custom-class']);
  });

  // Consolidated shadow tests - reduced from 150+ lines to representative samples
  createShadowTests('Button', Button, [
    // Default shadow behavior (representative samples)
    {
      description: 'applies shadow by default for solid variants',
      props: { variant: 'primary', children: 'Primary Button' },
      expectShadow: true,
      expectedShadowClass: 'brutal-shadow-dark'
    },
    {
      description: 'does not apply shadow by default for outline variant',
      props: { variant: 'outline', children: 'Outline Button' },
      expectShadow: false
    },
    {
      description: 'does not apply shadow by default for text variant',
      props: { variant: 'text', children: 'Text Button' },
      expectShadow: false
    },
    // Size-based shadow (representative samples)
    {
      description: 'applies small shadow for small sizes',
      props: { size: 'sm', children: 'Small Button' },
      expectShadow: true,
      expectedShadowClass: 'brutal-shadow-dark-sm'
    },
    {
      description: 'applies standard shadow for medium and large sizes',
      props: { size: 'lg', children: 'Large Button' },
      expectShadow: true,
      expectedShadowClass: 'brutal-shadow-dark'
    },
    // Explicit shadow control
    {
      description: 'applies shadow when explicitly enabled on outline variant',
      props: { variant: 'outline', shadow: true, children: 'Outline with Shadow' },
      expectShadow: true,
      expectedShadowClass: 'brutal-shadow-dark'
    },
    {
      description: 'removes shadow when explicitly disabled on solid variant',
      props: { variant: 'primary', shadow: false, children: 'Primary without Shadow' },
      expectShadow: false
    }
  ]);

  // Size tests using factory
  createSizeTests('Button', Button, [
    {
      size: 'xs',
      props: { size: 'xs', children: 'Extra Small' },
      expectedClasses: ['brutal-shadow-dark-sm'] // xs gets small shadow
    },
    {
      size: 'sm',
      props: { size: 'sm', children: 'Small' },
      expectedClasses: ['brutal-shadow-dark-sm']
    },
    {
      size: 'md',
      props: { size: 'md', children: 'Medium' },
      expectedClasses: ['brutal-shadow-dark'] // md and up get standard shadow
    }
  ]);

  // Edge cases and integration tests
  describe('Integration and Edge Cases', () => {
    it('maintains shadow behavior when disabled', () => {
      render(<Button variant="primary" disabled>Disabled Primary</Button>);
      
      const button = screen.getByRole('button');
      expectShadowClasses(button);
      expect(button).toHaveClass('disabled:opacity-50');
    });

    it('maintains shadow behavior when loading', () => {
      render(<Button variant="primary" loading>Loading Primary</Button>);
      
      const button = screen.getByRole('button');
      expectShadowClasses(button);
    });

    it('works with full width buttons', () => {
      render(<Button variant="primary" full>Full Width Primary</Button>);
      expectButtonToHaveClasses('Full Width Primary', ['brutal-shadow-dark', 'w-full']);
    });

    it('handles dynamic shadow prop changes', () => {
      const { rerender } = render(<Button variant="primary" shadow={true}>Dynamic Shadow</Button>);
      
      let button = screen.getByRole('button');
      expectShadowClasses(button);
      
      rerender(<Button variant="primary" shadow={false}>Dynamic Shadow</Button>);
      button = screen.getByRole('button');
      expectNoShadowClasses(button);
    });
  });
});