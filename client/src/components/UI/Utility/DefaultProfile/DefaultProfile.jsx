import "./DefaultProfile.css";
import { FaUser } from "react-icons/fa6";

const DefaultProfile = ({ size = "2em", round }) => {
  let value = size;
  switch (size) {
    case "lg":
      value = "7em";
      break;
    case "md":
      value = "5em";
      break;
    case "sm":
      value = "3em";
      break;
    case "xs":
      value = "1em";
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
