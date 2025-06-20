import { useEffect, useState } from "react";
import "./FormControls.css";
import Input from "./Input";

const Autocomplete = ({
  fetchData,
  data,
  value,
  onChange,
  minLength = 2,
  getDisplayValue,
  onSelection,
  ...props
}) => {
  const [userInput, setUserInput] = useState(value || "");

  const [suggestions, setSuggestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
    const [isMouseOverSuggestions, setIsMouseOverSuggestions] = useState(false);

  const handleChange = (e) => {
    setUserInput(e.target.value);
    onChange(e);
  };
  
  const handleSelection = (selection) => {
    setSuggestions([]);

    setUserInput(getDisplayValue(selection)||selection.display);
    onSelection(selection)
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setCurrentIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && currentIndex >= 0) {
      e.preventDefault();
      handleSelection(suggestions[currentIndex]);
    }
  };

  const handleBlur = ()=>{
       if (!isMouseOverSuggestions) {
      setSuggestions([]);
    }
  }

  useEffect(() => {
    if (userInput.length < minLength) {
      setSuggestions([]);
      return;
    }

    const delaySuggestions = setTimeout(async () => {
      if (fetchData) {
        try {
          const fetchedData = await fetchData(userInput);
          setSuggestions(fetchedData);
        } catch (error) {
          console.log(error);
        }
      } else if (data) {
        setSuggestions(
          data.filter((item) =>
            item.toLowerCase().includes(userInput.toLowerCase())
          )
        );
      }
    }, 300);

    return () => {
      clearTimeout(delaySuggestions);
    };
  }, [userInput]);

  return (
    <>
      <div className="Autocomplete">
        <Input
          value={value}
          onChange={(e) => handleChange(e)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          autoComplete="off"
          {...props}
        />
        {suggestions?.length > 0 && (
          <ul className="autocomplete-dropdown"       onMouseEnter={() => setIsMouseOverSuggestions(true)}
          onMouseLeave={() => setIsMouseOverSuggestions(false)}>
            {suggestions.map((suggestion, index) => (
              <li className={index===currentIndex && 'active'} key={index} onClick={() => handleSelection(suggestion)}>
                {suggestion.display}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Autocomplete;
