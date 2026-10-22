
import "./Dashboard.css";
import { FaArrowLeft,FaArrowRightFromBracket, FaCar, FaLock, FaTable, FaUser } from "react-icons/fa6";
import UsersManagerView from "./views/UsersMangerView/UsersManagerView";
import Sidebar from "@/components/UI/Sidebar/Sidebar";

const Dashboard = () => {


const tabs =[
  {
    id: "Users Management",
    label: "Users Management",
    icon: <FaUser />,
    content:<UsersManagerView/>
  },
  {
    id: "Posts",
    label: "Posts",
    icon: <FaCar />
  },
  {
    id: "Preferences",
    label: "Preferences",
    icon: <FaTable />
  }
];
  return (
    <div className="Dashboard">
      <Sidebar tabs={tabs} includeNav={true}/>
    </div>
  );
};

export default Dashboard;
