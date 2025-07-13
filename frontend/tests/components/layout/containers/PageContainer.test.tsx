import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NarrowContainer as PageContainer } from '../../../../src/components/layout/containers/NarrowContainer';

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
    render(
      <PageContainer>
        <div data-testid="content">Default Content</div>
      </PageContainer>
    );
    
    const container = screen.getByTestId('content').parentElement;
    expect(container).toHaveClass('max-w-lg', 'mx-auto', 'px-6', 'py-12');
  });

  describe('maxWidth prop', () => {
    it('renders with md max width', () => {
      render(
        <PageContainer maxWidth="md">
          <div data-testid="content">MD Content</div>
        </PageContainer>
      );
      
      const container = screen.getByTestId('content').parentElement;
      expect(container).toHaveClass('max-w-md');
    });

    it('renders with lg max width (default)', () => {
      render(
        <PageContainer maxWidth="lg">
          <div data-testid="content">LG Content</div>
        </PageContainer>
      );
      
      const container = screen.getByTestId('content').parentElement;
      expect(container).toHaveClass('max-w-lg');
    });

    it('renders with xl max width', () => {
      render(
        <PageContainer maxWidth="xl">
          <div data-testid="content">XL Content</div>
        </PageContainer>
      );
      
      const container = screen.getByTestId('content').parentElement;
      expect(container).toHaveClass('max-w-xl');
    });

    it('renders with 2xl max width', () => {
      render(
        <PageContainer maxWidth="2xl">
          <div data-testid="content">2XL Content</div>
        </PageContainer>
      );
      
      const container = screen.getByTestId('content').parentElement;
      expect(container).toHaveClass('max-w-2xl');
    });
  });

  it('applies custom className', () => {
    render(
      <PageContainer className="custom-class">
        <div data-testid="content">Custom Class Content</div>
      </PageContainer>
    );
    
    const container = screen.getByTestId('content').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('combines custom className with default classes', () => {
    render(
      <PageContainer className="bg-red-500 border-2" maxWidth="xl">
        <div data-testid="content">Combined Classes</div>
      </PageContainer>
    );
    
    const container = screen.getByTestId('content').parentElement;
    expect(container).toHaveClass(
      'max-w-xl',
      'mx-auto', 
      'px-6', 
      'py-12',
      'bg-red-500',
      'border-2'
    );
  });

  it('applies base layout styles consistently', () => {
    render(
      <PageContainer>
        <div data-testid="content">Base Styles</div>
      </PageContainer>
    );
    
    const container = screen.getByTestId('content').parentElement;
    expect(container).toHaveClass('mx-auto', 'px-6', 'py-12');
  });

  describe('content structure', () => {
    it('renders multiple children correctly', () => {
      render(
        <PageContainer>
          <h1>Title</h1>
          <p>Description</p>
          <button>Action</button>
        </PageContainer>
      );
      
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('renders complex nested content', () => {
      render(
        <PageContainer>
          <div className="content-wrapper">
            <header>
              <h1>Page Header</h1>
            </header>
            <main>
              <section>
                <p>Page content goes here</p>
              </section>
            </main>
          </div>
        </PageContainer>
      );
      
      expect(screen.getByText('Page Header')).toBeInTheDocument();
      expect(screen.getByText('Page content goes here')).toBeInTheDocument();
    });
  });

  describe('real-world usage examples', () => {
    it('renders dashboard page container', () => {
      render(
        <PageContainer maxWidth="2xl">
          <div className="dashboard-content">
            <h1>Dashboard</h1>
            <div className="stats-grid">Statistics here</div>
          </div>
        </PageContainer>
      );
      
      const container = screen.getByText('Dashboard').parentElement?.parentElement;
      expect(container).toHaveClass('max-w-2xl', 'mx-auto');
      expect(screen.getByText('Statistics here')).toBeInTheDocument();
    });

    it('renders form page container', () => {
      render(
        <PageContainer maxWidth="md" className="bg-background">
          <form>
            <h2>Login Form</h2>
            <input type="email" placeholder="Email" />
            <button type="submit">Submit</button>
          </form>
        </PageContainer>
      );
      
      const container = screen.getByText('Login Form').parentElement?.parentElement;
      expect(container).toHaveClass('max-w-md', 'bg-background');
    });

    it('renders content page with custom spacing', () => {
      render(
        <PageContainer className="py-20" maxWidth="xl">
          <article>
            <h1>Article Title</h1>
            <p>Article content with custom spacing</p>
          </article>
        </PageContainer>
      );
      
      const container = screen.getByText('Article Title').parentElement?.parentElement;
      expect(container).toHaveClass('max-w-xl', 'py-20', 'py-12'); // Both classes are present
    });

    it('renders narrow content container', () => {
      render(
        <PageContainer maxWidth="md">
          <div className="text-center">
            <h1>Narrow Content</h1>
            <p>This content is constrained to medium width for better readability</p>
          </div>
        </PageContainer>
      );
      
      const container = screen.getByText('Narrow Content').parentElement?.parentElement;
      expect(container).toHaveClass('max-w-md', 'mx-auto');
    });
  });
});