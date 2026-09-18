import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import Button from "../../UI/Button/Button";
import "./Dashboard.css"
import { useState,useEffect} from "react";
import useWindowSize from "../../../hooks/useWindow";
import { FaArrowLeft, FaLock, FaUser } from "react-icons/fa6";
import DatabaseView from "./views/UsersMangerView/UserManagerView";


const Dashboard = ()=>{
 const [activeTab, setActiveTab] = useState("Data");
  const [toggleView, setToggleView] = useState(false);

  const { isSmallScreen } = useWindowSize();

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setToggleView(true);
  };
    return (
        <div className="Dashboard">
                   <div className={`sidebar ${!toggleView ? "toggled" : ""}`}>

          <header className="flex gap-0.5em center">

          </header>

          <div className="vertical-tabs">
            <Button
              styleName={`tab ${activeTab === "Data" ? "active" : ""}`}
              variant="primary round"
              onClick={() => {
                handleTabClick("Data");
              }}
            >
              <FaUser /> Data
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
                handleTabClick("Preferences");
              }}
              variant="primary round"
            >
               Preferences
            </Button>
          </div>

          {/* <div className="footer flex">
            <div className="profile-container flex">
         <DataImage round src={auth?.userData?.profileImageUrl} size="sm"/>
              <div className="name">
                {auth?.userData?.firstName + " " + auth?.userData?.lastName}
              </div>
            </div>
            <Button variant = "icon" styleName="logout-icon" onClick={logout}>
              <FaArrowRightFromBracket color="#fff" size=".85em" />
            </Button>
          </div> */}
        </div>
        <div className={`config-panel ${toggleView ? "toggled" : ""}`}>
          <header className="flex gap-05em">
            {isSmallScreen && (
              <Button variant={"icon"} onClick={() => setToggleView(false)}>
                <FaArrowLeft />
              </Button>
            )}
            <h1>{activeTab}</h1>

          </header>
          {activeTab === "Data" ? <DatabaseView /> : null}

          {/* {activeTab === "Security" ? (
            <>
              <div className="change-password ">
                <SecurityView />
              </div>
            </>
          ) : (
            ""
          )} */}
        </div>
        </div>
    )
}

export default Dashboard;
