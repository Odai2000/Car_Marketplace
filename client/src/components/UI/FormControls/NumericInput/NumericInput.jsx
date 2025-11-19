import Input from "../Input";

const NumericInput = ({
  allowDecimal = true,
  allowNegative = false,
  value,
  onChange,
  maxLength = 14,
  placeholder,
  ...props
}) => {

  const formatNumber = (inputValue) => {
    if (inputValue === "" || inputValue === "-") return inputValue;
    const pattern = allowDecimal ? /^-?[\d,.]*$/ : /^-?[\d,]*$/;
    if (!pattern.test(inputValue)) return null;

    let withoutFormatting = inputValue.replace(/,/g, "");
    let integerPart = withoutFormatting;
    let decimalPart = "";

    if (allowDecimal) {
      const decimalParts = withoutFormatting.split(".");
      if (decimalParts.length > 2) return null;
      integerPart = decimalParts[0];
      decimalPart = decimalParts[1] ? `.${decimalParts[1]}` : "";
    }

    const isNegative = integerPart.startsWith("-");
    const digits = isNegative ? integerPart.slice(1) : integerPart;
    let cleanDigits = digits.replace(/^0+(?!$)/, "");

    const withCommas = cleanDigits
      ? cleanDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : cleanDigits;

    return (isNegative ? "-" : "") + withCommas + decimalPart;
  };

  const handleChange = (e) => {
    const inputVal = e.target.value;

    const numericDigits = inputVal.replace(/[^0-9]/g, "");
    if (numericDigits.length > maxLength) return;

    const formatted = formatNumber(inputVal);
    if (formatted === null) return;

    const rawValue = formatted.replace(/,/g, "");
    const numericValue =
      rawValue === "" || rawValue === "-"
        ? null
        : allowDecimal
        ? parseFloat(rawValue)
        : parseInt(rawValue, 10);

    onChange(numericValue);
  };

  const displayValue =
    value === null || value === undefined || value === ""
      ? ""
      : formatNumber(String(value));

  const handleKeyDown = (e) => {
    const allowedKeys = [
      "Backspace", "Delete", "Tab", "Escape", "Enter",
      "ArrowLeft", "ArrowRight", "Home", "End",
    ];
    if (allowedKeys.includes(e.key)) return;

    if (allowDecimal && e.key === ".") {
      if (String(displayValue).includes(".")) e.preventDefault();
      return;
    }

    if (e.key === "-" && allowNegative) {
      if (e.target.selectionStart !== 0 || String(displayValue).includes("-")) {
        e.preventDefault();
      }
      return;
    }

    if (!/\d/.test(e.key)) e.preventDefault();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const numericPaste = pasteData.replace(/[^\d-.]/g, "");

    if (!numericPaste) return;

    const newValue = (displayValue || "") + numericPaste;
    handleChange({ target: { value: newValue } });
  };

  const handleBlur = () => {
    if (String(displayValue).endsWith(".")) {
      onChange(parseFloat(displayValue.slice(0, -1)));
    }
  };

  return (
    <Input
      type="text"
      inputMode={allowDecimal ? "decimal" : "numeric"}
      placeholder={placeholder}
      value={displayValue}
      maxLength={maxLength ||0}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onBlur={handleBlur}
      {...props}
    />
  );
};

export default NumericInput;
