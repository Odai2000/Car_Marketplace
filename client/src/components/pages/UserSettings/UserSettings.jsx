import { useEffect, useRef, useState } from "react";
import Button from "../../UI/Button/Button";

import "./UserSettings.css";
import useAuth from "../../../hooks/useAuth";
import useWindow from "../../../hooks/useWindow";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRightFromBracket,
  FaGear,
  FaLock,
  FaUser,
  FaXmark,
} from "react-icons/fa6";
import logoWhite from "../../../assets/logo-white.svg";

// views
import ProfileView from "./views/ProfileView";
import SecurityView from "./views/SecurityView";
import ProfileImage from "../../UI/Utility/ProfileImage/ProfileImage";

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [toggleView, setToggleView] = useState(false);

  const { auth, setAuth, logout } = useAuth();

  const navigate = useNavigate();
  const { isSmallScreen } = useWindow();

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setToggleView(true);
  };

  return (
    <>
      <div className="UserSettings">
        <div className={`sidebar ${!toggleView ? "toggled" : ""}`}>
          {isSmallScreen && (
            <Button
              variant={"icon"}
              style={{ marginLeft: "auto" }}
              onClick={() => navigate(-1)}
            >
              <FaXmark size="1.5em" color="#fff" />
            </Button>
          )}
          <header className="flex gap-0.5em center">
            <div id="logo">
              <Link to="/">
                <img src={logoWhite} alt="logo" />
              </Link>
            </div>
          </header>

          <div className="vertical-tabs">
            <Button
              styleName={`tab ${activeTab === "Profile" ? "active" : ""}`}
              variant="primary round"
              onClick={() => {
                handleTabClick("Profile");
              }}
            >
              <FaUser /> Profile
            </Button>
            <Button
              styleName={`tab ${
                activeTab === "Security" ? "active" : ""
              }`}
              onClick={() => handleTabClick("Security")}
              variant="primary round"
            >
              <FaLock /> Security
            </Button>
            <Button
              styleName={`tab ${activeTab === "Perferences" ? "active" : ""}`}
              onClick={() => {
                handleTabClick("Perferences");
              }}
              variant="primary round"
            >
              <FaGear /> Perferences
            </Button>
          </div>

          <div className="footer flex">
            <div className="profile-container flex">
         <ProfileImage round src={auth?.userData?.profileImageUrl} size="sm"/>
              <div className="name">
                {auth?.userData?.firstName + " " + auth?.userData?.lastName}
              </div>
            </div>
            <Button variant = "icon" styleName="logout-icon" onClick={logout}>
              <FaArrowRightFromBracket color="#fff" size="1em" />
            </Button>
          </div>
        </div>
        <div className={`config-panel ${toggleView ? "toggled" : ""}`}>
          <header className="flex gap-05em">
            {isSmallScreen && (
              <Button variant={"icon"} onClick={() => setToggleView(false)}>
                <FaArrowLeft />
              </Button>
            )}
            <h1>{activeTab}</h1>
            <Button
              variant={"icon"}
              style={{ marginLeft: "auto" }}
              onClick={() => navigate(-1)}
            >
              <FaXmark />
            </Button>
          </header>
          {activeTab === "Profile" ? <ProfileView /> : ""}

          {activeTab === "Security" ? (
            <>
              <div className="change-password ">
                <SecurityView />
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default UserSettings;
