import "./Alert.css";
import {
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";

const icons = {
  info: <FaInfoCircle />,
  success: <FaCheckCircle />,
  warning: <FaExclamationTriangle />,
  error: <FaTimesCircle />,
};

const Alert = ({ type = "info", className,children }) => {
  return (
    <div className={`Alert ${type} ${className}`}>
      <span className="alert-icon">{icons[type]}</span>
      <span className="alert-text">{children}</span>
    </div>
  );
};

export default Alert;