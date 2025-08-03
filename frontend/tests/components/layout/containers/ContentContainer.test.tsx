import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WideContainer as ContentContainer } from '../../../../src/components/layout/containers/WideContainer';

// Helper function to render ContentContainer and get container element
const renderContentContainer = (props = {}, children = 'Test Content') => {
  render(
    <ContentContainer {...props}>
      <div data-testid="content">{children}</div>
    </ContentContainer>
  );
  return screen.getByTestId('content').parentElement!;
};

// Helper function to check base classes
const expectBaseClasses = (container: HTMLElement) => {
  expect(container).toHaveClass('mx-auto', 'px-5');
};

describe('ContentContainer', () => {
  it('renders children correctly', () => {
    render(
      <ContentContainer>
        <div>Test Content</div>
      </ContentContainer>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders with default props', () => {
    const container = renderContentContainer();
    expect(container).toHaveClass('max-w-7xl');
    expectBaseClasses(container);
  });

  const maxWidthTests = [
    { name: 'renders with 4xl max width', maxWidth: '4xl', expectedClass: 'max-w-4xl' },
    { name: 'renders with 5xl max width', maxWidth: '5xl', expectedClass: 'max-w-5xl' },
    { name: 'renders with 6xl max width', maxWidth: '6xl', expectedClass: 'max-w-6xl' },
    { name: 'renders with 7xl max width (default)', maxWidth: '7xl', expectedClass: 'max-w-7xl' }
  ];

  describe('maxWidth prop', () => {
    maxWidthTests.forEach(({ name, maxWidth, expectedClass }) => {
      it(name, () => {
        const container = renderContentContainer({ maxWidth });
        expect(container).toHaveClass(expectedClass);
        expectBaseClasses(container);
      });
    });

    it('renders with no max width when set to none', () => {
      const container = renderContentContainer({ maxWidth: 'none' });
      const maxWidthClasses = ['max-w-7xl', 'max-w-6xl', 'max-w-5xl', 'max-w-4xl'];
      maxWidthClasses.forEach(className => {
        expect(container).not.toHaveClass(className);
      });
      expectBaseClasses(container);
    });
  });

  const classNameTests = [
    {
      name: 'applies custom className',
      props: { className: 'custom-class' },
      expectedClasses: ['custom-class']
    },
    {
      name: 'combines custom className with default classes',
      props: { className: 'bg-blue-500 py-8', maxWidth: '5xl' },
      expectedClasses: ['max-w-5xl', 'bg-blue-500', 'py-8']
    },
    {
      name: 'applies base layout styles consistently',
      props: {},
      expectedClasses: ['mx-auto', 'px-5']
    }
  ];

  classNameTests.forEach(({ name, props, expectedClasses }) => {
    it(name, () => {
      const container = renderContentContainer(props);
      expectedClasses.forEach(className => {
        expect(container).toHaveClass(className);
      });
      expectBaseClasses(container);
    });
  });

  const contentStructureTests = [
    {
      name: 'renders multiple children correctly',
      content: [
        <h1 key="title">Container Title</h1>,
        <p key="desc">Container description</p>,
        <div key="content">Container content</div>
      ],
      expectedTexts: ['Container Title', 'Container description', 'Container content']
    },
    {
      name: 'renders complex nested content',
      content: (
        <div className="content-wrapper">
          <header><h2>Content Header</h2></header>
          <main><section><p>Main content goes here</p></section></main>
          <footer><p>Content footer</p></footer>
        </div>
      ),
      expectedTexts: ['Content Header', 'Main content goes here', 'Content footer']
    }
  ];

  describe('content structure', () => {
    contentStructureTests.forEach(({ name, content, expectedTexts }) => {
      it(name, () => {
        render(<ContentContainer>{content}</ContentContainer>);
        expectedTexts.forEach(text => {
          expect(screen.getByText(text)).toBeInTheDocument();
        });
      });
    });
  });

  it('handles max width classes correctly for different screen sizes', () => {
    const container = renderContentContainer({ maxWidth: '6xl' });
    expect(container).toHaveClass('max-w-6xl');
    expectBaseClasses(container);
  });

  const realWorldExamples = [
    {
      name: 'renders main content area with standard width',
      props: { maxWidth: '7xl' },
      content: (
        <main>
          <h1>Main Content</h1>
          <p>This is the main content area with standard maximum width</p>
        </main>
      ),
      expectedClasses: ['max-w-7xl'],
      testText: 'Main Content'
    },
    {
      name: 'renders narrow content for better readability',
      props: { maxWidth: '4xl', className: 'prose' },
      content: (
        <article>
          <h2>Article Title</h2>
          <p>This article has a narrower max width for better reading experience</p>
        </article>
      ),
      expectedClasses: ['max-w-4xl', 'prose'],
      testText: 'Article Title'
    },
    {
      name: 'renders full-width hero section',
      props: { maxWidth: 'none', className: 'bg-gradient-to-r from-blue-500 to-purple-600' },
      content: (
        <div className="hero-content">
          <h1>Full Width Hero</h1>
          <p>This hero section spans the full width of the viewport</p>
        </div>
      ),
      expectedClasses: ['bg-gradient-to-r', 'from-blue-500', 'to-purple-600'],
      notExpectedClasses: ['max-w-7xl'],
      testText: 'Full Width Hero'
    },
    {
      name: 'renders dashboard layout with extra wide content',
      props: { maxWidth: '7xl', className: 'py-8' },
      content: (
        <div className="dashboard-layout">
          <header>Dashboard Header</header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>Widget 1</div>
            <div>Widget 2</div>
            <div>Widget 3</div>
          </div>
        </div>
      ),
      expectedClasses: ['max-w-7xl', 'py-8'],
      testText: 'Dashboard Header',
      additionalTest: () => expect(screen.getByText('Widget 1')).toBeInTheDocument()
    },
    {
      name: 'renders form container with medium width',
      props: { maxWidth: '5xl', className: 'bg-white rounded-lg shadow-lg p-8' },
      content: (
        <form>
          <h2>Contact Form</h2>
          <input type="text" placeholder="Name" />
          <textarea placeholder="Message"></textarea>
          <button type="submit">Submit</button>
        </form>
      ),
      expectedClasses: ['max-w-5xl', 'bg-white', 'rounded-lg', 'shadow-lg', 'p-8'],
      testText: 'Contact Form'
    }
  ];

  describe('real-world usage examples', () => {
    realWorldExamples.forEach(({ name, props, content, expectedClasses, notExpectedClasses, testText, additionalTest }) => {
      it(name, () => {
        render(<ContentContainer {...props}>{content}</ContentContainer>);
        const container = screen.getByText(testText).parentElement?.parentElement;
        
        expectedClasses.forEach(className => {
          expect(container).toHaveClass(className);
        });
        
        if (notExpectedClasses) {
          notExpectedClasses.forEach(className => {
            expect(container).not.toHaveClass(className);
          });
        }
        
        expectBaseClasses(container!);
        
        if (additionalTest) {
          additionalTest();
        }
      });
    });
  });
});