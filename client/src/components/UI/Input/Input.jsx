import React from 'react';
import './Input.css'; 

const Input = ({ label, type, name, value, onChange, placeholder, styleName }) => {
  return (
    <div className={`input-group ${styleName}`}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
};

export default Input;
