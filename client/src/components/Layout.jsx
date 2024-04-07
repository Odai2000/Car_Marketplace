//For test only

import NavBar from "./nav/NavBar";
import Hero from "./Hero/Hero";

import RegisterForm from "./AuthForms/RegisterForm";
import LoginForm from "./AuthForms/LoginForm";
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
