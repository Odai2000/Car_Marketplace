import { FaBars } from "react-icons/fa6";
import Items from "./Items";
import "./NavBar.css";
import logo from "../../assets/logo.svg";
import logoWhite from "../../assets/logo-white.svg";
import { IconContext } from "react-icons/lib";
import Button from "../UI/Button/Button";
import Dropdown from "../UI/Dropdown/Dropdown";
import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DefaultProfile from "../UI/Utility/DefaultProfile/DefaultProfile";
import useAuthModal from "../../hooks/useAuthModal";
import useConfig from "../../hooks/useConfig";
import useAuthFetch from "../../hooks/useAuthFetch";
import { PiBell, PiChat, PiSignOut, PiUser } from "react-icons/pi";

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNoti, setHasUnreadNoti] = useState(false);

  const { auth, logout } = useAuth();
  const navRef = useRef(null);
  const socket = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { openRegister, openLogin } = useAuthModal();
  const { config } = useConfig();
  const authFetch = useAuthFetch();

const handleNotificationClick = async (noti) => {
  try {
    const response = await authFetch(
      `${config.serverURL}/notification/${noti?._id.toString()}/read`,
      { method: "PATCH" }
    );

    if(!response.ok) throw new Error("Failed to mark notification as read.")
    const data = await response.json();

    if (data?.notification) {
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === data.notification._id ? data.notification : n
        )
      );
    }

    if (noti?.link) {
      navigate(noti.link);
    }
  } catch (error) {
    console.error( error);
  }
};

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 125);
    };
    window.addEventListener("scroll", handleScroll);
  }, [scrolled]);

  //fetch user notifications
  useEffect(() => {
    authFetch(`${config?.serverURL}/notification`)
      .then((response) => response.json())
      .then((data) => setNotifications(data));
  }, [auth]);
  
  // notification listener
  useEffect(() => {
    if (!socket.current && auth) {
      socket.current = window.io(config?.serverURL, {
        auth: {
          accessToken: `Bearer ${auth?.accessToken}`,
          user_id: auth.userData._id,
        },
      });

      // Register listeners once
      socket.current.on("receive-notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      socket.current.on("connect", () => {
        console.log("[SOCKET CONNECTED]", socket.current.id);
        socket.current.emit("register-user", socket.current.auth.user_id);
      });

      socket.current.on("connect_error", (err) => {
        console.error("[CLIENT] connect_error:", err.message);
      });
    }

    if (auth) {
      socket.current.auth = {
        accessToken: `Bearer ${auth.accessToken}`,
        user_id: auth.userData._id,
      };

      socket.current.connect(); 
      console.log("socket: ", socket.current);
    }
  }, [auth]);

  return (
    <>
      <div
        id="nav-fix-buffer"
        style={{
          display: scrolled ? "block" : "none",
          height: navRef.current ? navRef.current.clientHeight : 0,
        }}
      ></div>
      <IconContext.Provider size="1.5em" value={{ className: "nav-icons" }}>
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

                <Dropdown
                  className="notification-dropdown"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  trigger={
                    <Button
                      variant="icon"
                      styleName="notification-btn"
                      // style={{padding:"0"}}
                      onClick={() => {}}
                    >
                      <div style={{ position: "relative" }}>
                        <PiBell size="1.5rem" />{" "}
                        {hasUnreadNoti && (
                          <div
                            className="red-dot"
                            style={{
                              position: "absolute",
                              right: "0px",
                              bottom: "0",
                              width: "9px",
                              height: "9px",
                              backgroundColor: " rgb(227, 55, 55)",
                              borderRadius: "8px",
                            }}
                          ></div>
                        )}
                      </div>{" "}
                    </Button>
                  }
                >
                  {notifications?.length > 0 ? (
                    <IconContext.Provider value={{ color: "#000" }}>
                      {notifications?.map((noti, i) => {
                        if (!noti?.hasRead && !hasUnreadNoti)
                          setHasUnreadNoti(true);

                        return (
                          <li
                            className={`notification-li ${noti?.hasRead?"read":''}`}
                            key={`noti-${i}`}
                            onClick={() => handleNotificationClick(noti)}
                          >
                            <span className={`text`}>{noti?.message}</span>
                          </li>
                        );
                      })}
                    </IconContext.Provider>
                  ) : (
                    ""
                  )}
                </Dropdown>

                <Button
                  variant="icon"
                  styleName="new-post-btn"
                  onClick={() => {
                    navigate("/chat");
                  }}
                >
                  <PiChat size="1.5rem" />
                </Button>

                <Dropdown
                  className="profil-dropdown"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  trigger={
                    <div className="profile-image">
                      {auth?.userData?.profileImageUrl ? (
                        <img src={auth?.userData?.profileImageUrl} />
                      ) : (
                        <DefaultProfile size="xs" />
                      )}
                    </div>
                  }
                >
                  <IconContext.Provider value={{ color: "#000" }}>
                    <li
                      onClick={() => {
                        navigate("/me");
                      }}
                    >
                      <PiUser /> Profile
                    </li>{" "}
                    <li onClick={logout}>
                      <PiSignOut /> Logout
                    </li>
                  </IconContext.Provider>
                </Dropdown>
              </>
            ) : (
              <div className="btn-group">
                <Button
                  variant={`link ${
                    !scrolled && location.pathname == "/" && "inverse"
                  }`}
                  styleName="login-btn"
                  onClick={openLogin}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  styleName="signup-btn"
                  onClick={openRegister}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>

          <div className="menu-toggle">
            <FaBars />
          </div>
        </div>
      </IconContext.Provider>
    </>
  );
}

export default NavBar;
