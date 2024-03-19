import React, { Children } from "react";
import "./FormControls.css";

const Select = ({ name, id, value, onChange, styleName,options,children }) => {
  return (
    <select
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className={"form-control select-field " + styleName}
    >
       {options?options.map((option)=>(
        <option key ={option.value} value={option.value}>{option.label}</option>
       ) ):children}
    </select>
  );
};

export default Select;
