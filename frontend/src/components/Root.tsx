import { Outlet } from 'react-router';
import { BackgroundCircles } from './BackgroundCircles';
import { Header } from './Header';

export function Root() {
  return (
    <div className="container mx-auto max-w-screen-xl grow relative">
      <BackgroundCircles />
      <Header />
      <Outlet />
    </div>
  );
}