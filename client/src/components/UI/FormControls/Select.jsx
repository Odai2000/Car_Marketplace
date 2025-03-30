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
  onValidationChange,
  children,
}) => {
  const [errorMessage, setErrorMessage] = useState("");

  const validate = (value) => {
    const { required, customValidator} =
      validationRules;

    if (required && value == "") {
      return `${label ? label : "This field"}  is required.`;
    }
    
    if (customValidator ) {
      return customValidator(value)
    }

    return ""; // no errors
  };

  const handleBlur = (e) => {
    const errorMessage = validate(e.target.value);
    setErrorMessage(errorMessage);

    // signals to parent component
    if (onValidationChange) {
      onValidationChange(!errorMessage);
    }
  };
  return (
    <div className={`form-control-container ${styleName}`}>
      {label ? (
        <label className="form-control-label select-label" htmlFor={name}>
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
        className={`form-control select-field ${errorMessage ? "error" : ""}`}
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
