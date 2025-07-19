import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Step, Steps } from '../../../src/components/common/Steps';

describe('Steps Component', () => {
  describe('Step', () => {
    it('renders step content', () => {
      render(<Step>Task Information</Step>);
      
      expect(screen.getByText('Task Information')).toBeInTheDocument();
    });

    it('applies correct styling classes', () => {
      render(<Step>Test Step</Step>);
      
      const step = screen.getByText('Test Step');
      expect(step).toHaveClass('text-text-secondary', 'font-mono', 'font-bold', 'uppercase', 'text-sm');
    });
  });

  describe('Steps', () => {
    it('renders multiple steps with indicators', () => {
      render(
        <Steps>
          <Step>Step 1</Step>
          <Step>Step 2</Step>
          <Step>Step 3</Step>
        </Steps>
      );

      // Check indicators
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();

      // Check labels
      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();
      expect(screen.getByText('Step 3')).toBeInTheDocument();
    });

    it('handles completed steps correctly', () => {
      render(
        <Steps>
          <Step completed>Completed Step</Step>
          <Step>Next Step</Step>
        </Steps>
      );

      const indicator1 = screen.getByText('1');
      expect(indicator1).toHaveClass('bg-accent', 'text-white');
    });

    it('handles active steps correctly', () => {
      render(
        <Steps>
          <Step completed>Completed Step</Step>
          <Step active>Active Step</Step>
          <Step>Future Step</Step>
        </Steps>
      );

      const indicator2 = screen.getByText('2');
      expect(indicator2).toHaveClass('bg-primary', 'text-white', 'brutal-shadow-dark');
      
      const activeLabel = screen.getByText('Active Step');
      expect(activeLabel).toHaveClass('text-primary');
    });

    it('handles error steps correctly', () => {
      render(
        <Steps>
          <Step error>Error Step</Step>
          <Step>Next Step</Step>
        </Steps>
      );

      const indicator1 = screen.getByText('1');
      expect(indicator1).toHaveClass('bg-error', 'text-white');
    });

    it('renders connecting lines between steps', () => {
      const { container } = render(
        <Steps>
          <Step completed>Step 1</Step>
          <Step active>Step 2</Step>
          <Step>Step 3</Step>
        </Steps>
      );

      // Should have 2 lines for 3 steps
      const lines = container.querySelectorAll('.flex-1.h-1');
      expect(lines).toHaveLength(2);
    });

    it('shows completed lines for completed steps', () => {
      const { container } = render(
        <Steps>
          <Step completed>Step 1</Step>
          <Step active>Step 2</Step>
          <Step>Step 3</Step>
        </Steps>
      );

      const lines = container.querySelectorAll('.flex-1.h-1');
      
      // First line should be completed (green)
      expect(lines[0]).toHaveClass('bg-accent');
      
      // Second line should not be completed (gray)
      expect(lines[1]).toHaveClass('bg-text-secondary');
    });

    it('returns null when no children provided', () => {
      const { container } = render(<Steps>{null}</Steps>);
      
      expect(container.firstChild).toBeNull();
    });

    it('filters out non-element children', () => {
      render(
        <Steps>
          <Step>Valid Step</Step>
          {'Invalid string child'}
          {123}
          <Step>Another Valid Step</Step>
        </Steps>
      );

      // Should only render indicators for valid Step components
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.queryByText('3')).not.toBeInTheDocument();
      
      expect(screen.getByText('Valid Step')).toBeInTheDocument();
      expect(screen.getByText('Another Valid Step')).toBeInTheDocument();
    });

    it('applies correct container styling', () => {
      const { container } = render(
        <Steps>
          <Step>Test Step</Step>
        </Steps>
      );

      const stepsContainer = container.firstChild;
      expect(stepsContainer).toHaveClass('w-full', 'max-w-3xl', 'mx-auto');
    });

    it('positions step labels correctly', () => {
      render(
        <Steps>
          <Step>Step 1</Step>
          <Step active>Step 2</Step>
          <Step>Step 3</Step>
        </Steps>
      );

      const labelsContainer = screen.getByText('Step 1').parentElement;
      expect(labelsContainer).toHaveClass('flex', 'justify-between');
    });

    it('handles single step correctly', () => {
      render(
        <Steps>
          <Step active>Only Step</Step>
        </Steps>
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('Only Step')).toBeInTheDocument();
      
      // Should not have any connecting lines
      const { container } = render(
        <Steps>
          <Step>Only Step</Step>
        </Steps>
      );
      
      const lines = container.querySelectorAll('.flex-1.h-1');
      expect(lines).toHaveLength(0);
    });
  });

  describe('Step Status Combinations', () => {
    it('handles step that is both completed and active', () => {
      render(
        <Steps>
          <Step completed active>Completed & Active</Step>
        </Steps>
      );

      // When both completed and active, falls back to default styling
      const indicator = screen.getByText('1');
      expect(indicator).toHaveClass('bg-white', 'text-text-primary');
    });

    it('handles step that is both error and completed', () => {
      render(
        <Steps>
          <Step completed error>Error Step</Step>
        </Steps>
      );

      // Error should take precedence
      const indicator = screen.getByText('1');
      expect(indicator).toHaveClass('bg-error', 'text-white');
    });

    it('handles step that is error, completed, and active', () => {
      render(
        <Steps>
          <Step completed active error>All States</Step>
        </Steps>
      );

      // Error should take precedence over all
      const indicator = screen.getByText('1');
      expect(indicator).toHaveClass('bg-error', 'text-white');
    });
  });

  describe('Accessibility', () => {
    it('renders semantic HTML structure', () => {
      const { container } = render(
        <Steps>
          <Step>Step 1</Step>
          <Step>Step 2</Step>
        </Steps>
      );

      // Should have proper div structure
      const stepsContainer = container.firstChild;
      expect(stepsContainer?.nodeName).toBe('DIV');
    });

    it('provides meaningful text content', () => {
      render(
        <Steps>
          <Step>Create Account</Step>
          <Step>Verify Email</Step>
          <Step>Complete Profile</Step>
        </Steps>
      );

      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByText('Verify Email')).toBeInTheDocument();
      expect(screen.getByText('Complete Profile')).toBeInTheDocument();
    });
  });
});