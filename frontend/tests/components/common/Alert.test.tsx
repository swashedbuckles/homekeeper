import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Alert } from '../../../src/components/common/Alert';
import { expectElementToHaveClasses } from '../../helpers/testHelpers';

describe('Alert', () => {
  it('renders children content', () => {
    render(<Alert>Test alert message</Alert>);
    
    expect(screen.getByText('Test alert message')).toBeInTheDocument();
  });

  describe('Variant Styles', () => {
    const variantTests = [
      {
        variant: 'default (info)',
        props: {},
        expectedClasses: [
          'font-mono', 'font-bold', 'uppercase', 'p-4', 'border-brutal-md', 
          'brutal-shadow-dark', 'bg-info', 'text-white', 'border-text-primary'
        ]
      },
      {
        variant: 'warning',
        props: { variant: 'warning' as const },
        expectedClasses: [
          'font-mono', 'font-bold', 'uppercase', 'p-4', 'border-brutal-md',
          'brutal-shadow-dark', 'bg-warning', 'text-white', 'border-text-primary'
        ]
      },
      {
        variant: 'error',
        props: { variant: 'error' as const },
        expectedClasses: [
          'font-mono', 'font-bold', 'uppercase', 'p-4', 'border-brutal-md',
          'brutal-shadow-dark', 'bg-error', 'text-white', 'border-text-primary'
        ]
      },
      {
        variant: 'success',
        props: { variant: 'success' as const },
        expectedClasses: [
          'font-mono', 'font-bold', 'uppercase', 'p-4', 'border-brutal-md',
          'brutal-shadow-dark', 'bg-success', 'text-white', 'border-text-primary'
        ]
      }
    ];

    variantTests.forEach(({ variant, props, expectedClasses }) => {
      it(`applies correct styles for ${variant} variant`, () => {
        const { container } = render(<Alert {...props}>{variant} message</Alert>);
        
        const alertDiv = container.firstChild as HTMLElement;
        expectElementToHaveClasses(alertDiv, expectedClasses);
      });
    });
  });

  describe('Icon Behavior', () => {
    const iconTests = [
      {
        name: 'renders default icon for each variant',
        props: { variant: 'info' as const },
        test: (container: HTMLElement) => {
          const icon = container.querySelector('.w-4.h-4.md\\:w-5.md\\:h-5');
          expect(icon).toBeInTheDocument();
        }
      },
      {
        name: 'hides icon when hideIcon is true',
        props: { hideIcon: true },
        test: (container: HTMLElement) => {
          const icon = container.querySelector('.w-4.h-4.md\\:w-5.md\\:h-5');
          expect(icon).not.toBeInTheDocument();
        }
      },
      {
        name: 'renders custom icon when provided',
        props: { icon: <div data-testid="custom-icon">Custom</div> },
        test: () => {
          expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
        }
      }
    ];

    iconTests.forEach(({ name, props, test }) => {
      it(name, () => {
        const { container } = render(<Alert {...props}>Test message</Alert>);
        test(container);
      });
    });
  });

  it('applies custom className', () => {
    const { container } = render(<Alert className="custom-class">Message</Alert>);
    
    const alertDiv = container.firstChild;
    expect(alertDiv).toHaveClass('custom-class');
  });
});
