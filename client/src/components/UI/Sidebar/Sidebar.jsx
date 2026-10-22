// AI generated code.

import { useRef, useState } from "react";
import Button from "../Button/Button";
import ProfileImage from "@/components/UI/Utility/ProfileImage/ProfileImage";
import useWindowSize from "../../../hooks/useWindowSize";
import { FaArrowLeft, FaArrowRightFromBracket, FaXmark } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

import "./Sidebar.css";
import logoWhite from "../../../assets/logo-white.svg";
import useAuth from "@/hooks/useAuth";
import useComputeRemainingHeight from "@/hooks/utility/useComputeRemainingHeight";
import NavBar from "@/components/NavBar/NavBar";

const Sidebar = ({
  tabs = [],
  defaultTab = tabs[0]?.id || "",
  title = "",
  onLogout = null,
  showProfile = true,
  showBackButton = true,
  cancelable = false,
  includeNav = false,
  className = "",
  renderContent,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [toggleView, setToggleView] = useState(false);
  const { isSmallScreen } = useWindowSize();

  const { auth, setAuth, logout } = useAuth();
  const profile = auth?.userData;

  const currentTab =
    tabs.find((tab) => tab.id === activeTab) || tabs[0] || null;

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    setToggleView(true);
  };

  const activeContent =
    typeof renderContent === "function"
      ? renderContent(currentTab)
      : currentTab?.content || null;

  const navigate = useNavigate();

  const sidebarRef = useRef(null);
  const { remainingHeight } = useComputeRemainingHeight(sidebarRef);
  return (
    <div
      className={`Sidebar ${className} `}
      ref={sidebarRef}
      style={{ height: remainingHeight }}
    >
      <div className={`sidebar ${!activeTab ? "toggled" : ""}`}>
        {/* <header className="flex gap-0.5em center">{title}</header> */}

        <header className="flex gap-0.5em center">
          <div id="logo">
            <Link to="/">
              <img src={logoWhite} alt="logo" />
            </Link>
          </div>
        </header>

        <div className="vertical-tabs">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              styleName={`tab ${activeTab === tab.id ? "active" : ""}`}
              variant="primary round"
              onClick={() => handleTabClick(tab)}
            >
              {tab.icon && <span>{tab.icon}</span>} {tab.label}
            </Button>
          ))}
        </div>

        {showProfile && (
          <div className="footer flex">
            <div className="profile-container flex">
              <ProfileImage round src={profile?.profileImageUrl} size="sm" />

              <div className="name">{profile?.name}</div>
            </div>

            <Button
              variant="icon"
              styleName="logout-icon"
              onClick={onLogout || logout}
            >
              <FaArrowRightFromBracket color="#fff" size="1.5em" />
            </Button>
          </div>
        )}
      </div>

      <div className={`panel ${activeTab ? "toggled" : ""}`}>
        {includeNav && <NavBar includeLogo={false} />}
        <header className="flex gap-05em">
          {isSmallScreen && (
            <Button variant={"icon"} onClick={() => setActiveTab(null)}>
              <FaArrowLeft />
            </Button>
          )}
          <h1>{activeTab}</h1>
          {cancelable && (
            <Button
              variant={"icon"}
              style={{ marginLeft: "auto" }}
              onClick={() => navigate(-1)}
            >
              <FaXmark />
            </Button>
          )}
        </header>

        <div className="content-panel">{activeContent}</div>
      </div>
    </div>
  );
};

export default Sidebar;
