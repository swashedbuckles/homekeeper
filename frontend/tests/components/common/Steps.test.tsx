import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Step, Steps } from '../../../src/components/common/Steps';
import { expectElementToHaveClasses } from '../../helpers/testHelpers';

describe('Steps Component', () => {
  describe('Step', () => {
    it('renders step content', () => {
      render(<Step>Task Information</Step>);
      
      expect(screen.getByText('Task Information')).toBeInTheDocument();
    });

    it('applies correct styling classes', () => {
      render(<Step>Test Step</Step>);
      
      const step = screen.getByText('Test Step');
      expectElementToHaveClasses(step, ['text-text-secondary', 'font-mono', 'font-bold', 'uppercase', 'text-sm']);
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

    describe('Step State Styling', () => {
      const stateTests = [
        {
          name: 'handles completed steps correctly',
          setup: (
            <Steps>
              <Step completed>Completed Step</Step>
              <Step>Next Step</Step>
            </Steps>
          ),
          indicator: '1',
          expectedClasses: ['bg-accent', 'text-white']
        },
        {
          name: 'handles active steps correctly',
          setup: (
            <Steps>
              <Step completed>Completed Step</Step>
              <Step active>Active Step</Step>
              <Step>Future Step</Step>
            </Steps>
          ),
          indicator: '2',
          expectedClasses: ['bg-primary', 'text-white', 'brutal-shadow-dark']
        },
        {
          name: 'handles error steps correctly',
          setup: (
            <Steps>
              <Step error>Error Step</Step>
              <Step>Next Step</Step>
            </Steps>
          ),
          indicator: '1',
          expectedClasses: ['bg-error', 'text-white']
        }
      ];

      stateTests.forEach(({ name, setup, indicator, expectedClasses }) => {
        it(name, () => {
          render(setup);
          const indicatorElement = screen.getByText(indicator);
          expectElementToHaveClasses(indicatorElement, expectedClasses);
        });
      });

      it('applies correct label styling for active steps', () => {
        render(
          <Steps>
            <Step completed>Completed Step</Step>
            <Step active>Active Step</Step>
            <Step>Future Step</Step>
          </Steps>
        );
        
        const activeLabel = screen.getByText('Active Step');
        expect(activeLabel).toHaveClass('text-primary');
      });
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

    describe('Container and Layout Styling', () => {
      const layoutTests = [
        {
          name: 'applies correct container styling',
          test: () => {
            const { container } = render(
              <Steps>
                <Step>Test Step</Step>
              </Steps>
            );
            const stepsContainer = container.firstChild as HTMLElement;
            expectElementToHaveClasses(stepsContainer, ['w-full', 'max-w-3xl', 'mx-auto']);
          }
        },
        {
          name: 'positions step labels correctly',
          test: () => {
            render(
              <Steps>
                <Step>Step 1</Step>
                <Step active>Step 2</Step>
                <Step>Step 3</Step>
              </Steps>
            );
            const labelsContainer = screen.getByText('Step 1').parentElement as HTMLElement;
            expectElementToHaveClasses(labelsContainer, ['flex', 'justify-between']);
          }
        }
      ];

      layoutTests.forEach(({ name, test }) => {
        it(name, test);
      });
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

  describe('Vertical Orientation', () => {
    it('renders steps vertically when orientation is vertical', () => {
      const { container } = render(
        <Steps orientation="vertical">
          <Step>Step 1</Step>
          <Step active>Step 2</Step>
          <Step>Step 3</Step>
        </Steps>
      );

      const stepsContainer = container.firstChild;
      expect(stepsContainer).toHaveClass('max-w-md');
      
      // Should not have the horizontal layout classes
      expect(container.querySelector('.justify-between')).not.toBeInTheDocument();
    });

    it('renders vertical lines between steps', () => {
      const { container } = render(
        <Steps orientation="vertical">
          <Step completed>Step 1</Step>
          <Step active>Step 2</Step>
          <Step>Step 3</Step>
        </Steps>
      );

      // Should have vertical lines (w-1 instead of h-1)
      const lines = container.querySelectorAll('.w-1.flex-1');
      expect(lines).toHaveLength(2);
    });

    it('applies correct vertical line styling', () => {
      const { container } = render(
        <Steps orientation="vertical">
          <Step completed>Step 1</Step>
          <Step active>Step 2</Step>
          <Step>Step 3</Step>
        </Steps>
      );

      const lines = container.querySelectorAll('.w-1.flex-1');
      
      // First line should be completed (green)
      expect(lines[0]).toHaveClass('bg-accent');
      
      // Second line should not be completed (gray)
      expect(lines[1]).toHaveClass('bg-text-secondary');
    });

    it('positions labels correctly in vertical layout', () => {
      render(
        <Steps orientation="vertical">
          <Step>Step 1</Step>
          <Step active>Step 2</Step>
          <Step>Step 3</Step>
        </Steps>
      );

      const activeLabel = screen.getByText('Step 2');
      expect(activeLabel).toHaveClass('text-primary', 'py-3');
      
      const inactiveLabel = screen.getByText('Step 1');
      expect(inactiveLabel).toHaveClass('text-text-secondary', 'py-3');
    });

    it('defaults to horizontal when no orientation provided', () => {
      const { container } = render(
        <Steps>
          <Step>Step 1</Step>
          <Step>Step 2</Step>
        </Steps>
      );

      const stepsContainer = container.firstChild;
      expect(stepsContainer).toHaveClass('max-w-3xl', 'mx-auto');
    });

    it('handles single step in vertical orientation', () => {
      const { container } = render(
        <Steps orientation="vertical">
          <Step active>Only Step</Step>
        </Steps>
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('Only Step')).toBeInTheDocument();
      
      // Should not have any connecting lines
      const lines = container.querySelectorAll('.w-1.flex-1');
      expect(lines).toHaveLength(0);
    });
  });
});