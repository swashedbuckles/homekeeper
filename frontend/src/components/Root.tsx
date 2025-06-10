import { Link, Outlet } from "react-router";
import LogoSvg from '../assets/logo.svg';

/** @todo header should be its own component */
/** @todo logo should be its own component */
export function Root() {
  return (
    <div className="container mx-auto max-w-screen-xl px-4">
      <header className="font-sans">
          <nav className="flex items-center justify-between p-4">
            <div className="flex flex-row items-center">
              <img src={LogoSvg} className="w-20 h20" />
              &nbsp;
              <Link to="/" className="text-primary text-4xl font-bold">HomeKeeper </Link>
            </div>
            <div>
              
              <Link className="rounded-2xl border-1 text-primary border-primary p-1.5 mx-2" to="/login">Login</Link>
              <Link className="rounded-2xl border-1 text-secondary border-secondary p-1.5 mx-2" to="/register">Register</Link>
            </div>
          </nav>
      </header>
      <Outlet />
    </div>
  );
}
