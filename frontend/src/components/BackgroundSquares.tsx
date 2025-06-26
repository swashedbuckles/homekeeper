import { useMemo } from 'react';

interface Square {
  id: number;
  size: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  color: string;
  rotation: string;
  style: 'filled' | 'outline' | 'thick-outline';
  borderWidth: string;
}

/**
 * BackgroundSquares Component.
 * 
 * Creates random rotated squares with varying fills and outlines.
 * Emphasizes strong rotations for maximum brutalist "intentional imperfection".
 */
export const BackgroundSquares = () => {
  const squares = useMemo(() => {
    const colors = ['primary', 'secondary', 'accent', 'text-primary'];
    const count = Math.floor(Math.random() * 5) + 4; // 4-8 squares
    
    const generateSquare = (index: number): Square => {
      // Square sizes - keeping them square for strong geometric impact
      const sizeOptions = [
        'w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12', // small
        'w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20', // medium
        'w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24', // large
        'w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10', // tiny
        'w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28', // extra large
      ];
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];
      
      // Style variations
      const styles = ['filled', 'outline', 'thick-outline'] as const;
      const style = styles[Math.floor(Math.random() * styles.length)];
      
      // Border thickness for outline styles
      const borderOptions = ['border-brutal-sm', 'border-brutal-md', 'border-brutal-lg'];
      const borderWidth = borderOptions[Math.floor(Math.random() * borderOptions.length)];
      
      // Strong rotations for maximum brutalist effect
      const rotations = [
        'rotate-12',
        '-rotate-12',
        'rotate-45',
        '-rotate-45',
        'rotate-[15deg]',
        'rotate-[30deg]',
        '-rotate-[15deg]',
        '-rotate-[30deg]',
        'brutal-rotate-left', // -2deg
        'brutal-rotate-right', // 2deg
        'rotate-[8deg]',
        '-rotate-[8deg]',
      ];
      const rotation = rotations[Math.floor(Math.random() * rotations.length)];
      
      // Positions spread around avoiding center
      const positions = [
        { top: '5%', right: '8%' },
        { top: '15%', right: '5%' },
        { top: '10%', left: '6%' },
        { top: '20%', left: '3%' },
        { bottom: '8%', right: '10%' },
        { bottom: '18%', right: '6%' },
        { bottom: '12%', left: '8%' },
        { bottom: '22%', left: '5%' },
        { top: '40%', right: '3%' },
        { top: '55%', left: '4%' },
        { top: '32%', left: '2%' },
        { top: '65%', right: '2%' },
        { top: '75%', right: '8%' },
        { top: '28%', right: '12%' },
      ];
      
      const position = positions[Math.floor(Math.random() * positions.length)];
      
      return {
        id: index,
        size,
        position,
        color,
        rotation,
        style,
        borderWidth,
      };
    };
    
    return Array.from({ length: count }, (_, index) => generateSquare(index));
  }, []);
  
  return (
    <>
      {squares.map((square) => {
        // Generate classes based on style
        let styleClasses = '';
        switch (square.style) {
          case 'filled':
            styleClasses = `bg-${square.color} opacity-8`;
            break;
          case 'outline':
            styleClasses = `bg-transparent ${square.borderWidth} border-${square.color} opacity-15`;
            break;
          case 'thick-outline':
            styleClasses = `bg-transparent border-brutal-lg border-${square.color} opacity-12`;
            break;
        }
        
        return (
          <div
            key={square.id}
            className={`absolute ${square.size} ${styleClasses} pointer-events-none ${square.rotation}`}
            style={square.position}
          />
        );
      })}
    </>
  );
};