import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NarrowContainer as PageContainer } from '../../../../src/components/layout/containers/NarrowContainer';

// Helper function to render PageContainer and get container element
const renderPageContainer = (props = {}, children = 'Test Content') => {
  render(
    <PageContainer {...props}>
      <div data-testid="content">{children}</div>
    </PageContainer>
  );
  return screen.getByTestId('content').parentElement!;
};

// Helper function to check base classes
const expectBaseClasses = (container: HTMLElement) => {
  expect(container).toHaveClass('mx-auto', 'px-6', 'py-12');
};

describe('PageContainer', () => {
  it('renders children correctly', () => {
    render(
      <PageContainer>
        <div>Test Content</div>
      </PageContainer>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders with default props', () => {
    const container = renderPageContainer();
    expect(container).toHaveClass('max-w-lg');
    expectBaseClasses(container);
  });

  const maxWidthTests = [
    { name: 'renders with md max width', maxWidth: 'md', expectedClass: 'max-w-md' },
    { name: 'renders with lg max width (default)', maxWidth: 'lg', expectedClass: 'max-w-lg' },
    { name: 'renders with xl max width', maxWidth: 'xl', expectedClass: 'max-w-xl' },
    { name: 'renders with 2xl max width', maxWidth: '2xl', expectedClass: 'max-w-2xl' }
  ];

  describe('maxWidth prop', () => {
    maxWidthTests.forEach(({ name, maxWidth, expectedClass }) => {
      it(name, () => {
        const container = renderPageContainer({ maxWidth });
        expect(container).toHaveClass(expectedClass);
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
      name: 'combines custom className with default classes',
      props: { className: 'bg-red-500 border-2', maxWidth: 'xl' },
      expectedClasses: ['max-w-xl', 'bg-red-500', 'border-2']
    },
    {
      name: 'applies base layout styles consistently',
      props: {},
      expectedClasses: ['mx-auto', 'px-6', 'py-12']
    }
  ];

  classNameTests.forEach(({ name, props, expectedClasses }) => {
    it(name, () => {
      const container = renderPageContainer(props);
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
        <h1 key="title">Title</h1>,
        <p key="desc">Description</p>,
        <button key="action">Action</button>
      ],
      expectedTexts: ['Title', 'Description', 'Action']
    },
    {
      name: 'renders complex nested content',
      content: (
        <div className="content-wrapper">
          <header><h1>Page Header</h1></header>
          <main><section><p>Page content goes here</p></section></main>
        </div>
      ),
      expectedTexts: ['Page Header', 'Page content goes here']
    }
  ];

  describe('content structure', () => {
    contentStructureTests.forEach(({ name, content, expectedTexts }) => {
      it(name, () => {
        render(<PageContainer>{content}</PageContainer>);
        expectedTexts.forEach(text => {
          expect(screen.getByText(text)).toBeInTheDocument();
        });
      });
    });
  });

  const realWorldExamples = [
    {
      name: 'renders dashboard page container',
      props: { maxWidth: '2xl' },
      content: (
        <div className="dashboard-content">
          <h1>Dashboard</h1>
          <div className="stats-grid">Statistics here</div>
        </div>
      ),
      expectedClasses: ['max-w-2xl'],
      testText: 'Dashboard',
      additionalTest: () => expect(screen.getByText('Statistics here')).toBeInTheDocument()
    },
    {
      name: 'renders form page container',
      props: { maxWidth: 'md', className: 'bg-background' },
      content: (
        <form>
          <h2>Login Form</h2>
          <input type="email" placeholder="Email" />
          <button type="submit">Submit</button>
        </form>
      ),
      expectedClasses: ['max-w-md', 'bg-background'],
      testText: 'Login Form'
    },
    {
      name: 'renders content page with custom spacing',
      props: { className: 'py-20', maxWidth: 'xl' },
      content: (
        <article>
          <h1>Article Title</h1>
          <p>Article content with custom spacing</p>
        </article>
      ),
      expectedClasses: ['max-w-xl', 'py-20', 'py-12'], // Both classes are present
      testText: 'Article Title'
    },
    {
      name: 'renders narrow content container',
      props: { maxWidth: 'md' },
      content: (
        <div className="text-center">
          <h1>Narrow Content</h1>
          <p>This content is constrained to medium width for better readability</p>
        </div>
      ),
      expectedClasses: ['max-w-md'],
      testText: 'Narrow Content'
    }
  ];

  describe('real-world usage examples', () => {
    realWorldExamples.forEach(({ name, props, content, expectedClasses, testText, additionalTest }) => {
      it(name, () => {
        render(<PageContainer {...props}>{content}</PageContainer>);
        const container = screen.getByText(testText).parentElement?.parentElement;
        
        expectedClasses.forEach(className => {
          expect(container).toHaveClass(className);
        });
        
        expectBaseClasses(container!);
        
        if (additionalTest) {
          additionalTest();
        }
      });
    });
  });
});