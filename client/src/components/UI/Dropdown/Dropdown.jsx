import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./Dropdown.css";

const Dropdown = ({ trigger, children, onClose, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const toggleOpen = () => setIsOpen((prev) => !prev);

  // closes if clicked element is li tag only
  const handleClick = (e) => {
    if (e.target.tagName === "LI") {
      setIsOpen(false);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef?.current &&
        !dropdownRef?.current?.contains(e.target) &&
        !triggerRef?.current?.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Position dropdown when opened
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef?.current?.getBoundingClientRect();
      const dropdownRect = dropdownRef?.current?.getBoundingClientRect();
      if (rect.left + dropdownRect?.width >= window.innerWidth) {
        setMenuPosition({
          top: rect.bottom + window.scrollY,
          left: rect.right + window.scrollX - dropdownRect?.width,
        });
      } else {
        setMenuPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
    }
  }, [isOpen, window.scrollY]);

  return (
    <div className={`Dropdown ${className || ""}`} onClick={handleClick}>
      <div onClick={toggleOpen} ref={triggerRef}>
        {trigger}
      </div>

      {isOpen &&
        children &&
        createPortal(
          <div
            ref={dropdownRef}
            className="dropdown-menu"
            style={{
              position: "absolute",
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              zIndex: 1000,
            }}
          >
            {children}
          </div>,
          document.body
        )}
    </div>
  );
};

export default Dropdown;
