import { useMemo } from 'react';

interface Line {
  id: number;
  length: string;
  thickness: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  color: string;
  rotation: string;
  direction: 'horizontal' | 'vertical' | 'diagonal';
}

/**
 * BackgroundLines Component.
 * 
 * Creates random bold lines at various angles for background texture.
 * Uses thick strokes and strategic positioning for subtle brutalist accent.
 */
export const BackgroundLines = () => {
  const lines = useMemo(() => {
    const colors = ['primary', 'secondary', 'accent', 'text-primary'];
    const count = Math.floor(Math.random() * 6) + 4; // 4-9 lines
    
    const generateLine = (index: number): Line => {
      // Line lengths
      const lengthOptions = [
        'w-16 md:w-20 lg:w-24', // short
        'w-24 md:w-32 lg:w-40', // medium
        'w-32 md:w-48 lg:w-56', // long
        'h-16 md:h-20 lg:h-24', // short vertical
        'h-24 md:h-32 lg:h-40', // medium vertical
        'h-32 md:h-48 lg:h-56', // long vertical
      ];
      
      // Line thickness
      const thicknessOptions = [
        'border-t-brutal-sm', // horizontal thin
        'border-t-brutal-md', // horizontal medium
        'border-l-brutal-sm', // vertical thin
        'border-l-brutal-md', // vertical medium
      ];
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      const length = lengthOptions[Math.floor(Math.random() * lengthOptions.length)];
      const thickness = thicknessOptions[Math.floor(Math.random() * thicknessOptions.length)];
      
      // Determine direction based on length/thickness selection
      const isVertical = length.includes('h-') || thickness.includes('border-l');
      const direction = isVertical ? 'vertical' : 'horizontal';
      
      // Rotation for diagonal effect
      const rotations = [
        '', // straight
        'brutal-rotate-slight-left',
        'brutal-rotate-slight-right',
        'brutal-rotate-left',
        'brutal-rotate-right',
        'rotate-45', // diagonal
        '-rotate-45', // diagonal other way
      ];
      const rotation = rotations[Math.floor(Math.random() * rotations.length)];
      
      // Positions spread around edges
      const positions = [
        { top: '10%', right: '5%' },
        { top: '25%', right: '8%' },
        { top: '15%', left: '5%' },
        { top: '30%', left: '3%' },
        { bottom: '10%', right: '8%' },
        { bottom: '25%', right: '12%' },
        { bottom: '15%', left: '5%' },
        { bottom: '30%', left: '8%' },
        { top: '50%', right: '2%' },
        { top: '60%', left: '2%' },
        { top: '40%', left: '1%' },
        { top: '70%', right: '1%' },
        // Some more central but still edge positions
        { top: '35%', right: '15%' },
        { bottom: '35%', left: '15%' },
      ];
      
      const position = positions[Math.floor(Math.random() * positions.length)];
      
      return {
        id: index,
        length,
        thickness,
        position,
        color,
        rotation,
        direction,
      };
    };
    
    return Array.from({ length: count }, (_, index) => generateLine(index));
  }, []);
  
  return (
    <>
      {lines.map((line) => (
        <div
          key={line.id}
          className={`absolute ${line.length} ${line.thickness} border-${line.color} opacity-15 pointer-events-none ${line.rotation}`}
          style={line.position}
        />
      ))}
    </>
  );
};