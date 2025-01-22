import { FaBars, FaUser } from "react-icons/fa6";
import Items from "./Items";
import "./style.css";
import { IconContext } from "react-icons/lib";
import Button from "../UI/Button/Button";
import RegisterForm from "../AuthForms/RegisterForm";
import LoginForm from "../AuthForms/LoginForm";
import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";

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

  const { auth } = useAuth();
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

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
      setScrolled(window.scrollY > 125);
    };
    window.addEventListener("scroll", handleScroll);
  }, [scrolled]);
  return (
    <>
      <div
        id="nav-fix-buffer"
        style={{
          display: scrolled ? "block" : "none",
          height: navRef.current ? navRef.current.clientHeight : 0,
        }}
      ></div>

      <div
        className={`${
          !scrolled && location.pathname == "/"
            ? "style-transparent"
            : scrolled
            ? "scrolled"
            : ""
        } nav-wrapper`}
        ref={navRef}
      >
        <div className="nav-container">
          <div id="logo">
            <Link to="/">
              <img
                src={
                  !scrolled && location.pathname == "/"
                    ? "/src/assets/logo-white.svg"
                    : "/src/assets/logo.svg"
                }
                alt="logo"
              />
            </Link>
          </div>

          <nav className={"nav"}>
            <ul>
              <Items />
            </ul>
          </nav>
        </div>

        <div className="navBar-rightside">
          {auth ? (
            <>
            <Link to="/new-post">
              <Button variant="primary" styleName="new-post-btn">
                New Post
              </Button></Link>
              <Button variant="secondary" styleName="logout-btn">
                Logout
              </Button>
              <Link to="/me">
                <div className="profile-icon">
                  <FaUser style={{ color: "var(--primary)" }} />
                </div>
              </Link>
            </>
          ) : (
            <div className="btn-group">
              <Button
                variant="secondary"
                styleName="login-btn"
                onClick={toggleLog}
              >
                Login
              </Button>
              <Button
                variant="primary"
                styleName="signup-btn"
                onClick={toggleSign}
              >
                Sign up
              </Button>
            </div>
          )}
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
