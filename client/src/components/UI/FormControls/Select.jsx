import "./FormControls.css";

const Select = ({
  name,
  id,
  value,
  label,
  onChange,
  styleName,
  options,
  defaultOption,
  children,
}) => {
  return (
    <div className="form-control-container">
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
        className={"form-control select-field " + styleName}
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
    </div>
  );
};

export default Select;
