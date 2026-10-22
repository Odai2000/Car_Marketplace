
import "./UserSettings.css";

import {
  FaBrush,
  FaLock,
  FaUser,
} from "react-icons/fa6";

import Sidebar from "@/components/UI/Sidebar/Sidebar";

// views
import ProfileView from "./views/ProfileView";
import SecurityView from "./views/SecurityView";


const UserSettings = () => {


  const tabs =[
  {
    id: "Profile",
    label: "Profile",
    icon: <FaUser />,
    content:<ProfileView/>
  },
  {
    id: "Security",
    label: "Security",
    icon: <FaLock />,
    content:<SecurityView/>
  },
  {
    id: "Preferences",
    label: "Preferences",
    icon: <FaBrush />,
    content:'WIP'
  }
];
  return (
    <>
      <div className="UserSettings">
        <Sidebar
        tabs={tabs}title="User Settings" cancelable={true} />
        </div>
    </>
  );
};

export default UserSettings;
