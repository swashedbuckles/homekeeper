import { type StandardSize, getSizeToken } from '../../lib/design-system/sizes';
import type { ReactNode } from 'react';

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 12;
type GridSpacing = StandardSize;
type GridAlignment = 'start' | 'center' | 'end' | 'stretch';

/**
 * Grid Component
 * 
 * Responsive grid system for dashboard cards, content layouts, and structured data.
 * Uses CSS Grid with automatic responsive breakpoints and consistent spacing.
 * Perfect for dashboard cards, image galleries, and structured content.
 * 
 * @example
 * ```tsx
 * // Dashboard cards with responsive columns
 * <Grid columns={3} spacing="lg" className="mb-8">
 *   <StatCard title="Total Manuals" value={47} />
 *   <StatCard title="Due This Week" value={12} />
 *   <StatCard title="Overdue" value={3} />
 * </Grid>
 * 
 * // Auto-fit responsive grid
 * <Grid columns="auto-fit" minWidth="300px" spacing="md">
 *   {items.map(item => <ItemCard key={item.id} {...item} />)}
 * </Grid>
 * 
 * // Manual control with Grid.Item
 * <Grid columns={4} spacing="sm">
 *   <Grid.Item span={2}>
 *     <MainContent />
 *   </Grid.Item>
 *   <Grid.Item>
 *     <SideWidget />
 *   </Grid.Item>
 *   <Grid.Item>
 *     <AnotherWidget />
 *   </Grid.Item>
 * </Grid>
 * ```
 */
export interface GridProps {
  children: ReactNode;
  columns?: GridColumns | 'auto-fit' | 'auto-fill';
  spacing?: GridSpacing;
  minWidth?: string;
  maxWidth?: string;
  alignItems?: GridAlignment;
  justifyItems?: GridAlignment;
  className?: string;
  testId?: string;
}

const getGridColumns = (columns: GridColumns | 'auto-fit' | 'auto-fill', minWidth?: string): string => {
  if (typeof columns === 'string') {
    const width = minWidth || '250px';
    return columns === 'auto-fit' 
      ? `repeat(auto-fit, minmax(${width}, 1fr))`
      : `repeat(auto-fill, minmax(${width}, 1fr))`;
  }
  
  // Responsive grid based on column count
  const responsiveMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2', 
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    12: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-12'
  };
  
  return responsiveMap[columns];
};

const getAlignmentClass = (alignment: GridAlignment, type: 'items' | 'justify'): string => {
  const prefix = type === 'items' ? 'items' : 'justify-items';
  const alignmentMap = {
    start: `${prefix}-start`,
    center: `${prefix}-center`, 
    end: `${prefix}-end`,
    stretch: `${prefix}-stretch`
  };
  return alignmentMap[alignment];
};

export const Grid = ({
  children,
  columns = 3,
  spacing = 'md',
  minWidth,
  maxWidth,
  alignItems = 'stretch',
  justifyItems = 'stretch',
  className = '',
  testId = 'grid'
}: GridProps) => {
  const spacingClass = getSizeToken(spacing, 'spacing');
  const columnsClass = typeof columns === 'string' ? '' : getGridColumns(columns, minWidth);
  const alignItemsClass = getAlignmentClass(alignItems, 'items');
  const justifyItemsClass = getAlignmentClass(justifyItems, 'justify');
  
  const gridClasses = [
    'grid',
    columnsClass,
    spacingClass,
    alignItemsClass,
    justifyItemsClass,
    maxWidth ? `max-w-${maxWidth}` : '',
    className
  ].filter(Boolean).join(' ');

  const gridStyle = typeof columns === 'string' ? {
    gridTemplateColumns: getGridColumns(columns, minWidth)
  } : undefined;

  return (
    <div 
      className={gridClasses} 
      style={gridStyle}
      data-testid={testId}
    >
      {children}
    </div>
  );
};

// Grid.Item subcomponent for manual control
interface GridItemProps {
  children: ReactNode;
  span?: number;
  rowSpan?: number;
  colStart?: number;
  colEnd?: number;
  rowStart?: number;
  rowEnd?: number;
  className?: string;
}

Grid.Item = ({
  children,
  span,
  rowSpan,
  colStart,
  colEnd,
  rowStart,
  rowEnd,
  className = ''
}: GridItemProps) => {
  const spanClass = span ? `col-span-${span}` : '';
  const rowSpanClass = rowSpan ? `row-span-${rowSpan}` : '';
  const colStartClass = colStart ? `col-start-${colStart}` : '';
  const colEndClass = colEnd ? `col-end-${colEnd}` : '';
  const rowStartClass = rowStart ? `row-start-${rowStart}` : '';
  const rowEndClass = rowEnd ? `row-end-${rowEnd}` : '';
  
  const itemClasses = [
    spanClass,
    rowSpanClass,
    colStartClass,
    colEndClass,
    rowStartClass,
    rowEndClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={itemClasses} data-testid="grid-item">
      {children}
    </div>
  );
};