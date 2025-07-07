import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeaderGradient } from '../../../src/components/headers/HeaderGradient';

describe('HeaderGradient', () => {
  it('renders gradient bar with correct classes', () => {
    render(<HeaderGradient />);
    
    const gradient = screen.getByRole('presentation', { hidden: true });
    expect(gradient).toHaveClass(
      'absolute',
      'bottom-0',
      'left-0',
      'w-full',
      'h-2',
      'bg-gradient-to-r'
    );
  });

  it('applies the multi-color gradient', () => {
    const {getByRole} = render(<HeaderGradient />);
    
    const gradient = getByRole('presentation', { hidden: true });
    expect(gradient).toHaveClass('from-primary', 'via-secondary', 'via-accent', 'to-error');
  });
});