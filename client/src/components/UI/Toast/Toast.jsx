import "./Toast.css";
import {
  FaCircleCheck,
  FaCircleXmark,
  FaCircleExclamation,
  FaCircleInfo,
  FaXmark,
  FaCheck,
  
} from "react-icons/fa6";

const Toast = ({ message, variant, cancellable = true, setVisibility }) => {
  const getIcon = (variant) => {
    switch (variant) {
      case "success":
        return <FaCheck />;
      case "error":
        return <FaCircleXmark />;
      case "warning":
        return <FaCircleExclamation />;
      case "info":
        return <FaCircleInfo  />;
      default:
        return null;
    }
  };

  return (
    <>
     
        <div className={`Toast ${variant}`}>
          <div className="toast-icon">{getIcon(variant)}</div>
          <span className="toast-message">{message}</span>
          {cancellable && (
            <div className="toast-close">
              <button className="toast-close-btn" onClick={() => setVisibility(false)}>
                <FaXmark />
              </button>
            </div>
          )}
        </div>
      
    </>
  );
};

export default Toast;
