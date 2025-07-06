import { useMemo } from 'react';

interface GridFragment {
  id: number;
  width: string;
  height: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  color: string;
  rotation: string;
  pattern: 'full' | 'partial' | 'corner' | 'broken';
  borderSides: string;
}

/**
 * BackgroundGrid Component.
 * 
 * Creates random grid fragments and partial patterns for background texture.
 * Uses broken/incomplete grids for controlled brutalist chaos.
 */
export const BackgroundGrid = () => {
  const gridFragments = useMemo(() => {
    const colors = ['primary', 'secondary', 'accent', 'text-primary'];
    const count = Math.floor(Math.random() * 5) + 3; // 3-7 fragments
    
    const generateFragment = (index: number): GridFragment => {
      // Grid fragment sizes
      const sizeOptions = [
        { width: 'w-16 md:w-20 lg:w-24', height: 'h-16 md:h-20 lg:h-24' }, // square small
        { width: 'w-20 md:w-24 lg:w-28', height: 'h-20 md:h-24 lg:h-28' }, // square medium
        { width: 'w-24 md:w-32 lg:w-36', height: 'h-16 md:h-20 lg:h-24' }, // wide rectangle
        { width: 'w-16 md:w-20 lg:w-24', height: 'h-24 md:h-32 lg:h-36' }, // tall rectangle
      ];
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];
      
      // Pattern types for different grid looks
      const patterns = ['full', 'partial', 'corner', 'broken'] as const;
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      
      // Border combinations based on pattern
      const borderCombinations = {
        full: [
          'border-brutal-sm',
          'border-brutal-md',
        ],
        partial: [
          'border-t-brutal-sm border-r-brutal-sm',
          'border-b-brutal-sm border-l-brutal-sm',
          'border-t-brutal-md border-l-brutal-md',
          'border-b-brutal-md border-r-brutal-md',
        ],
        corner: [
          'border-t-brutal-sm border-l-brutal-sm',
          'border-t-brutal-sm border-r-brutal-sm',
          'border-b-brutal-sm border-l-brutal-sm',
          'border-b-brutal-sm border-r-brutal-sm',
        ],
        broken: [
          'border-t-brutal-md',
          'border-r-brutal-md',
          'border-b-brutal-md',
          'border-l-brutal-md',
          'border-t-brutal-sm border-b-brutal-sm',
          'border-l-brutal-sm border-r-brutal-sm',
        ],
      };
      
      const borderOptions = borderCombinations[pattern];
      const borderSides = borderOptions[Math.floor(Math.random() * borderOptions.length)];
      
      // Rotation for imperfection
      const rotations = [
        '',
        'brutal-rotate-slight-left',
        'brutal-rotate-slight-right',
        'brutal-rotate-left',
        'brutal-rotate-right',
      ];
      const rotation = rotations[Math.floor(Math.random() * rotations.length)];
      
      // Positions avoiding center content
      const positions = [
        { top: '8%', right: '6%' },
        { top: '18%', right: '12%' },
        { top: '12%', left: '4%' },
        { top: '22%', left: '10%' },
        { bottom: '12%', right: '8%' },
        { bottom: '22%', right: '15%' },
        { bottom: '16%', left: '6%' },
        { bottom: '26%', left: '12%' },
        { top: '42%', right: '3%' },
        { top: '58%', left: '3%' },
        { top: '38%', left: '2%' },
        { top: '68%', right: '4%' },
      ];
      
      const position = positions[Math.floor(Math.random() * positions.length)];
      
      return {
        id: index,
        width: size.width,
        height: size.height,
        position,
        color,
        rotation,
        pattern,
        borderSides,
      };
    };
    
    return Array.from({ length: count }, (_, index) => generateFragment(index));
  }, []);
  
  return (
    <>
      {gridFragments.map((fragment) => (
        <div
          key={fragment.id}
          className={`absolute ${fragment.width} ${fragment.height} ${fragment.borderSides} border-${fragment.color} bg-transparent opacity-25 pointer-events-none ${fragment.rotation}`}
          style={fragment.position}
        />
      ))}
    </>
  );
};