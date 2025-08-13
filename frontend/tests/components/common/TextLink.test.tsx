import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router';
import { TextLink, type TextLinkProps, type TextLinkSize, type TextLinkVariant } from '../../../src/components/common/TextLink';

type TestTextLinkProps = Omit<TextLinkProps, 'children'>;

// Wrapper for React Router tests
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

// Helper function to render TextLink
const renderTextLink = (children = 'Test Link', props: TestTextLinkProps = {}, useRouter = false) => {
  const linkElement = <TextLink {...props}>{children}</TextLink>;
  
  if (useRouter) {
    render(<RouterWrapper>{linkElement}</RouterWrapper>);
  } else {
    render(linkElement);
  }
  
  return screen.getByTestId(props.testId || 'text-link');
};

describe('TextLink', () => {
  it('renders children correctly', () => {
    renderTextLink('Test Link', { href: '#' });
    expect(screen.getByText('Test Link')).toBeInTheDocument();
  });

  it('renders with default props as external link', () => {
    const link = renderTextLink('Default Link', { href: '#' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveClass('text-primary', 'text-base', 'border-b-4');
  });

  const routingTests = [
    {
      name: 'renders as React Router Link when "to" prop is provided',
      props: { to: '/internal' },
      useRouter: true,
      expectedTag: 'A',
      expectedHref: '/internal'
    },
    {
      name: 'renders as <a> tag when "href" prop is provided',
      props: { href: 'https://example.com' },
      useRouter: false,
      expectedTag: 'A',
      expectedHref: 'https://example.com'
    },
    {
      name: 'renders as <a> tag when only onClick is provided',
      props: { onClick: vi.fn() },
      useRouter: false,
      expectedTag: 'A',
      shouldNotHaveHref: true
    }
  ];

  describe('routing behavior', () => {
    routingTests.forEach(({ name, props, useRouter, expectedTag, expectedHref, shouldNotHaveHref }) => {
      it(name, () => {
        const link = renderTextLink('Test Link', props, useRouter);
        
        expect(link.tagName).toBe(expectedTag);
        
        if (expectedHref) {
          expect(link).toHaveAttribute('href', expectedHref);
        }
        
        if (shouldNotHaveHref) {
          expect(link).not.toHaveAttribute('href');
        }
      });
    });
  });

  const variantTests = [
    { name: 'renders primary variant correctly', variant: 'primary' as TextLinkVariant, expectedClasses: ['text-primary', 'border-primary'] },
    { name: 'renders secondary variant correctly', variant: 'secondary' as TextLinkVariant, expectedClasses: ['text-secondary', 'border-secondary'] },
    { name: 'renders subtle variant correctly', variant: 'subtle'  as TextLinkVariant, expectedClasses: ['text-text-secondary', 'border-text-secondary'] },
    { name: 'renders danger variant correctly', variant: 'danger'  as TextLinkVariant, expectedClasses: ['text-error', 'border-error'] }
  ];

  describe('variants', () => {
    variantTests.forEach(({ name, variant, expectedClasses }) => {
      it(name, () => {
        const link = renderTextLink(variant, { variant, href: '#' });
        expectedClasses.forEach(className => {
          expect(link).toHaveClass(className);
        });
      });
    });
  });

  const sizeTests = [
    { name: 'renders small size correctly', size: 'sm' as TextLinkSize, expectedClasses: ['text-sm', 'border-b-2'] },
    { name: 'renders medium size correctly', size: 'md' as TextLinkSize, expectedClasses: ['text-base', 'border-b-4'] },
    { name: 'renders large size correctly', size: 'lg' as TextLinkSize, expectedClasses: ['text-lg', 'border-b-4'] }
  ];

  describe('sizes', () => {
    sizeTests.forEach(({ name, size, expectedClasses }) => {
      it(name, () => {
        const link = renderTextLink(size, { size, href: '#' });
        expectedClasses.forEach(className => {
          expect(link).toHaveClass(className);
        });
      });
    });
  });

  const targetTests = [
    {
      name: 'applies target="_blank" correctly',
      props: { href: 'https://example.com', target: '_blank' } as TestTextLinkProps,
      expectedTarget: '_blank',
      expectedRel: 'noopener noreferrer'
    },
    {
      name: 'does not add rel attribute for non-blank targets',
      props: { href: '#', target: '_self' }  as TestTextLinkProps,
      expectedTarget: '_self',
      shouldNotHaveRel: true
    }
  ];

  describe('target prop', () => {
    targetTests.forEach(({ name, props, expectedTarget, expectedRel, shouldNotHaveRel }) => {
      it(name, () => {
        const link = renderTextLink('test', props);
        
        expect(link).toHaveAttribute('target', expectedTarget);
        
        if (expectedRel) {
          expect(link).toHaveAttribute('rel', expectedRel);
        }
        
        if (shouldNotHaveRel) {
          expect(link).not.toHaveAttribute('rel');
        }
      });
    });
  });

  const onClickTests = [
    {
      name: 'calls onClick handler when provided',
      test: () => {
        const mockClick = vi.fn();
        renderTextLink('Click Me', { onClick: mockClick, href: '#' });
        
        fireEvent.click(screen.getByTestId('text-link'));
        expect(mockClick).toHaveBeenCalledTimes(1);
      }
    },
    {
      name: 'prevents default when onClick is provided',
      test: () => {
        const mockClick = vi.fn();
        renderTextLink('Click Me', { onClick: mockClick, href: '#' });
        
        const link = screen.getByTestId('text-link');
        const clickEvent = new MouseEvent('click', { bubbles: true });
        const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
        
        fireEvent(link, clickEvent);
        expect(preventDefaultSpy).toHaveBeenCalled();
      }
    },
    {
      name: 'works with React Router Link and onClick',
      test: () => {
        const mockClick = vi.fn();
        renderTextLink('Router Link', { to: '/test', onClick: mockClick }, true);
        
        fireEvent.click(screen.getByTestId('text-link'));
        expect(mockClick).toHaveBeenCalledTimes(1);
      }
    }
  ];

  describe('onClick behavior', () => {
    onClickTests.forEach(({ name, test }) => {
      it(name, test);
    });
  });

  const propTests = [
    {
      name: 'applies custom className',
      props: { className: 'custom-class', href: '#' },
      test: (link: HTMLElement) => expect(link).toHaveClass('custom-class')
    },
    {
      name: 'uses custom testId',
      props: { testId: 'custom-link', href: '#' },
      test: () => expect(screen.getByTestId('custom-link')).toBeInTheDocument()
    },
    {
      name: 'applies base styles consistently',
      props: { href: '#' },
      test: (link: HTMLElement) => {
        const expectedClasses = [
          'font-mono', 'font-bold', 'uppercase', 'tracking-wide',
          'cursor-pointer', 'transition-all', 'duration-100', 'ease-in-out', 'border-b-4'
        ];
        expectedClasses.forEach(className => {
          expect(link).toHaveClass(className);
        });
      }
    }
  ];

  propTests.forEach(({ name, props, test }) => {
    it(name, () => {
      const link = renderTextLink('test', props);
      test(link);
    });
  });

  const realWorldExamples = [
    {
      name: 'renders footer privacy link correctly',
      content: 'Privacy',
      props: { href: '#', variant: 'subtle', className: 'text-white hover:text-primary' }  as TestTextLinkProps,
      expectedClasses: ['text-text-secondary', 'text-white', 'hover:text-primary']
    },
    {
      name: 'renders internal navigation link',
      content: 'View All Manuals',
      props: { to: '/manuals', variant: 'primary', size: 'lg' }  as TestTextLinkProps,
      useRouter: true,
      expectedClasses: ['text-primary', 'text-lg'],
      expectedHref: '/manuals'
    },
    {
      name: 'renders external documentation link',
      content: 'External Documentation',
      props: { href: 'https://docs.example.com', variant: 'secondary', target: '_blank' }  as TestTextLinkProps,
      expectedClasses: ['text-secondary'],
      expectedTarget: '_blank',
      expectedRel: 'noopener noreferrer'
    },
    {
      name: 'renders clickable action link',
      content: 'Delete Item',
      props: { onClick: vi.fn(), variant: 'danger', size: 'sm' }  as TestTextLinkProps,
      expectedClasses: ['text-error', 'text-sm'],
      testClick: true
    }
  ];

  describe('real-world usage examples', () => {
    realWorldExamples.forEach(({ name, content, props, useRouter, expectedClasses, expectedHref, expectedTarget, expectedRel, testClick }) => {
      it(name, () => {
        renderTextLink(content, props, useRouter);
        const link = screen.getByText(content);
        
        expectedClasses.forEach(className => {
          expect(link).toHaveClass(className);
        });
        
        if (expectedHref) {
          expect(link).toHaveAttribute('href', expectedHref);
        }
        
        if (expectedTarget) {
          expect(link).toHaveAttribute('target', expectedTarget);
        }
        
        if (expectedRel) {
          expect(link).toHaveAttribute('rel', expectedRel);
        }
        
        if (testClick && props.onClick) {
          fireEvent.click(link);
          expect(props.onClick).toHaveBeenCalled();
        }
      });
    });
  });
});