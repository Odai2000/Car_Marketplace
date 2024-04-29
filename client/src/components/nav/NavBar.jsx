import { FaBars } from "react-icons/fa6";
import Items from "./Items";
import "./style.css";
import { IconContext } from "react-icons/lib";
import Button from "../UI/Button/Button";
import RegisterForm from "../AuthForms/RegisterForm";
import LoginForm from "../AuthForms/LoginForm";
import { useEffect, useState } from "react";

function disableScrolling() {
  document.body.style.overflow = "hidden";
}

function enableScrolling() {
  document.body.style.overflow = "scroll";
}

function NavBar() {
  const [showSign, setShowSignup] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobSize,setIsMobSize] = useState(false)

  function toggleSign() {
    setShowSignup(!showSign);
  }
  function toggleLog() {
    setShowLog(!showLog);
  }

  (showSign || showLog) && disableScrolling();
  showSign || showLog || enableScrolling();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 65);
    };
    window.addEventListener("scroll", handleScroll);
  }, [scrolled]);
  return (
    <>
      <div className={`${scrolled?'scrolled':''} nav-wrapper`}>
        <div className="nav-container">
          <div id="logo">
            <img src={scrolled?"src/assets/logo.svg":"src/assets/logo-white.svg"} alt="logo" />
          </div>

          <nav className={`nav`}>
            <ul>
              <Items />
            </ul>
          </nav>
        </div>

        <div className="btn-group">
          <Button variant="secondary" styleName="login-btn" onClick={toggleLog}>
            Login
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
