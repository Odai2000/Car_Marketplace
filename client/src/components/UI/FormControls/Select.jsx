import { FaCircleExclamation } from "react-icons/fa6";
import "./FormControls.css";
import { useEffect, useState } from "react";

const Select = ({
  name,
  id,
  value,
  label,
  variant = "standard",
  onChange,
  styleName = "",
  multiple,
  options,
  defaultOption,
  validationRules = {},
  onValidationChange,
  children,
  ...props
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
    const normalizedValue =multiple
    ? Array.from(e.target.selectedOptions, (option) => option.value)
    : e.target.value;
    const errorMessage = validate(normalizedValue);
    setErrorMessage(errorMessage);

    // signals to parent component
    if (onValidationChange) {
      onValidationChange(!errorMessage);
    }
    onChange(e);
  };

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validate(value));
    }
  }, []);

  const normalizedOptions = (options || []).map((option) => {
    if (
      option !== null &&
      typeof option === "object" &&
      ("value" in option || "label" in option)
    ) {
      return {
        value: option.value,
        label: option.label ?? option.value,
      };
    }

    return {
      value: option,
      label: String(option),
    };
  });

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
      multiple={multiple}
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
        {normalizedOptions && normalizedOptions.length > 0
          ? normalizedOptions.map((option) => (
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
