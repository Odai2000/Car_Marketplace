import "./DefaultProfile.css";
import { FaUser } from "react-icons/fa6";
const DefaultProfile = ({size='2em'}) => {
  return (
    <div className="DefaultProfile default-profile-image">
      <FaUser style={{ color: "#aaa",fontSize:size }} />
    </div>
  );
};

export default DefaultProfile;
