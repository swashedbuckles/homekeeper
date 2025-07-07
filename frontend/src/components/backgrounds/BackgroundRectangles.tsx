import { useMemo } from 'react';

interface Rectangle {
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
  borderWidth: string;
}

/**
 * BackgroundRectangles Component.
 * 
 * Creates random sharp-edged rectangles with thick borders and slight rotations
 * for subtle background visual interest. Follows brutalist design principles.
 */
export const BackgroundRectangles = () => {
  const rectangles = useMemo(() => {
    const colors = ['primary', 'secondary', 'accent', 'text-primary'];
    const count = Math.floor(Math.random() * 4) + 3; // 3-6 rectangles
    
    const generateRectangle = (index: number): Rectangle => {
      // Various rectangle sizes
      const sizeOptions = [
        { width: 'w-12 md:w-16 lg:w-20', height: 'h-8 md:h-12 lg:h-16' }, // wide
        { width: 'w-8 md:w-12 lg:h-16', height: 'h-16 md:h-20 lg:h-24' }, // tall
        { width: 'w-16 md:w-20 lg:w-24', height: 'h-12 md:h-16 lg:h-20' }, // balanced
        { width: 'w-6 md:w-8 lg:w-10', height: 'h-20 md:h-24 lg:h-28' }, // very tall
        { width: 'w-20 md:w-24 lg:w-28', height: 'h-6 md:h-8 lg:h-10' }, // very wide
      ];
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];
      
      // Rotation options for imperfection
      const rotations = [
        'brutal-rotate-left',
        'brutal-rotate-right', 
        'brutal-rotate-slight-left',
        'brutal-rotate-slight-right',
        '' // no rotation
      ];
      const rotation = rotations[Math.floor(Math.random() * rotations.length)];
      
      // Border thickness
      const borderOptions = ['border-brutal-sm', 'border-brutal-md'];
      const borderWidth = borderOptions[Math.floor(Math.random() * borderOptions.length)];
      
      // Positions avoiding center content
      const positions = [
        { top: '5%', right: '5%' },
        { top: '15%', right: '10%' },
        { top: '8%', left: '3%' },
        { top: '20%', left: '8%' },
        { bottom: '8%', right: '5%' },
        { bottom: '15%', right: '12%' },
        { bottom: '10%', left: '4%' },
        { bottom: '20%', left: '10%' },
        { top: '45%', right: '2%' },
        { top: '55%', left: '2%' },
        { top: '35%', left: '1%' },
        { top: '65%', right: '3%' },
      ];
      
      const position = positions[Math.floor(Math.random() * positions.length)];
      
      return {
        id: index,
        width: size.width,
        height: size.height,
        position,
        color,
        rotation,
        borderWidth,
      };
    };
    
    return Array.from({ length: count }, (_, index) => generateRectangle(index));
  }, []);
  
  return (
    <>
      {rectangles.map((rect) => (
        <div
          key={rect.id}
          className={`absolute ${rect.width} ${rect.height} ${rect.borderWidth} border-${rect.color} bg-transparent opacity-20 pointer-events-none ${rect.rotation}`}
          style={rect.position}
        />
      ))}
    </>
  );
};