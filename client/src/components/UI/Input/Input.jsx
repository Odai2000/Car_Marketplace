import React from "react";
import "./Input.css";

const Input = ({ type, name, value, onChange, placeholder, styleName }) => {
  return (
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={"input-field " + styleName}
    />
  );
};

export default Input;