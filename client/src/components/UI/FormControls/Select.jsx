import { FaCircleExclamation } from "react-icons/fa6";
import "./FormControls.css";
import { useEffect, useState } from "react";

const Select = ({
  name,
  id,
  value,
  label,
  variant="standard",
  onChange,
  styleName = "",
  options,
  defaultOption,
  validationRules={},
  onValidationChange,
  children,
  props
}) => {
  const [errorMessage, setErrorMessage] = useState("");

  const validate = (value) => {
    const { required, customValidator } = validationRules;

    if (required && value == "") {
      return `${label ? label : "This field"}  is required.`;
    }

    if (customValidator) {
      return customValidator(value);
    }

    return ""; // no errors
  };

  const handleChange = (e) => {
    const errorMessage = validate(e.target.value);
    setErrorMessage(errorMessage);

    // signals to parent component
    if (onValidationChange) {
      onValidationChange(!errorMessage);
    }
    onChange(e)
  };

    useEffect(() => {
      if (onValidationChange) {
        onValidationChange(validate(value));
      }
    }, []);
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
        onChange={(e) => handleChange(e)}
        className={`form-control select-field ${variant} ${errorMessage ? "error" : ""}`}
        {...props}
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
