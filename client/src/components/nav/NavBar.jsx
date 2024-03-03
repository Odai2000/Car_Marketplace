import {FaBars} from 'react-icons/fa6'
import Items from "./Items";
import "./style.css";
import { IconContext } from 'react-icons/lib';

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
          <button className="btn login-btn">Log in</button>
          <button className=" btn btn-primary signup-btn">Sign up</button>
        </div>

        <IconContext.Provider value={{className:'op' }}>
          <div className="menu-toggle">
          <FaBars/>
        </div>
        </IconContext.Provider>
        
      </div>
    </>
  );
}

export default NavBar;
