import { FaCircleExclamation } from "react-icons/fa6";
import "./FormControls.css";
import { useState } from "react";


const Select = ({
  name,
  id,
  value,
  label,
  onChange,
  styleName,
  options,
  defaultOption,
  validationRules,
  children
}) => {
    const [errorMessage, setErrorMessage] = useState("");
  
    const validate = (value) => {
      const {
        required,
        minLength,
        maxLength,
        regex,
        customValidator,
        numeric,
      } = validationRules;
  
      if (required && value == "") {
        return `${label? label:'This field'}  is required.`;
      }
  
      if (minLength && value.length < minLength) {
        return `${label? label:'This field'}  must be at least ${minLength} characters long.`;
      }
  
      if (maxLength && value.length > maxLength) {
        return `${label? label:'This field'}  must be at most ${maxLength} characters long.`;
      }
  
      if (regex && !new RegExp(regex).test(value)) {
        return `${label? label:'This field'}  format is invalid.`;
      }
  
      if (numeric && isNaN(value)) {
        return `${label? label:'This field'} must be a numeric value.`;
      }
  
      // TODO: custom validtor function
  
      return ""; // no errors
    };
  
    const handleBlur = (e) => {
      const errorMessage = validate(e.target.value);
      
      console.log('triggered '+errorMessage)
      setErrorMessage(errorMessage);
    };
  return (
    <div className={`form-control-container ${styleName}`}>
      {label ? (
        <label className="select-label" htmlFor={name}>
          {label}
        </label>
      ) : (
        ""
      )}
      <select
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        className={`form-control select-field ${errorMessage?'error':''}`}
      >
        {defaultOption ? (
          <option key={defaultOption.value} value={defaultOption.value}>
            {defaultOption.label}
          </option>
        ) : (
          ""
        )}
        {options
          ? options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          : children}
      </select>
         {errorMessage && (
              <>
                <FaCircleExclamation className="exclamation-icon" />
                <span className="form-contol-error-message">{errorMessage}</span>
              </>
            )}
    </div>
  );
};

export default Select;
