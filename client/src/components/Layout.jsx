//For test only
import NavBar from "./NavBar/NavBar";
import Hero from "./Hero/Hero";
import { Outlet, useLocation } from "react-router-dom";
function Layout() {
  const location = useLocation();

  return (
    <>
      <header
        className={
          location.pathname === "/" ? "home-header" : location.pathname
        }
      >
        <NavBar />
        {location.pathname === "/" ? <Hero /> : ""}
      </header>
      <Outlet />
    </>
  );
}

export default Layout;
