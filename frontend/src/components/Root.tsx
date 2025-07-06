import { Outlet } from 'react-router';
import { BackgroundSquares } from './backgrounds/BackgroundSquares';
import { Header } from './Header';

export function Root() {
  return (
    <div className="grow relative">
      {/* Background layer */}
      <div className="absolute inset-0 overflow-hidden">
        <BackgroundSquares />
      </div>
      
      {/* Content layer */}
      <div className="relative z-10">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}