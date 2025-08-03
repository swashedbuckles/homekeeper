// frontend/tests/components/common/PasswordStrengthIndicator.test.tsx
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PasswordStrengthIndicator } from '../../../src/components/form/PasswordStrengthIndicator';

// Helper function to render password strength indicator
const renderPasswordStrengthIndicator = (password: string) => {
  return render(<PasswordStrengthIndicator password={password} />);
};

// Helper function to get segment counts by type
const getSegmentCounts = (container: HTMLElement) => {
  const activeSegments = container.querySelectorAll('.bg-error, .bg-warning, .bg-success');
  const errorSegments = container.querySelectorAll('.bg-error');
  const warningSegments = container.querySelectorAll('.bg-warning');
  const successSegments = container.querySelectorAll('.bg-success');
  const inactiveSegments = container.querySelectorAll('.bg-background');
  
  return {
    active: activeSegments.length,
    error: errorSegments.length,
    warning: warningSegments.length,
    success: successSegments.length,
    inactive: inactiveSegments.length,
    total: container.querySelectorAll('.h-3.flex-1').length
  };
};

describe('PasswordStrengthIndicator', () => {
  const basicRenderingTests = [
    {
      name: 'renders three segments',
      password: '',
      expectation: (container: HTMLElement) => {
        const counts = getSegmentCounts(container);
        expect(counts.total).toBe(3);
      }
    },
    {
      name: 'shows no active segments for weak password (strength < 2)',
      password: 'weak',
      expectation: (container: HTMLElement) => {
        const counts = getSegmentCounts(container);
        expect(counts.active).toBe(0);
        expect(counts.inactive).toBe(3);
      }
    }
  ];

  basicRenderingTests.forEach(({ name, password, expectation }) => {
    it(name, () => {
      const { container } = renderPasswordStrengthIndicator(password);
      expectation(container);
    });
  });

  it.skip('shows one red segment for password meeting 2 requirements', () => {
    /** @todo fix?? */
    const { container } = render(<PasswordStrengthIndicator password="Password" />); // length + uppercase + lowercase
    
    const redSegments = container.querySelectorAll('.bg-red-500');
    const inactiveSegments = container.querySelectorAll('.bg-gray-200');
    
    expect(redSegments).toHaveLength(1);
    expect(inactiveSegments).toHaveLength(2);
  });

  const strengthTests = [
    {
      name: 'shows two yellow segments for password meeting 4 requirements',
      password: 'Password123', // length + upper + lower + number
      expectation: (container: HTMLElement) => {
        const counts = getSegmentCounts(container);
        expect(counts.warning).toBe(2);
        expect(counts.inactive).toBe(1);
      }
    },
    {
      name: 'shows three green segments for password meeting all 5 requirements',
      password: 'Password123!', // all requirements
      expectation: (container: HTMLElement) => {
        const counts = getSegmentCounts(container);
        expect(counts.success).toBe(3);
        expect(counts.inactive).toBe(0);
      }
    }
  ];

  strengthTests.forEach(({ name, password, expectation }) => {
    it(name, () => {
      const { container } = renderPasswordStrengthIndicator(password);
      expectation(container);
    });
  });

  it('updates segments when password changes', () => {
    const { container, rerender } = renderPasswordStrengthIndicator('weak');
    
    // Initially weak - no active segments
    let counts = getSegmentCounts(container);
    expect(counts.active).toBe(0);

    // Change to strong password
    rerender(<PasswordStrengthIndicator password="StrongPass123!" />);
    counts = getSegmentCounts(container);
    expect(counts.success).toBe(3);
  });

  it('applies correct classes to all segments', () => {
    const { container } = renderPasswordStrengthIndicator('');
    
    const segments = container.querySelectorAll('.h-3.flex-1');
    segments.forEach(segment => {
      expect(segment).toHaveClass('h-3', 'flex-1', 'border-brutal-sm', 'border-text-primary', 'brutal-transition');
    });
  });
});