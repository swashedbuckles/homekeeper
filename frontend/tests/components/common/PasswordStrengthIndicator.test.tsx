// frontend/tests/components/common/PasswordStrengthIndicator.test.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PasswordStrengthIndicator } from '../../../src/components/common/PasswordStrengthIndicator';

describe('PasswordStrengthIndicator', () => {
  it('renders three segments', () => {
    const { container } = render(<PasswordStrengthIndicator password="" />);
    
    const segments = container.querySelectorAll('.h-2.flex-1');
    expect(segments).toHaveLength(3);
  });

  it('shows no active segments for weak password (strength < 2)', () => {
    const { container } = render(<PasswordStrengthIndicator password="weak" />);
    
    const activeSegments = container.querySelectorAll('.bg-red-500, .bg-yellow-500, .bg-green-500');
    const inactiveSegments = container.querySelectorAll('.bg-gray-200');
    
    expect(activeSegments).toHaveLength(0);
    expect(inactiveSegments).toHaveLength(3);
  });

  it.skip('shows one red segment for password meeting 2 requirements', () => {
    /** @todo fix?? */
    const { container } = render(<PasswordStrengthIndicator password="Password" />); // length + uppercase + lowercase
    
    const redSegments = container.querySelectorAll('.bg-red-500');
    const inactiveSegments = container.querySelectorAll('.bg-gray-200');
    
    expect(redSegments).toHaveLength(1);
    expect(inactiveSegments).toHaveLength(2);
  });

  it('shows two yellow segments for password meeting 4 requirements', () => {
    const { container } = render(<PasswordStrengthIndicator password="Password123" />); // length + upper + lower + number
    
    const yellowSegments = container.querySelectorAll('.bg-yellow-500');
    const inactiveSegments = container.querySelectorAll('.bg-gray-200');
    
    expect(yellowSegments).toHaveLength(2);
    expect(inactiveSegments).toHaveLength(1);
  });

  it('shows three green segments for password meeting all 5 requirements', () => {
    const { container } = render(<PasswordStrengthIndicator password="Password123!" />); // all requirements
    
    const greenSegments = container.querySelectorAll('.bg-green-500');
    const inactiveSegments = container.querySelectorAll('.bg-gray-200');
    
    expect(greenSegments).toHaveLength(3);
    expect(inactiveSegments).toHaveLength(0);
  });

  it('updates segments when password changes', () => {
    const { container, rerender } = render(<PasswordStrengthIndicator password="weak" />);
    
    // Initially weak - no active segments
    let activeSegments = container.querySelectorAll('.bg-red-500, .bg-yellow-500, .bg-green-500');
    expect(activeSegments).toHaveLength(0);

    // Change to strong password
    rerender(<PasswordStrengthIndicator password="StrongPass123!" />);
    activeSegments = container.querySelectorAll('.bg-green-500');
    expect(activeSegments).toHaveLength(3);
  });

  it('applies correct classes to all segments', () => {
    const { container } = render(<PasswordStrengthIndicator password="" />);
    
    const segments = container.querySelectorAll('.h-2.flex-1');
    segments.forEach(segment => {
      expect(segment).toHaveClass('h-2', 'flex-1', 'rounded-sm', 'transition-all', 'duration-300');
    });
  });
});