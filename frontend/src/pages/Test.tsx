import { useState } from 'react';
import { BackgroundCircles } from '../components/backgrounds/BackgroundCircles';
import { BackgroundGrid } from '../components/backgrounds/BackgroundGrid';
import { BackgroundLines } from '../components/backgrounds/BackgroundLines';
import { BackgroundRectangles } from '../components/backgrounds/BackgroundRectangles';
import { BackgroundSquares } from '../components/backgrounds/BackgroundSquares';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Title } from '../components/common/Title';
import { ContentContainer } from '../components/containers/ContentContainer';

type BackgroundType = 'circles' | 'lines' | 'rectangles' | 'grid' | 'squares' | 'none';

const backgroundComponents = {
  circles: BackgroundCircles,
  lines: BackgroundLines,
  rectangles: BackgroundRectangles,
  grid: BackgroundGrid,
  squares: BackgroundSquares,
  none: () => null,
};

export function Test() {
  const [currentBackground, setCurrentBackground] = useState<BackgroundType>('lines');
  
  const BackgroundComponent = backgroundComponents[currentBackground];

  return (
    <div className="relative min-h-screen">
      {/* Background layer */}
      <div className="absolute inset-0 overflow-hidden">
        <BackgroundComponent />
      </div>
      
      {/* Content layer */}
      <div className="relative z-10">
        <ContentContainer className="py-10">
        <Title variant="page" textShadow>
          Background Component Test
        </Title>
        
        <Card variant="default" shadow="triple" className="p-8 mb-8">
          <Title variant="section" className="mb-6">
            Current: {currentBackground}
          </Title>
          
          <p className="font-mono text-text-secondary mb-6">
            Switch between different background components to see how they look. 
            The background elements should be subtle and not interfere with content readability.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(backgroundComponents).map((bg) => (
              <Button
                key={bg}
                variant={currentBackground === bg ? 'primary' : 'outline'}
                size="small"
                onClick={() => setCurrentBackground(bg as BackgroundType)}
                className="capitalize"
              >
                {bg}
              </Button>
            ))}
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="subtle" shadow="primary" className="p-6">
            <Title variant="subsection" className="mb-4">
              Sample Content Card 1
            </Title>
            <p className="font-mono text-text-secondary">
              This card tests how the background interacts with content. 
              The background should be visible but not distracting.
            </p>
          </Card>
          
          <Card variant="accent" shadow="secondary" className="p-6">
            <Title variant="subsection" className="mb-4">
              Sample Content Card 2  
            </Title>
            <p className="font-mono text-white">
              Another content card to see background visibility across 
              different color schemes and contexts.
            </p>
          </Card>
        </div>
        
        <Card variant="dark" shadow="mega" className="p-8 mt-8">
          <Title variant="section" className="mb-4 text-white">
            Background Notes
          </Title>
          <ul className="font-mono text-white space-y-2 text-sm">
            <li><strong>Circles:</strong> Original soft circles (not brutalist)</li>
            <li><strong>Lines:</strong> Bold strokes at various angles</li>
            <li><strong>Rectangles:</strong> Sharp rectangles with thick borders</li>
            <li><strong>Grid:</strong> Broken grid fragments and partial patterns</li>
            <li><strong>Squares:</strong> Heavily rotated squares with strong geometry</li>
          </ul>
        </Card>
        </ContentContainer>
      </div>
    </div>
  );
}