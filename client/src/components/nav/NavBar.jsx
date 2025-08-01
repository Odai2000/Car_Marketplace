import { FaBars } from "react-icons/fa6";
import Items from "./Items";
import "./NavBar.css";
import logo from "../../assets/logo.svg";
import logoWhite from "../../assets/logo-white.svg";
import { IconContext } from "react-icons/lib";
import Button from "../UI/Button/Button";
import RegisterForm from "../AuthForms/RegisterForm";
import LoginForm from "../AuthForms/LoginForm";
import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DefaultProfile from "../UI/Utility/DefaultProfile/DefaultProfile";
import Modal from "../UI/Modal/Modal";

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

  const { auth, logout } = useAuth();
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
                src={!scrolled && location.pathname == "/" ? logoWhite : logo}
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
              <Button
                variant="primary"
                styleName="new-post-btn"
                onClick={() => {
                  navigate("/new");
                }}
              >
                New Post
              </Button>

              <Button
                variant={`link ${
                  !scrolled && location.pathname == "/" && "inverse"
                }`}
                styleName="logout-btn"
                onClick={logout}
              >
                Logout
              </Button>
              <div
                className="profile-image"
                onClick={() => {
                  navigate("/me");
                }}
              >
                {auth?.userData?.profileImageUrl ? (
                  <img src={auth?.userData?.profileImageUrl} />
                ) : (
                  <DefaultProfile size="xs" />
                )}
              </div>
            </>
          ) : (
            <div className="btn-group">
              <Button
                variant={`secondary ${
                  !scrolled && location.pathname == "/" && "inverse"
                }`}
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

      <Modal show={showSign} title='Register' onClose={toggleSign} className="auth-modal">
        <RegisterForm onSuccess={toggleSign} />
      </Modal>

      <Modal show={showLog} title='Login' onClose={toggleLog} className="auth-modal">
        <LoginForm onSuccess={toggleLog} />
      </Modal>
    </>
  );
}

export default NavBar;
