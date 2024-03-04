import React from "react";
import "./Button.css";

function Button({id,variant, destructive, children, icon, ...props}) {
  const className = `btn ${variant} ${destructive ? "destructive" : ""} `;

  return (
    <button id ={id} className={className} {...props}>
      {icon && <i className={icon}/>} {children}
    </button>
  );
}

export default Button;
