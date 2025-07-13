import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionContainer } from '../../../../src/components/layout/containers/SectionContainer';

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
    render(
      <SectionContainer>
        <div>Default Content</div>
      </SectionContainer>
    );
    
    const container = screen.getByText('Default Content').parentElement;
    expect(container).toHaveClass('py-10'); // default spacing (md = py-10)
    expect(container).toHaveClass('max-w-7xl'); // default maxWidth
    expect(container).toHaveClass('mx-auto', 'px-5'); // WideContainer base classes
  });

  describe('spacing prop', () => {
    it('renders with tight spacing', () => {
      render(
        <SectionContainer spacing="sm">
          <div>Tight Content</div>
        </SectionContainer>
      );
      
      const container = screen.getByText('Tight Content').parentElement;
      expect(container).toHaveClass('py-8'); // sm = py-8
    });

    it('renders with default spacing', () => {
      render(
        <SectionContainer spacing="md">
          <div>Default Content</div>
        </SectionContainer>
      );
      
      const container = screen.getByText('Default Content').parentElement;
      expect(container).toHaveClass('py-10'); // md = py-10
    });

    it('renders with loose spacing', () => {
      render(
        <SectionContainer spacing="lg">
          <div>Loose Content</div>
        </SectionContainer>
      );
      
      const container = screen.getByText('Loose Content').parentElement;
      expect(container).toHaveClass('py-16'); // lg = py-16
    });
  });

  describe('hero prop', () => {
    it('renders with constrained width when hero is false', () => {
      render(
        <SectionContainer hero={false}>
          <div>Constrained Content</div>
        </SectionContainer>
      );
      
      const container = screen.getByText('Constrained Content').parentElement;
      expect(container).toHaveClass('max-w-7xl'); // hero=false uses 7xl maxWidth
    });

    it('renders with no max width when hero is true', () => {
      render(
        <SectionContainer hero={true}>
          <div>Hero Content</div>
        </SectionContainer>
      );
      
      const container = screen.getByText('Hero Content').parentElement;
      expect(container).not.toHaveClass('max-w-7xl'); // hero=true uses maxWidth='none' (no max-width class)
    });
  });

  it('applies custom className', () => {
    render(
      <SectionContainer className="custom-class">
        <div>Custom Class Content</div>
      </SectionContainer>
    );
    
    const container = screen.getByText('Custom Class Content').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('combines custom className with spacing classes', () => {
    render(
      <SectionContainer className="bg-red-500 border-2" spacing="lg">
        <div>Combined Classes</div>
      </SectionContainer>
    );
    
    const container = screen.getByText('Combined Classes').parentElement;
    expect(container).toHaveClass('py-16', 'bg-red-500', 'border-2');
  });

  describe('WideContainer integration', () => {
    it('passes props correctly to WideContainer', () => {
      render(
        <SectionContainer spacing="sm" hero={true} className="test-class">
          <div>Integration Test</div>
        </SectionContainer>
      );
      
      const container = screen.getByText('Integration Test').parentElement;
      expect(container).toHaveClass('py-8', 'test-class'); // spacing + custom class
      expect(container).toHaveClass('mx-auto', 'px-5'); // WideContainer base classes
      expect(container).not.toHaveClass('max-w-7xl'); // hero=true means no max-width constraint
    });
  });

  describe('content structure', () => {
    it('renders multiple children correctly', () => {
      render(
        <SectionContainer>
          <h1>Section Title</h1>
          <p>Section description</p>
          <div>Section content</div>
        </SectionContainer>
      );
      
      expect(screen.getByText('Section Title')).toBeInTheDocument();
      expect(screen.getByText('Section description')).toBeInTheDocument();
      expect(screen.getByText('Section content')).toBeInTheDocument();
    });

    it('renders complex nested content', () => {
      render(
        <SectionContainer>
          <div className="section-wrapper">
            <header>
              <h2>Section Header</h2>
            </header>
            <main>
              <article>
                <p>Article content in section</p>
              </article>
            </main>
          </div>
        </SectionContainer>
      );
      
      expect(screen.getByText('Section Header')).toBeInTheDocument();
      expect(screen.getByText('Article content in section')).toBeInTheDocument();
    });
  });

  describe('real-world usage examples', () => {
    it('renders landing page hero section', () => {
      render(
        <SectionContainer className="relative min-h-screen flex items-start" hero>
          <div className="relative z-10">
            <h1>Hero Title</h1>
            <p>Hero description</p>
          </div>
        </SectionContainer>
      );
      
      // Find the WideContainer div (should have mx-auto and px-5)
      const container = screen.getByText('Hero Title').closest('div[class*="px-5"]');
      expect(container).toHaveClass('relative', 'min-h-screen', 'flex', 'items-start');
      expect(container).toHaveClass('mx-auto', 'px-5'); // WideContainer base classes
      expect(container).not.toHaveClass('max-w-7xl'); // Hero sections use full width
      expect(screen.getByText('Hero Title')).toBeInTheDocument();
    });

    it('renders features section with dark background', () => {
      render(
        <SectionContainer 
          className="bg-text-primary border-t-8 border-primary" 
          spacing="lg" 
          hero
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>Feature 1</div>
            <div>Feature 2</div>
            <div>Feature 3</div>
          </div>
        </SectionContainer>
      );
      
      const container = screen.getByText('Feature 1').closest('div[class*="px-5"]');
      expect(container).toHaveClass('bg-text-primary', 'border-t-8', 'border-primary', 'py-16');
      expect(screen.getByText('Feature 1')).toBeInTheDocument();
    });

    it('renders call-to-action section', () => {
      render(
        <SectionContainer className="bg-primary" spacing="lg" hero>
          <div className="text-center max-w-4xl mx-auto">
            <h2>Ready to Get Organized?</h2>
            <p>Join thousands of homeowners</p>
            <button>Start Free Today</button>
          </div>
        </SectionContainer>
      );
      
      // Find the WideContainer by looking for the element with px-5 and bg-primary
      const container = screen.getByText('Ready to Get Organized?').closest('div[class*="px-5"]');
      expect(container).toHaveClass('bg-primary', 'py-16');
      expect(container).not.toHaveClass('max-w-7xl'); // hero=true means no max-width
      expect(screen.getByText('Ready to Get Organized?')).toBeInTheDocument();
    });

    it('renders content section with constrained width', () => {
      render(
        <SectionContainer spacing="md">
          <div className="prose max-w-none">
            <h2>Content Section</h2>
            <p>This section has constrained width for better readability</p>
          </div>
        </SectionContainer>
      );
      
      const container = screen.getByText('Content Section').parentElement?.parentElement;
      expect(container).toHaveClass('py-10'); // md spacing
      expect(container).toHaveClass('max-w-7xl'); // Constrained width (default)
    });

    it('renders tight spacing for compact sections', () => {
      render(
        <SectionContainer spacing="sm" className="border-b border-gray-200">
          <nav>
            <ul>
              <li>Navigation Item 1</li>
              <li>Navigation Item 2</li>
            </ul>
          </nav>
        </SectionContainer>
      );
      
      const container = screen.getByText('Navigation Item 1').closest('div[class*="px-5"]');
      expect(container).toHaveClass('py-8', 'border-b', 'border-gray-200');
    });
  });
});