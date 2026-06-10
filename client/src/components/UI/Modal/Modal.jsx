import { FaXmark } from "react-icons/fa6";
import Button from "../Button/Button";
import "./Modal.css";
import { createPortal } from "react-dom";
import useLockBody from "../../../hooks/utility/useLockBody";
import { useState } from "react";

const Modal = ({
  show = false,
  onClose = () => {},
  title = "",
  text = "",
  className = "",
  dialog = false,
  children,
}) => {
  useLockBody(show);
  return (
    show &&
    createPortal(
      <>
        <div
          tabIndex="-1"
          autoFocus
          className={`Modal ${dialog?'dialog':''} ${className}`}
          onKeyDown={(e) => {
            console.log(String.fromCharCode(e.charCode));
            if (e.key == "Escape") {
              onClose();
            }
          }}
        >
          <div className="modal-body card">
 
              <header>
                {" "}
                {title && <h2>{title}</h2>}
      
                  <div className="cancel-btn-container">
                    <Button
                      styleName="cancel-btn"
                      variant="icon"
                      icon
                      onClick={onClose}
                      style={{ fontSize: "1rem", paddingBottom: "0" }}
                    >
                      <FaXmark />
                    </Button>
                  </div>
         
              </header>
     

            <div className="content">
              {text ? <span>{text}</span> : ""}
              {children}
            </div>
          </div>
        </div>
      </>,
      document.body
    )
  );
};

export default Modal;
