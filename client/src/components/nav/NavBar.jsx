import { FaBars } from "react-icons/fa6";
import Items from "./Items";
import "./style.css";
import { IconContext } from "react-icons/lib";
import Button from "../UI/Button/Button";
import RegisterForm from "../AuthForms/RegisterForm";
import LoginForm from "../AuthForms/LoginForm";
import { useState } from "react";

function disableScrolling() {
  document.body.style.overflow = "hidden";
}

function enableScrolling() {
  document.body.style.overflow = "scroll";
}

function NavBar() {
  const [showSign, setShowSign] = useState(false);
  const [showLog, setShowLog] = useState(false);

  function toggleSign() {
    setShowSign(!showSign);
  }
  function toggleLog() {
    setShowLog(!showLog);
  }
  (showSign || showLog) && disableScrolling();
  showSign || showLog || enableScrolling();
  return (
    <>
      <div className="nav-wrapper">
        <div className="nav-container">
          <div id="logo">
            <img src="src/assets/logo-white.svg" alt="logo" />
          </div>

          <nav className="nav">
            <ul>
              <Items />
            </ul>
          </nav>
        </div>

        <div className="btn-group">
          <Button variant="secondary" styleName="login-btn" onClick={toggleLog}>
            Log in
          </Button>
          <Button variant="primary" styleName="signup-btn" onClick={toggleSign}>
            Sign up
          </Button>
        </div>

        <IconContext.Provider value={{ className: "op" }}>
          <div className="menu-toggle">
            <FaBars />
          </div>
        </IconContext.Provider>
      </div>
      <RegisterForm show={showSign} onCancel={toggleSign} />
      <LoginForm show={showLog} onCancel={toggleLog} />
    </>
  );
}

export default NavBar;
