import { Outlet } from "react-router";
import { Header } from "./Header";

/** @todo header should be its own component */
/** @todo logo should be its own component */
export function Root() {
  return (
    <div className="container mx-auto max-w-screen-xl">
      <Header />
      <Outlet />
    </div>
  );
}
