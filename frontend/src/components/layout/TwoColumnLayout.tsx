import { type StandardSize, getSizeToken } from '../../lib/design-system/sizes';
import type { ReactNode } from 'react';

type LayoutVariant = 'sidebar-left' | 'sidebar-right' | 'equal';
type SidebarWidth = 'narrow' | 'medium' | 'wide';
type LayoutSpacing = StandardSize;

/**
 * TwoColumnLayout Component
 * 
 * Provides responsive two-column layouts with sidebar patterns.
 * Handles mobile breakpoints with collapsible sidebar behavior.
 * Perfect for dashboard layouts, settings pages, and content + navigation patterns.
 * 
 * @example
 * ```tsx
 * // Dashboard with left sidebar
 * <TwoColumnLayout variant="sidebar-left" sidebarWidth="medium" spacing="lg">
 *   <TwoColumnLayout.Sidebar>
 *     <Navigation />
 *   </TwoColumnLayout.Sidebar>
 *   <TwoColumnLayout.Content>
 *     <Dashboard />
 *   </TwoColumnLayout.Content>
 * </TwoColumnLayout>
 * 
 * // Settings with right sidebar
 * <TwoColumnLayout variant="sidebar-right" sidebarWidth="narrow">
 *   <TwoColumnLayout.Content>
 *     <SettingsForm />
 *   </TwoColumnLayout.Content>
 *   <TwoColumnLayout.Sidebar>
 *     <SettingsMenu />
 *   </TwoColumnLayout.Sidebar>
 * </TwoColumnLayout>
 * ```
 */
export interface TwoColumnLayoutProps {
  children: ReactNode;
  variant?: LayoutVariant;
  sidebarWidth?: SidebarWidth;
  spacing?: LayoutSpacing;
  sidebarCollapsible?: boolean;
  className?: string;
  testId?: string;
}

const getSidebarWidth = (width: SidebarWidth): string => {
  const widthMap = {
    narrow: 'w-64',   // 16rem / 256px
    medium: 'w-80',   // 20rem / 320px  
    wide: 'w-96'      // 24rem / 384px
  };
  return widthMap[width];
};

const getLayoutClasses = (variant: LayoutVariant, sidebarWidth: SidebarWidth): string => {
  const baseClasses = 'min-h-screen flex';
  const sidebarWidthClass = getSidebarWidth(sidebarWidth);
  
  const variantClasses = {
    'sidebar-left':  `${baseClasses} ${sidebarWidthClass} flex-row`,
    'sidebar-right': `${baseClasses} ${sidebarWidthClass} flex-row-reverse`, 
    'equal': `${baseClasses} flex-row`
  };
  
  return variantClasses[variant];
};

export const TwoColumnLayout = ({
  children,
  variant = 'sidebar-left',
  sidebarWidth = 'medium',
  spacing = 'md',
  // sidebarCollapsible = true,
  className = '',
  testId = 'two-column-layout'
}: TwoColumnLayoutProps) => {
  const layoutClasses = getLayoutClasses(variant, sidebarWidth);
  const spacingClass = getSizeToken(spacing, 'spacing');
  
  const containerClasses = [
    layoutClasses,
    spacingClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} data-testid={testId}>
      {children}
    </div>
  );
};

// Sidebar subcomponent
interface SidebarProps {
  children: ReactNode;
  className?: string;
  sticky?: boolean;
}

TwoColumnLayout.Sidebar = ({ 
  children, 
  className = '',
  sticky = true 
}: SidebarProps) => {
  const sidebarClasses = [
    'shrink-0',
    'border-r-4',
    'border-text-primary', 
    'bg-white',
    'brutal-shadow-dark',
    sticky ? 'sticky top-0 h-screen overflow-y-auto' : '',
    // Mobile responsiveness
    'hidden lg:block',
    className
  ].filter(Boolean).join(' ');

  return (
    <aside className={sidebarClasses} data-testid="sidebar">
      <div className="p-6">
        {children}
      </div>
    </aside>
  );
};

// Content subcomponent  
interface ContentProps {
  children: ReactNode;
  className?: string;
}

TwoColumnLayout.Content = ({ 
  children, 
  className = '' 
}: ContentProps) => {
  const contentClasses = [
    'flex-1',
    'min-w-0', // Prevents flex item from overflowing
    'bg-background',
    className
  ].filter(Boolean).join(' ');

  return (
    <main className={contentClasses} data-testid="content">
      <div className="p-6">
        {children}
      </div>
    </main>
  );
};