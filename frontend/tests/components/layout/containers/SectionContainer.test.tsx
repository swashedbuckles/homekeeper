import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionContainer } from '../../../../src/components/layout/containers/SectionContainer';

// Helper function to render SectionContainer and get container element
const renderSectionContainer = (props = {}, children = 'Test Content') => {
  render(
    <SectionContainer {...props}>
      <div>{children}</div>
    </SectionContainer>
  );
  return screen.getByText(children).parentElement!;
};

// Helper function to check base classes
const expectBaseClasses = (container: HTMLElement) => {
  expect(container).toHaveClass('mx-auto', 'px-5');
};

describe('SectionContainer', () => {
  it('renders children correctly', () => {
    render(
      <SectionContainer>
        <div>Test Content</div>
      </SectionContainer>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders with default props', () => {
    const container = renderSectionContainer();
    expect(container).toHaveClass('md:py-10', 'max-w-7xl');
    expectBaseClasses(container);
  });

  const spacingTests = [
    { name: 'renders with tight spacing', spacing: 'sm', expectedClass: 'md:py-8' },
    { name: 'renders with default spacing', spacing: 'md', expectedClass: 'md:py-10' },
    { name: 'renders with loose spacing', spacing: 'lg', expectedClass: 'md:py-16' }
  ];

  describe('spacing prop', () => {
    spacingTests.forEach(({ name, spacing, expectedClass }) => {
      it(name, () => {
        const container = renderSectionContainer({ spacing });
        expect(container).toHaveClass(expectedClass);
        expectBaseClasses(container);
      });
    });
  });

  const heroTests = [
    {
      name: 'renders with constrained width when hero is false',
      hero: false,
      expectedClasses: ['max-w-7xl'],
      notExpectedClasses: []
    },
    {
      name: 'renders with no max width when hero is true',
      hero: true,
      expectedClasses: [],
      notExpectedClasses: ['max-w-7xl']
    }
  ];

  describe('hero prop', () => {
    heroTests.forEach(({ name, hero, expectedClasses, notExpectedClasses }) => {
      it(name, () => {
        const container = renderSectionContainer({ hero });
        
        expectedClasses.forEach(className => {
          expect(container).toHaveClass(className);
        });
        
        notExpectedClasses.forEach(className => {
          expect(container).not.toHaveClass(className);
        });
        
        expectBaseClasses(container);
      });
    });
  });

  const classNameTests = [
    {
      name: 'applies custom className',
      props: { className: 'custom-class' },
      expectedClasses: ['custom-class']
    },
    {
      name: 'combines custom className with spacing classes',
      props: { className: 'bg-red-500 border-2', spacing: 'lg' },
      expectedClasses: ['md:py-16', 'bg-red-500', 'border-2']
    }
  ];

  classNameTests.forEach(({ name, props, expectedClasses }) => {
    it(name, () => {
      const container = renderSectionContainer(props);
      expectedClasses.forEach(className => {
        expect(container).toHaveClass(className);
      });
      expectBaseClasses(container);
    });
  });

  it('passes props correctly to WideContainer', () => {
    const container = renderSectionContainer({ spacing: 'sm', hero: true, className: 'test-class' }, 'Integration Test');
    expect(container).toHaveClass('py-2', 'md:py-8', 'test-class');
    expect(container).not.toHaveClass('max-w-7xl');
    expectBaseClasses(container);
  });

  const contentStructureTests = [
    {
      name: 'renders multiple children correctly',
      content: [
        <h1 key="title">Section Title</h1>,
        <p key="desc">Section description</p>,
        <div key="content">Section content</div>
      ],
      expectedTexts: ['Section Title', 'Section description', 'Section content']
    },
    {
      name: 'renders complex nested content',
      content: (
        <div className="section-wrapper">
          <header><h2>Section Header</h2></header>
          <main><article><p>Article content in section</p></article></main>
        </div>
      ),
      expectedTexts: ['Section Header', 'Article content in section']
    }
  ];

  describe('content structure', () => {
    contentStructureTests.forEach(({ name, content, expectedTexts }) => {
      it(name, () => {
        render(<SectionContainer>{content}</SectionContainer>);
        expectedTexts.forEach(text => {
          expect(screen.getByText(text)).toBeInTheDocument();
        });
      });
    });
  });

  const realWorldExamples = [
    {
      name: 'renders landing page hero section',
      props: { className: 'relative min-h-screen flex items-start', hero: true },
      content: (
        <div className="relative z-10">
          <h1>Hero Title</h1>
          <p>Hero description</p>
        </div>
      ),
      expectedClasses: ['relative', 'min-h-screen', 'flex', 'items-start'],
      notExpectedClasses: ['max-w-7xl'],
      testText: 'Hero Title',
      containerSelector: 'div[class*="px-5"]'
    },
    {
      name: 'renders features section with dark background',
      props: { className: 'bg-text-primary border-t-8 border-primary', spacing: 'lg', hero: true },
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>Feature 1</div>
          <div>Feature 2</div>
          <div>Feature 3</div>
        </div>
      ),
      expectedClasses: ['bg-text-primary', 'border-t-8', 'border-primary', 'md:py-16'],
      testText: 'Feature 1',
      containerSelector: 'div[class*="px-5"]'
    },
    {
      name: 'renders call-to-action section',
      props: { className: 'bg-primary', spacing: 'lg', hero: true },
      content: (
        <div className="text-center max-w-4xl mx-auto">
          <h2>Ready to Get Organized?</h2>
          <p>Join thousands of homeowners</p>
          <button>Start Free Today</button>
        </div>
      ),
      expectedClasses: ['bg-primary', 'py-6', 'md:py-16'],
      notExpectedClasses: ['max-w-7xl'],
      testText: 'Ready to Get Organized?',
      containerSelector: 'div[class*="px-5"]'
    },
    {
      name: 'renders content section with constrained width',
      props: { spacing: 'md' },
      content: (
        <div className="prose max-w-none">
          <h2>Content Section</h2>
          <p>This section has constrained width for better readability</p>
        </div>
      ),
      expectedClasses: ['py-4', 'md:py-10', 'max-w-7xl'],
      testText: 'Content Section',
      containerSelector: 'parent'
    },
    {
      name: 'renders tight spacing for compact sections',
      props: { spacing: 'sm', className: 'border-b border-gray-200' },
      content: (
        <nav>
          <ul>
            <li>Navigation Item 1</li>
            <li>Navigation Item 2</li>
          </ul>
        </nav>
      ),
      expectedClasses: ['py-2', 'md:py-8', 'border-b', 'border-gray-200'],
      testText: 'Navigation Item 1',
      containerSelector: 'div[class*="px-5"]'
    }
  ];

  describe('real-world usage examples', () => {
    realWorldExamples.forEach(({ name, props, content, expectedClasses, notExpectedClasses, testText, containerSelector }) => {
      it(name, () => {
        render(<SectionContainer {...props}>{content}</SectionContainer>);
        
        const container = containerSelector === 'parent' 
          ? screen.getByText(testText).parentElement?.parentElement
          : screen.getByText(testText).closest(containerSelector);
        
        expectedClasses.forEach(className => {
          expect(container).toHaveClass(className);
        });
        
        if (notExpectedClasses) {
          notExpectedClasses.forEach(className => {
            expect(container).not.toHaveClass(className);
          });
        }
        
        expect(screen.getByText(testText)).toBeInTheDocument();
      });
    });
  });
});