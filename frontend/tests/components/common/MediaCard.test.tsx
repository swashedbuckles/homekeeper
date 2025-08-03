import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MediaCard } from '../../../src/components/common/MediaCard';
import { Button } from '../../../src/components/common/Button';
import { createVariantTests } from '../../helpers/componentTestHelpers';
import { 
  createAvatarTests, 
  createBadgeTests,
  createComplexScenarioTests,
  createAccessibilityTests,
  createEdgeCasesTests 
} from '../../helpers/compoundComponentHelpers';
import { expectElementToHaveClasses } from '../../helpers/testHelpers';

describe('MediaCard (Compound Component)', () => {
  const defaultProps = {
    title: 'Test MediaCard'
  };

  describe('Basic Rendering', () => {
    it('renders title correctly', () => {
      render(<MediaCard {...defaultProps} />);
      
      expect(screen.getByText('Test MediaCard')).toBeInTheDocument();
    });

    it('renders subtitle when provided', () => {
      render(<MediaCard {...defaultProps} subtitle="Test subtitle" />);
      
      expect(screen.getByText('Test subtitle')).toBeInTheDocument();
    });

    it('does not render subtitle when not provided', () => {
      render(<MediaCard {...defaultProps} />);
      
      expect(screen.queryByText('Test subtitle')).not.toBeInTheDocument();
    });

    it('applies correct CSS classes for basic structure', () => {
      const { container } = render(<MediaCard {...defaultProps} />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('block', 'p-4', 'border-4', 'md:p-6', 'md:border-6', 'border-text-primary', 'font-mono');
    });

    it('applies correct title styling', () => {
      render(<MediaCard {...defaultProps} />);
      
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveClass('font-black', 'text-lg', 'md:text-xl', 'uppercase', 'tracking-wide');
      expect(title).toHaveTextContent('Test MediaCard');
    });

    it('applies correct subtitle styling when provided', () => {
      render(<MediaCard {...defaultProps} subtitle="Test subtitle" />);
      
      const subtitle = screen.getByText('Test subtitle');
      expect(subtitle).toHaveClass('font-bold', 'text-sm', 'opacity-75');
    });
  });

  createVariantTests('MediaCard', MediaCard, [
    {
      name: 'default',
      props: { ...defaultProps, variant: 'default' },
      expectedClasses: ['bg-white', 'text-text-primary']
    },
    {
      name: 'primary', 
      props: { ...defaultProps, variant: 'primary' },
      expectedClasses: ['bg-primary', 'text-white']
    },
    {
      name: 'secondary',
      props: { ...defaultProps, variant: 'secondary' },
      expectedClasses: ['bg-secondary', 'text-white']
    },
    {
      name: 'accent',
      props: { ...defaultProps, variant: 'accent' },
      expectedClasses: ['bg-accent', 'text-white']
    },
    {
      name: 'danger',
      props: { ...defaultProps, variant: 'danger' },
      expectedClasses: ['bg-error', 'text-white']
    },
    {
      name: 'dark',
      props: { ...defaultProps, variant: 'dark' },
      expectedClasses: ['bg-text-primary', 'text-white']
    }
  ]);

  describe('Rotation Effects', () => {
    const rotationTests = [
      { rotation: 'none', expectedClasses: [], notExpectedClasses: ['brutal-rotate-left', 'brutal-rotate-right', 'brutal-rotate-slight-left', 'brutal-rotate-slight-right'] },
      { rotation: 'left', expectedClasses: ['brutal-rotate-left'] },
      { rotation: 'right', expectedClasses: ['brutal-rotate-right'] },
      { rotation: 'slight-left', expectedClasses: ['brutal-rotate-slight-left'] },
      { rotation: 'slight-right', expectedClasses: ['brutal-rotate-slight-right'] }
    ];

    rotationTests.forEach(({ rotation, expectedClasses, notExpectedClasses }) => {
      it(`applies ${rotation} rotation`, () => {
        const { container } = render(<MediaCard {...defaultProps} rotation={rotation as any} />);
        
        const wrapper = container.firstChild as HTMLElement;
        
        if (expectedClasses.length > 0) {
          expectElementToHaveClasses(wrapper, expectedClasses);
        }
        
        if (notExpectedClasses) {
          notExpectedClasses.forEach(className => {
            expect(wrapper).not.toHaveClass(className);
          });
        }
      });
    });
  });

  describe('Shadow Effects', () => {
    const shadowTests = [
      { shadow: 'default', expectedClass: 'brutal-shadow-dark' },
      { shadow: 'primary', expectedClass: 'brutal-shadow-primary' },
      { shadow: 'secondary', expectedClass: 'brutal-shadow-secondary' },
      { shadow: 'accent', expectedClass: 'brutal-shadow-accent' },
      { shadow: 'dark', expectedClass: 'brutal-shadow-dark' },
      { shadow: 'error', expectedClass: 'brutal-shadow-error' }
    ];

    shadowTests.forEach(({ shadow, expectedClass }) => {
      it(`applies ${shadow} shadow`, () => {
        const { container } = render(<MediaCard {...defaultProps} shadow={shadow as any} />);
        
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass(expectedClass);
      });
    });
  });

  createAvatarTests('MediaCard', MediaCard, defaultProps);

  describe('MediaCard.Avatar layout integration', () => {
    it('positions avatar in header layout with title/subtitle', () => {
      render(
        <MediaCard {...defaultProps} subtitle="Test subtitle">
          <MediaCard.Avatar color="secondary">AV</MediaCard.Avatar>
        </MediaCard>
      );
      
      const avatar = screen.getByText('AV');
      const title = screen.getByText('Test MediaCard');
      const subtitle = screen.getByText('Test subtitle');
      
      // Avatar should be in the left column
      const avatarContainer = avatar.parentElement;
      expect(avatarContainer).toHaveClass('flex-shrink-0');
      
      // Title and subtitle should be in the right column
      const titleContainer = title.parentElement;
      expect(titleContainer).toHaveClass('flex-1', 'min-w-0');
      expect(titleContainer).toContain(subtitle);
      
      // Both should be in the same flex container
      const headerContainer = avatarContainer?.parentElement;
      expect(headerContainer).toHaveClass('flex', 'gap-3', 'md:gap-4', 'mb-4');
    });
  });

  createBadgeTests('MediaCard', MediaCard, defaultProps);

  describe('MediaCard.Badge styling details', () => {
    it('applies correct MediaCard-specific badge styling', () => {
      render(
        <MediaCard {...defaultProps}>
          <MediaCard.Badge variant="accent">Success</MediaCard.Badge>
        </MediaCard>
      );
      
      const badge = screen.getByText('Success');
      expectElementToHaveClasses(badge, [
        'px-3', 'py-1', 'border-3', 'border-text-primary',
        'font-black', 'text-xs', 'uppercase', 'inline-block',
        'bg-accent', 'text-white'
      ]);
    });

    it('supports success variant mapping to accent', () => {
      render(
        <MediaCard {...defaultProps}>
          <MediaCard.Badge variant="success">Completed</MediaCard.Badge>
        </MediaCard>
      );
      
      const badge = screen.getByText('Completed');
      expect(badge).toHaveClass('bg-accent', 'text-white');
    });
  });

  describe('Content Layout', () => {
    it('renders other content after header section', () => {
      render(
        <MediaCard {...defaultProps}>
          <MediaCard.Badge variant="primary">Badge</MediaCard.Badge>
          <MediaCard.Avatar color="primary">AV</MediaCard.Avatar>
          <p>Custom content paragraph</p>
          <Button variant="primary" size="sm">Action Button</Button>
        </MediaCard>
      );
      
      expect(screen.getByText('Custom content paragraph')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
    });

    it('applies spacing to other content', () => {
      render(
        <MediaCard {...defaultProps}>
          <p>Content 1</p>
          <p>Content 2</p>
        </MediaCard>
      );
      
      const content1 = screen.getByText('Content 1');
      const contentContainer = content1.parentElement;
      expect(contentContainer).toHaveClass('space-y-3');
    });

    it('does not render content section when only compound components provided', () => {
      render(
        <MediaCard {...defaultProps}>
          <MediaCard.Avatar color="primary">AV</MediaCard.Avatar>
          <MediaCard.Badge variant="primary">Badge</MediaCard.Badge>
        </MediaCard>
      );
      
      // Should not have a content section with space-y-3
      const avatar = screen.getByText('AV');
      const card = avatar.closest('[data-testid="media-card"]');
      const contentSections = card?.querySelectorAll('.space-y-3');
      expect(contentSections).toHaveLength(0);
    });
  });

  createComplexScenarioTests('MediaCard', MediaCard as any, defaultProps, 'media-card');

  describe('MediaCard-specific layout scenarios', () => {
    it('handles card without avatar but with other elements', () => {
      render(
        <MediaCard {...defaultProps} subtitle="No avatar card">
          <MediaCard.Badge variant="accent">Badge Only</MediaCard.Badge>
          <p>Some content</p>
        </MediaCard>
      );
      
      const title = screen.getByText('Test MediaCard');
      const headerContainer = title.parentElement?.parentElement;
      expect(headerContainer).toHaveClass('flex', 'gap-3', 'md:gap-4', 'mb-4');
      
      const titleContainer = title.parentElement;
      expect(titleContainer).toHaveClass('flex-1', 'min-w-0');
    });
    
    it('handles minimal card with only title', () => {
      render(<MediaCard {...defaultProps} />);
      
      const title = screen.getByText('Test MediaCard');
      const headerContainer = title.parentElement?.parentElement;
      expect(headerContainer).toHaveClass('flex', 'gap-3', 'md:gap-4', 'mb-4');
    });
  });

  createAccessibilityTests('MediaCard', MediaCard, defaultProps, 'media-card');

  describe('MediaCard-specific accessibility', () => {
    it('maintains proper heading hierarchy with subtitle', () => {
      render(<MediaCard {...defaultProps} subtitle="Subtitle text" />);
      
      const title = screen.getByRole('heading', { level: 3 });
      const subtitle = screen.getByText('Subtitle text');
      
      expect(title).toBeInTheDocument();
      expect(subtitle.tagName.toLowerCase()).toBe('p');
    });
  });

  createEdgeCasesTests('MediaCard', MediaCard, defaultProps);

  describe('MediaCard-specific edge cases', () => {
    it('handles multiple badges with long text and wrapping', () => {
      render(
        <MediaCard {...defaultProps}>
          <MediaCard.Badge variant="primary">Very Long Badge Text</MediaCard.Badge>
          <MediaCard.Badge variant="secondary">Another Long Badge</MediaCard.Badge>
          <MediaCard.Badge variant="accent">Third Badge With More Text</MediaCard.Badge>
        </MediaCard>
      );
      
      expect(screen.getByText('Very Long Badge Text')).toBeInTheDocument();
      expect(screen.getByText('Another Long Badge')).toBeInTheDocument();
      expect(screen.getByText('Third Badge With More Text')).toBeInTheDocument();
      
      const badge1 = screen.getByText('Very Long Badge Text');
      const badgesContainer = badge1.parentElement;
      expect(badgesContainer).toHaveClass('flex-wrap');
    });
  });
});