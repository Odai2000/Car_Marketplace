import "./DefaultProfile.css";
import { FaUser } from "react-icons/fa6";

const DefaultProfile = ({ size = "2rem", round }) => {
  let value = size;
  switch (size) {
    case "lg":
      value = "7rem";
      break;
    case "md":
      value = "5rem";
      break;
    case "sm":
      value = "3rem";
      break;
    case "xs":
      value = "1.5rem";
      break;
    default:
      break;
  }
  return (
    <div className={`DefaultProfile default-profile-image ${round && "round"}`}>
      <FaUser style={{ color: "#aaa", fontSize: value }} />
    </div>
  );
};

export default DefaultProfile;
