import { Outlet } from 'react-router';
import { Z_INDEX_CLASSES } from '../lib/constants/zIndex';
import { BackgroundSquares } from './backgrounds/BackgroundSquares';
import { Header } from './Header';

export function Root() {
  return (
    <div className="grow relative">
      {/* Background layer */}
      <div className={`absolute inset-0 overflow-hidden ${Z_INDEX_CLASSES.BACKGROUND}`}>
        <BackgroundSquares />
      </div>
      
      {/* Content layer */}
      <div className={`relative ${Z_INDEX_CLASSES.CONTENT}`}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
}