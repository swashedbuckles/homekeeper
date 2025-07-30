import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MediaCard } from '../../../src/components/common/MediaCard';
import { Button } from '../../../src/components/common/Button';

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

  describe('Variant Styles', () => {
    it('applies default variant styling', () => {
      const { container } = render(<MediaCard {...defaultProps} variant="default" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('bg-white', 'text-text-primary');
    });

    it('applies primary variant styling', () => {
      const { container } = render(<MediaCard {...defaultProps} variant="primary" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('bg-primary', 'text-white');
    });

    it('applies secondary variant styling', () => {
      const { container } = render(<MediaCard {...defaultProps} variant="secondary" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('bg-secondary', 'text-white');
    });

    it('applies accent variant styling', () => {
      const { container } = render(<MediaCard {...defaultProps} variant="accent" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('bg-accent', 'text-white');
    });

    it('applies danger variant styling', () => {
      const { container } = render(<MediaCard {...defaultProps} variant="danger" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('bg-error', 'text-white');
    });

    it('applies dark variant styling', () => {
      const { container } = render(<MediaCard {...defaultProps} variant="dark" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('bg-text-primary', 'text-white');
    });
  });

  describe('Rotation Effects', () => {
    it('applies no rotation by default', () => {
      const { container } = render(<MediaCard {...defaultProps} rotation="none" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).not.toHaveClass('brutal-rotate-left', 'brutal-rotate-right', 'brutal-rotate-slight-left', 'brutal-rotate-slight-right');
    });

    it('applies left rotation', () => {
      const { container } = render(<MediaCard {...defaultProps} rotation="left" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('brutal-rotate-left');
    });

    it('applies right rotation', () => {
      const { container } = render(<MediaCard {...defaultProps} rotation="right" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('brutal-rotate-right');
    });

    it('applies slight left rotation', () => {
      const { container } = render(<MediaCard {...defaultProps} rotation="slight-left" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('brutal-rotate-slight-left');
    });

    it('applies slight right rotation', () => {
      const { container } = render(<MediaCard {...defaultProps} rotation="slight-right" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('brutal-rotate-slight-right');
    });
  });

  describe('Shadow Effects', () => {
    it('applies default shadow', () => {
      const { container } = render(<MediaCard {...defaultProps} shadow="default" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('brutal-shadow-dark');
    });

    it('applies primary shadow', () => {
      const { container } = render(<MediaCard {...defaultProps} shadow="primary" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('brutal-shadow-primary');
    });

    it('applies secondary shadow', () => {
      const { container } = render(<MediaCard {...defaultProps} shadow="secondary" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('brutal-shadow-secondary');
    });

    it('applies accent shadow', () => {
      const { container } = render(<MediaCard {...defaultProps} shadow="accent" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('brutal-shadow-accent');
    });

    it('applies dark shadow', () => {
      const { container } = render(<MediaCard {...defaultProps} shadow="dark" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('brutal-shadow-dark');
    });

    it('applies error shadow', () => {
      const { container } = render(<MediaCard {...defaultProps} shadow="error" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('brutal-shadow-error');
    });
  });

  describe('Avatar Compound Component', () => {
    it('renders avatar when provided', () => {
      render(
        <MediaCard {...defaultProps}>
          <MediaCard.Avatar color="primary">📱</MediaCard.Avatar>
        </MediaCard>
      );
      
      expect(screen.getByText('📱')).toBeInTheDocument();
    });

    it('does not render avatar section when not provided', () => {
      render(<MediaCard {...defaultProps} />);
      
      expect(screen.queryByText('📱')).not.toBeInTheDocument();
    });

    it('applies correct avatar styling', () => {
      render(
        <MediaCard {...defaultProps}>
          <MediaCard.Avatar color="primary">IC</MediaCard.Avatar>
        </MediaCard>
      );
      
      const avatar = screen.getByText('IC');
      expect(avatar).toHaveClass(
        'w-10', 'h-10', 'md:w-12', 'md:h-12',
        'border-3', 'md:border-4', 'border-text-primary',
        'flex', 'items-center', 'justify-center',
        'text-base', 'md:text-xl', 'font-black',
        'flex-shrink-0',
        'bg-primary', 'text-white'
      );
    });

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

    it('applies different color variants correctly', () => {
      render(
        <MediaCard {...defaultProps}>
          <MediaCard.Avatar color="danger">🚨</MediaCard.Avatar>
        </MediaCard>
      );
      
      const avatar = screen.getByText('🚨');
      expect(avatar).toHaveClass('bg-error', 'text-white');
    });

    it('handles text avatars', () => {
      render(
        <MediaCard {...defaultProps}>
          <MediaCard.Avatar color="accent">AB</MediaCard.Avatar>
        </MediaCard>
      );
      
      expect(screen.getByText('AB')).toBeInTheDocument();
    });
  });

  describe('Badge Compound Component', () => {
    it('renders single badge when provided', () => {
      render(
        <MediaCard {...defaultProps}>
          <MediaCard.Badge variant="primary">PDF</MediaCard.Badge>
        </MediaCard>
      );
      
      expect(screen.getByText('PDF')).toBeInTheDocument();
    });

    it('renders multiple badges when provided', () => {
      render(
        <MediaCard {...defaultProps}>
          <MediaCard.Badge variant="primary">PDF</MediaCard.Badge>
          <MediaCard.Badge variant="secondary">Manual</MediaCard.Badge>
        </MediaCard>
      );
      
      expect(screen.getByText('PDF')).toBeInTheDocument();
      expect(screen.getByText('Manual')).toBeInTheDocument();
    });

    it('does not render badges section when not provided', () => {
      render(<MediaCard {...defaultProps} />);
      
      expect(screen.queryByText('PDF')).not.toBeInTheDocument();
    });

    it('applies correct badge styling', () => {
      render(
        <MediaCard {...defaultProps}>
          <MediaCard.Badge variant="accent">Success</MediaCard.Badge>
        </MediaCard>
      );
      
      const badge = screen.getByText('Success');
      expect(badge).toHaveClass(
        'px-3', 'py-1',
        'border-3', 'border-text-primary',
        'font-black', 'text-xs',
        'uppercase',
        'inline-block',
        'bg-accent', 'text-white'
      );
    });

    it('positions badges at top of card', () => {
      render(
        <MediaCard {...defaultProps}>
          <MediaCard.Badge variant="primary">Badge 1</MediaCard.Badge>
          <MediaCard.Badge variant="secondary">Badge 2</MediaCard.Badge>
        </MediaCard>
      );
      
      const badge1 = screen.getByText('Badge 1');
      const badgesContainer = badge1.parentElement;
      expect(badgesContainer).toHaveClass('flex', 'flex-wrap', 'gap-2', 'mb-4');
    });

    it('supports success variant', () => {
      render(
        <MediaCard {...defaultProps}>
          <MediaCard.Badge variant="success">Completed</MediaCard.Badge>
        </MediaCard>
      );
      
      const badge = screen.getByText('Completed');
      expect(badge).toHaveClass('bg-accent', 'text-white'); // success uses accent color
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

  describe('Complex Layout Scenarios', () => {
    it('renders all elements in correct order: badges, header (avatar + title/subtitle), content', () => {
      render(
        <MediaCard {...defaultProps} subtitle="Card subtitle">
          <MediaCard.Badge variant="primary">Top Badge</MediaCard.Badge>
          <MediaCard.Avatar color="secondary">🔧</MediaCard.Avatar>
          <p>Content paragraph</p>
          <Button variant="outline" size="sm">Content Button</Button>
        </MediaCard>
      );
      
      const card = screen.getByTestId('media-card');
      const children = Array.from(card.children);
      
      // First child should be badges container
      expect(children[0]).toHaveClass('flex', 'flex-wrap', 'gap-2', 'mb-4');
      expect(children[0]).toContainElement(screen.getByText('Top Badge'));
      
      // Second child should be header container
      expect(children[1]).toHaveClass('flex', 'gap-3', 'md:gap-4', 'mb-4');
      expect(children[1]).toContainElement(screen.getByText('🔧'));
      expect(children[1]).toContainElement(screen.getByText('Test MediaCard'));
      expect(children[1]).toContainElement(screen.getByText('Card subtitle'));
      
      // Third child should be content container
      expect(children[2]).toHaveClass('space-y-3');
      expect(children[2]).toContainElement(screen.getByText('Content paragraph'));
      expect(children[2]).toContainElement(screen.getByRole('button', { name: 'Content Button' }));
    });

    it('handles card without avatar but with other elements', () => {
      render(
        <MediaCard {...defaultProps} subtitle="No avatar card">
          <MediaCard.Badge variant="accent">Badge Only</MediaCard.Badge>
          <p>Some content</p>
        </MediaCard>
      );
      
      // Header should still exist but without avatar column
      const title = screen.getByText('Test MediaCard');
      const headerContainer = title.parentElement?.parentElement;
      expect(headerContainer).toHaveClass('flex', 'gap-3', 'md:gap-4', 'mb-4');
      
      // Should not have avatar column
      expect(screen.queryByText('🔧')).not.toBeInTheDocument();
      
      // Title container should still have flex-1 class
      const titleContainer = title.parentElement;
      expect(titleContainer).toHaveClass('flex-1', 'min-w-0');
    });

    it('handles minimal card with only title', () => {
      render(<MediaCard {...defaultProps} />);
      
      const title = screen.getByText('Test MediaCard');
      expect(title).toBeInTheDocument();
      
      // Should have header container even without avatar
      const headerContainer = title.parentElement?.parentElement;
      expect(headerContainer).toHaveClass('flex', 'gap-3', 'md:gap-4', 'mb-4');
    });
  });

  describe('Accessibility', () => {
    it('applies correct test id', () => {
      render(<MediaCard {...defaultProps} testId="custom-test-id" />);
      
      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
    });

    it('uses default test id when not provided', () => {
      render(<MediaCard {...defaultProps} />);
      
      expect(screen.getByTestId('media-card')).toBeInTheDocument();
    });

    it('uses semantic heading for title', () => {
      render(<MediaCard {...defaultProps} />);
      
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveTextContent('Test MediaCard');
    });

    it('maintains proper heading hierarchy with subtitle', () => {
      render(<MediaCard {...defaultProps} subtitle="Subtitle text" />);
      
      const title = screen.getByRole('heading', { level: 3 });
      const subtitle = screen.getByText('Subtitle text');
      
      expect(title).toBeInTheDocument();
      expect(subtitle.tagName.toLowerCase()).toBe('p'); // Subtitle should be a paragraph, not a heading
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children gracefully', () => {
      render(<MediaCard {...defaultProps}>{null}</MediaCard>);
      
      expect(screen.getByText('Test MediaCard')).toBeInTheDocument();
      expect(screen.queryByText('Custom content')).not.toBeInTheDocument();
    });

    it('handles mixed valid and invalid children', () => {
      render(
        <MediaCard {...defaultProps}>
          <MediaCard.Avatar color="primary">AV</MediaCard.Avatar>
          <div>Regular div content</div>
          <MediaCard.Badge variant="primary">Valid Badge</MediaCard.Badge>
          <span>Regular span content</span>
        </MediaCard>
      );
      
      // Valid compound components should render
      expect(screen.getByText('AV')).toBeInTheDocument();
      expect(screen.getByText('Valid Badge')).toBeInTheDocument();
      
      // Regular content should also render (non-compound children)
      expect(screen.getByText('Regular div content')).toBeInTheDocument();
      expect(screen.getByText('Regular span content')).toBeInTheDocument();
    });

    it('handles very long titles and subtitles', () => {
      const longTitle = 'This is a very long title that should handle text wrapping and layout correctly without breaking the MediaCard component structure or layout';
      const longSubtitle = 'This is a very long subtitle that should also handle text wrapping appropriately within the card layout';
      
      render(<MediaCard title={longTitle} subtitle={longSubtitle} />);
      
      expect(screen.getByText(longTitle)).toBeInTheDocument();
      expect(screen.getByText(longSubtitle)).toBeInTheDocument();
    });

    it('handles multiple badges with long text', () => {
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
      
      // Badges should wrap appropriately
      const badge1 = screen.getByText('Very Long Badge Text');
      const badgesContainer = badge1.parentElement;
      expect(badgesContainer).toHaveClass('flex-wrap');
    });
  });
});