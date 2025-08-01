import { FaXmark } from "react-icons/fa6";
import Button from "../Button/Button";
import "./Modal.css";
import { createPortal } from "react-dom";

const Modal = ({
  show = false,
  onClose = () => {},
  title,
  className = "",
  children,
}) => {
  return (
    show &&
    createPortal(
      <>
        <div
        tabIndex='-1'
          autoFocus
          className={`Modal ${className}`}
          onKeyDown={(e) => {
            console.log(String.fromCharCode(e.charCode));
            if (e.key == "Escape") {
              onClose();
            }
          }}
        >
          <div className="modal-body card">
            {" "}
            <div className="cancel-btn-container">
              <Button
                styleName="cancel-btn"
                variant="icon"
                icon
                onClick={onClose}
              >
                <FaXmark />
              </Button>
            </div>
            {title && (
              <header>
                <h2>{title}</h2>
              </header>
            )}
            <div className="content">{children}</div>
          </div>
        </div>
      </>,
      document.body
    )
  );
};

export default Modal;
