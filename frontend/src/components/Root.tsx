import { Link, Outlet } from "react-router";

export function Root() {
  return (
    <div>
      <header>
        <nav>
          <Link to="/">HomeKeeper </Link>
          <Link to="/login">Login </Link>
          <Link to="/register">Register </Link>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
