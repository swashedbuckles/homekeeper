import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageContainer } from '../../../src/components/common/PageContainer';

describe('PageContainer', () => {
  it('renders children correctly', () => {
    render(
      <PageContainer>
        <div>Test content</div>
      </PageContainer>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(
      <PageContainer>
        <div>Test content</div>
      </PageContainer>
    );
    
    const pageContainer = container.firstChild;
    expect(pageContainer).toHaveClass('max-w-md', 'mx-auto', 'px-4', 'py-8');
  });

  it('renders multiple children', () => {
    render(
      <PageContainer>
        <h1>Title</h1>
        <p>Description</p>
      </PageContainer>
    );
    
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});