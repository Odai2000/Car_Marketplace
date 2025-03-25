import { useEffect, useState } from "react";
import "./FormControls.css";
import { FaCircleExclamation } from "react-icons/fa6";
useState;
const Input = ({
  type,
  name,
  value,
  onChange,
  label,
  placeholder,
  styleName,
  validationRules,
  formValidate,
  onValidationChange,
  ...props
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
      email,
    } = validationRules;

    if (required && (value === "" || value === null)) {
      return `${label ? label : "This field"}  is required.`;
    }

    if (minLength && value?.length < minLength) {
      return `${
        label ? label : "This field"
      }  must be at least ${minLength} characters long.`;
    }

    if (maxLength && value?.length > maxLength) {
      return `${
        label ? label : "This field"
      }  must be at most ${maxLength} characters long.`;
    }

    if (regex && !new RegExp(regex).test(value)) {
      return `${label ? label : "This field"}  format is invalid.`;
    }

    if (numeric && isNaN(value)) {
      return `${label ? label : "This field"} must be a numeric value.`;
    }
    if (
      email &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
    ) {
      return `Enter valid email address.`;
    }

    if (customValidator) {
      return customValidator(value);
    }

    return ""; // no errors
  };

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validate(value));
    }
  }, []);

  const handleBlur = (e) => {
    const errorMessage = validate(e.target.value);
    setErrorMessage(errorMessage);

    // signals to parent component
    if (onValidationChange) {
      onValidationChange(!errorMessage);
    }
  };
  return (
    <div
      className={`form-control-container input ${styleName ? styleName : ""}`}
    >
      {label && (
        <label className="form-control-label input-label" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`form-control input-field ${errorMessage ? "error" : ""} `}
        {...props}
      />
      {errorMessage && (
        <>
          <FaCircleExclamation className="exclamation-icon" />
          <span className="form-contol-error-message">{errorMessage}</span>
        </>
      )}
    </div>
  );
};

export default Input;
