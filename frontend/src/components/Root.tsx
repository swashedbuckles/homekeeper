import { Outlet } from 'react-router';
import { BackgroundCircles } from './BackgroundCircles';
import { Header } from './Header';

export function Root() {
  return (
    <div className="grow relative">
      <BackgroundCircles />
      <Header />
      <Outlet />
    </div>
  );
}