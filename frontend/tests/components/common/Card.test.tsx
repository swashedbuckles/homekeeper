import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Card } from '../../../src/components/common/Card';
import { createBasicRenderingTests } from '../../helpers/componentTestHelpers';

describe('Card', () => {
  // Basic rendering tests
  createBasicRenderingTests('Card', Card, [
    {
      description: 'renders children content',
      props: { children: 'Test card content' } as any,
      expectedText: 'Test card content'
    }
  ]);

  it('renders as div by default', () => {
    const { container } = render(<Card>Content</Card>);
    
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  // Variant and style tests
  it('applies default variant styles', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('bg-white', 'border-text-primary', 'brutal-shadow-dark');
  });

  it('applies subtle variant styles', () => {
    const { container } = render(<Card variant="subtle">Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('bg-background', 'border-text-primary');
  });

  it('applies correct padding styles', () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('p-8');
  });

  it('applies hover styles when clickable', () => {
    const { container } = render(<Card onClick={() => {}}>Content</Card>);
    
    const card = container.firstChild;
    expect(card).toHaveClass('cursor-pointer', 'brutal-transition');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    
    const {getByTestId} = render(<Card onClick={mockOnClick} testId='abc'>Clickable</Card>);
    
    await user.click(getByTestId('abc'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    
    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });
});