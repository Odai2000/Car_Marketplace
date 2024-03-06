import React from "react";
import "./Button.css";

function Button({styleName,id,variant, destructive, children, icon, ...props}) {
  const className = `btn ${variant} ${destructive ? "destructive" : ""} `;

  return (
    <button id ={id} className={className + (styleName?styleName:'')} {...props}>
      {icon && <i className={icon}/>} {children}
    </button>
  );
}

export default Button;