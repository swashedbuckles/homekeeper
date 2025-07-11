import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContentContainer } from '../../../../src/components/layout/containers/ContentContainer';

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
    render(
      <ContentContainer>
        <div data-testid="content">Default Content</div>
      </ContentContainer>
    );
    
    const container = screen.getByTestId('content').parentElement;
    expect(container).toHaveClass('max-w-7xl', 'mx-auto', 'px-5');
  });

  describe('maxWidth prop', () => {
    it('renders with 4xl max width', () => {
      render(
        <ContentContainer maxWidth="4xl">
          <div data-testid="content">4XL Content</div>
        </ContentContainer>
      );
      
      const container = screen.getByTestId('content').parentElement;
      expect(container).toHaveClass('max-w-4xl');
    });

    it('renders with 5xl max width', () => {
      render(
        <ContentContainer maxWidth="5xl">
          <div data-testid="content">5XL Content</div>
        </ContentContainer>
      );
      
      const container = screen.getByTestId('content').parentElement;
      expect(container).toHaveClass('max-w-5xl');
    });

    it('renders with 6xl max width', () => {
      render(
        <ContentContainer maxWidth="6xl">
          <div data-testid="content">6XL Content</div>
        </ContentContainer>
      );
      
      const container = screen.getByTestId('content').parentElement;
      expect(container).toHaveClass('max-w-6xl');
    });

    it('renders with 7xl max width (default)', () => {
      render(
        <ContentContainer maxWidth="7xl">
          <div data-testid="content">7XL Content</div>
        </ContentContainer>
      );
      
      const container = screen.getByTestId('content').parentElement;
      expect(container).toHaveClass('max-w-7xl');
    });

    it('renders with no max width when set to none', () => {
      render(
        <ContentContainer maxWidth="none">
          <div data-testid="content">No Max Width</div>
        </ContentContainer>
      );
      
      const container = screen.getByTestId('content').parentElement;
      expect(container).not.toHaveClass('max-w-7xl');
      expect(container).not.toHaveClass('max-w-6xl');
      expect(container).not.toHaveClass('max-w-5xl');
      expect(container).not.toHaveClass('max-w-4xl');
      // Should still have mx-auto and px-5
      expect(container).toHaveClass('mx-auto', 'px-5');
    });
  });

  it('applies custom className', () => {
    render(
      <ContentContainer className="custom-class">
        <div data-testid="content">Custom Class Content</div>
      </ContentContainer>
    );
    
    const container = screen.getByTestId('content').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('combines custom className with default classes', () => {
    render(
      <ContentContainer className="bg-blue-500 py-8" maxWidth="5xl">
        <div data-testid="content">Combined Classes</div>
      </ContentContainer>
    );
    
    const container = screen.getByTestId('content').parentElement;
    expect(container).toHaveClass(
      'max-w-5xl',
      'mx-auto',
      'px-5',
      'bg-blue-500',
      'py-8'
    );
  });

  it('applies base layout styles consistently', () => {
    render(
      <ContentContainer>
        <div data-testid="content">Base Styles</div>
      </ContentContainer>
    );
    
    const container = screen.getByTestId('content').parentElement;
    expect(container).toHaveClass('mx-auto', 'px-5');
  });

  describe('content structure', () => {
    it('renders multiple children correctly', () => {
      render(
        <ContentContainer>
          <h1>Container Title</h1>
          <p>Container description</p>
          <div>Container content</div>
        </ContentContainer>
      );
      
      expect(screen.getByText('Container Title')).toBeInTheDocument();
      expect(screen.getByText('Container description')).toBeInTheDocument();
      expect(screen.getByText('Container content')).toBeInTheDocument();
    });

    it('renders complex nested content', () => {
      render(
        <ContentContainer>
          <div className="content-wrapper">
            <header>
              <h2>Content Header</h2>
            </header>
            <main>
              <section>
                <p>Main content goes here</p>
              </section>
            </main>
            <footer>
              <p>Content footer</p>
            </footer>
          </div>
        </ContentContainer>
      );
      
      expect(screen.getByText('Content Header')).toBeInTheDocument();
      expect(screen.getByText('Main content goes here')).toBeInTheDocument();
      expect(screen.getByText('Content footer')).toBeInTheDocument();
    });
  });

  describe('responsive behavior', () => {
    it('handles max width classes correctly for different screen sizes', () => {
      render(
        <ContentContainer maxWidth="6xl">
          <div data-testid="content">Responsive Content</div>
        </ContentContainer>
      );
      
      const container = screen.getByTestId('content').parentElement;
      expect(container).toHaveClass('max-w-6xl');
      // The container should center itself and have horizontal padding
      expect(container).toHaveClass('mx-auto', 'px-5');
    });
  });

  describe('real-world usage examples', () => {
    it('renders main content area with standard width', () => {
      render(
        <ContentContainer maxWidth="7xl">
          <main>
            <h1>Main Content</h1>
            <p>This is the main content area with standard maximum width</p>
          </main>
        </ContentContainer>
      );
      
      const container = screen.getByText('Main Content').parentElement?.parentElement;
      expect(container).toHaveClass('max-w-7xl', 'mx-auto', 'px-5');
    });

    it('renders narrow content for better readability', () => {
      render(
        <ContentContainer maxWidth="4xl" className="prose">
          <article>
            <h2>Article Title</h2>
            <p>This article has a narrower max width for better reading experience</p>
          </article>
        </ContentContainer>
      );
      
      const container = screen.getByText('Article Title').parentElement?.parentElement;
      expect(container).toHaveClass('max-w-4xl', 'prose');
    });

    it('renders full-width hero section', () => {
      render(
        <ContentContainer maxWidth="none" className="bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="hero-content">
            <h1>Full Width Hero</h1>
            <p>This hero section spans the full width of the viewport</p>
          </div>
        </ContentContainer>
      );
      
      const container = screen.getByText('Full Width Hero').parentElement?.parentElement;
      expect(container).toHaveClass('bg-gradient-to-r', 'from-blue-500', 'to-purple-600');
      expect(container).not.toHaveClass('max-w-7xl');
      expect(container).toHaveClass('mx-auto', 'px-5'); // Still centered with padding
    });

    it('renders dashboard layout with extra wide content', () => {
      render(
        <ContentContainer maxWidth="7xl" className="py-8">
          <div className="dashboard-layout">
            <header>Dashboard Header</header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>Widget 1</div>
              <div>Widget 2</div>
              <div>Widget 3</div>
            </div>
          </div>
        </ContentContainer>
      );
      
      const container = screen.getByText('Dashboard Header').parentElement?.parentElement;
      expect(container).toHaveClass('max-w-7xl', 'py-8');
      expect(screen.getByText('Widget 1')).toBeInTheDocument();
    });

    it('renders form container with medium width', () => {
      render(
        <ContentContainer maxWidth="5xl" className="bg-white rounded-lg shadow-lg p-8">
          <form>
            <h2>Contact Form</h2>
            <input type="text" placeholder="Name" />
            <textarea placeholder="Message"></textarea>
            <button type="submit">Submit</button>
          </form>
        </ContentContainer>
      );
      
      const container = screen.getByText('Contact Form').parentElement?.parentElement;
      expect(container).toHaveClass('max-w-5xl', 'bg-white', 'rounded-lg', 'shadow-lg', 'p-8');
    });
  });
});