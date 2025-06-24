import { useMemo } from 'react';

interface Circle {
  id: number;
  size: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  color: string;
  opacity: number;
}

export const BackgroundCircles = () => {
  const circles = useMemo(() => {
    const colors = ['primary', 'secondary', 'accent'];
    const count = Math.floor(Math.random() * 3) + 2; // 1-3 circles
    
    const generateCircle = (index: number): Circle => {
      // Size ranges for responsive design
      const sizeOptions = [
        'w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28', // small
        'w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32', // medium
        'w-28 h-28 md:w-40 md:h-40 lg:w-48 lg:h-48', // large
      ];
      
      // Random color from theme palette
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Random opacity between 4% and 10%
      const opacity = [5, 10][Math.round(Math.random())];
      
      // Random size
      const size = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];
      
      // Position logic to spread circles around and avoid center content
      const positions = [
        // Top area
        { top: '5%', right: '5%' },
        { top: '10%', right: '15%' },
        { top: '8%', left: '5%' },
        { top: '15%', left: '10%' },
        
        // Bottom area
        { bottom: '5%', right: '8%' },
        { bottom: '12%', right: '20%' },
        { bottom: '8%', left: '5%' },
        { bottom: '15%', left: '12%' },
        
        // Middle edges (avoiding center)
        { top: '40%', right: '2%' },
        { top: '50%', left: '2%' },
        { top: '60%', right: '5%' },
        { top: '35%', left: '3%' },
      ];
      
      const position = positions[Math.floor(Math.random() * positions.length)];
      
      return {
        id: index,
        size,
        position,
        color,
        opacity,
      };
    };
    
    return Array.from({ length: count }, (_, index) => generateCircle(index));
  }, []); // Empty dependency array means this only runs once on mount
  
  return (
    <>
      {circles.map((circle) => (
        <div
          key={circle.id}
          className={`absolute ${circle.size} rounded-full bg-${circle.color} opacity-5 pointer-events-none -z-10`}
          style={circle.position}
        />
      ))}
    </>
  );
};