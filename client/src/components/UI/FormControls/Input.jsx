import React from "react";
import "./FormControls.css";

const Input = ({ type, name, value, onChange, placeholder, styleName,...props }) => {
  return (
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={"form-control input-field " + styleName}
      {...props}
    />
  );
};

export default Input;