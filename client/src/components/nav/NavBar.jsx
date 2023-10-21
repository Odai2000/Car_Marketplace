import Items from "./Items";
import "./style.css";
function NavBar() {
  return (
    <>
      <div className="nav-wrapper">
        <div className="nav-container">
          <div id="logo">
            <img src="src/assets/logo-white.svg" alt="logo" />
          </div>

          <nav>
            <ul>
              <Items />
            </ul>
          </nav>
        </div>

        <div className="btn-group">
          <button className="btn login-btn">Log in</button>
          <button className=" btn btn-primary signup-btn">Sign up</button>
        </div>

        <div className="menu-toggle">
          <div className="hamburger"></div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
