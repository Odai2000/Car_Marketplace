import { FaBars } from "react-icons/fa6";
import Items from "./Items";
import "./style.css";
import { IconContext } from "react-icons/lib";
import Button from "../UI/Button/Button";

function NavBar() {
  return (
    <>
      <div className="nav-wrapper">
        <div className="nav-container">
          <div id="logo">
            <img src="src/assets/logo-white.svg" alt="logo" />
          </div>

          <nav className="">
            <ul>
              <Items />
            </ul>
          </nav>
        </div>

        <div className="btn-group">
          <Button variant="secondary" styleName="login-btn">
            Log in
          </Button>
          <Button variant="primary" styleName="signup-btn">Sign up</Button>
        </div>

        <IconContext.Provider value={{ className: "op" }}>
          <div className="menu-toggle">
            <FaBars />
          </div>
        </IconContext.Provider>
      </div>
    </>
  );
}

export default NavBar;
