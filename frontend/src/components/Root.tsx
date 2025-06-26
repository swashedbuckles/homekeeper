/* eslint-disable @typescript-eslint/no-unused-vars */
import { Outlet } from 'react-router';
import { BackgroundCircles } from './BackgroundCircles';
import { BackgroundGrid } from './BackgroundGrid';
import { BackgroundLines } from './BackgroundLines';
import { BackgroundRectangles } from './BackgroundRectangles';
import { BackgroundSquares } from './BackgroundSquares';
import { Header } from './Header';

export function Root() {
  return (
    <div className="grow relative">
      {/* Background layer */}
      <div className="absolute inset-0 overflow-hidden">
        <BackgroundLines />
      </div>
      
      {/* Content layer */}
      <div className="relative z-10">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}