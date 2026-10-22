// AI generated code. review later



import { FaChevronDown, FaCircleExclamation } from "react-icons/fa6";
import { useEffect, useMemo, useState } from "react";
import "../FormControls.css";
import Dropdown from "../../Dropdown/Dropdown";

const CheckBoxes = ({
  name,
  id,
  value = [],
  label,
  variant = "normal",
  onChange,
  styleName = "",
  options = [],
  validationRules = {},
  onValidationChange,
  defaultOption,
  ...props
}) => {
  const [errorMessage, setErrorMessage] = useState("");

  const normalizedOptions = useMemo(() => {
    return (options || []).map((option) => {
      if (option !== null && typeof option === "object") {
        return {
          value: option.value,
          label: option.label ?? String(option.value),
        };
      }

      return {
        value: option,
        label: String(option),
      };
    });
  }, [options]);

  const validate = (values) => {
    const { required, customValidator } = validationRules;

    if (required && (!values || values.length === 0)) {
      return `${label ? label : "This field"} is required.`;
    }

    if (customValidator) {
      return customValidator(values);
    }

    return "";
  };

  const emitChange = (nextValue) => {
    const error = validate(nextValue);
    setErrorMessage(error);

    if (onValidationChange) {
      onValidationChange(!error);
    }

    if (onChange) {
      onChange({
        target: {
          name,
          value: nextValue,
        },
      });
    }
  };

  const toggleOption = (optionValue) => {
    const nextValue = value.includes(optionValue)
      ? value.filter((item) => item !== optionValue)
      : [...value, optionValue];

    emitChange(nextValue);
  };

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(!validate(value));
    }
  }, []);

  const selectedLabels = normalizedOptions
    .filter((option) => value.includes(option.value))
    .map((option) => option.label);

  if (variant === "dropdown") {
    return (
      <div className={`form-control-container ${styleName}`}>
        {label ? (
          <label className="form-control-label select-label" htmlFor={name}>
            {label}
          </label>
        ) : (
          ""
        )}

        <Dropdown
          trigger={
            <button type="button" className={`form-control checkbox-dropdown-trigger ${errorMessage ? "error" : ""}`}>
              <span>
                {selectedLabels.length > 0
                  ? selectedLabels.join(", ")
                  : defaultOption?.label || "Select..."}
              </span>
              <FaChevronDown size={12} />
            </button>
          }
        >
          <div className="checkbox-dropdown-menu">
            {normalizedOptions.map((option) => {
              const checked = value.includes(option.value);

              return (
                <label key={option.value} className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOption(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        </Dropdown>

        {errorMessage && (
          <>
            <FaCircleExclamation className="exclamation-icon" />
            <span className="form-contol-error-message">{errorMessage}</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`form-control-container ${styleName}`}>
      {label ? (
        <label className="form-control-label select-label" htmlFor={name}>
          {label}
        </label>
      ) : (
        ""
      )}

      <div className={`checkbox-group  ${errorMessage ? "error" : ""} flex gap-05em`}  >
        {normalizedOptions.map((option) => {
          const checked = value.includes(option.value);

          return (
            <label
              key={option.value}
              className={`checkbox-card ${checked ? "selected" : ""}`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleOption(option.value)}
                
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>

      {errorMessage && (
        <>
          <FaCircleExclamation className="exclamation-icon" />
          <span className="form-contol-error-message">{errorMessage}</span>
        </>
      )}
    </div>
  );
};

export default CheckBoxes;