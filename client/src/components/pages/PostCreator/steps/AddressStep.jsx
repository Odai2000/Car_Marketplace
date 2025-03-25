import { useEffect, useState } from "react";
import useAppData from "../../../../hooks/useAppData";
import Input from "../../../UI/FormControls/Input";
import Select from "../../../UI/FormControls/select";

const AddressStep = ({
  formData,
  setFormData,
  isSmallScreen,
  setControlsValidity,
  handleValidateChange,
}) => {
  const { countriesData, loadingCountries } = useAppData();
  const [selectedCountry, setSelectedCountry] = useState([]);

   useEffect(() => {
    setControlsValidity({
      countryCode: !!formData.location.countryCode,
      stateCode: !!formData.location.stateCode,
      address: !!formData.location.address,
    });

    if (formData.location.countryCode && countriesData?.states) {
      const state = countriesData.states.find((state) => state.code === formData.location.stateCode);
      setSelectedCountry(state || {});
    }
    }, []);

  if (loadingCountries) {
    console.log("loading countries...");
    return <div>Loading.....</div>;
  }

  const handleSelectedCountryChange = (countryCode) => {
    setSelectedCountry(
      countriesData.find((country) => {
        return country.code === countryCode;
      })
    );
    setFormData({
      ...formData,
      location: { ...formData.location, countryCode: countryCode },
    });
  };
  return (
    <>
      <Select
        name="countryCode"
        value={formData.location.countryCode}
        onChange={(e) => handleSelectedCountryChange(e.target.value)}
        styleName={!isSmallScreen ? "col-2" : ""}
        validationRules={{ required: true }}
        defaultOption={{ label: "Select a Country", value: "" }}
        onValidationChange={(value) => handleValidateChange("countryCode", value)}
      >
        {countriesData.map((country) => (
          <option value={country.code} key={country.code}>
            {country.name}
          </option>
        ))}
      </Select>
      <Select
        name="stateCode"
        value={formData.location.state}
        onChange={(e) =>
          setFormData({
            ...formData,
            location: { ...formData.location, [e.target.name]: e.target.value },
          })
        }
        styleName={!isSmallScreen ? "col-2" : ""}
        validationRules={{ required: true }}
        defaultOption={{ label: "Select a State", value: "" }}
        onValidationChange={(value) => handleValidateChange("stateCode", value)}
      >
        {selectedCountry && selectedCountry.states?.map((state) => (
          <option
            value={state.code}
            key={state.code !== "-" ? state.code : state.code + state.name}
          >
            {state.name}
          </option>
        ))}
      </Select>

      <Input
        type="text"
        name="address"
        value={formData.location.address}
        onChange={(e) =>
          setFormData({
            ...formData,
            location: { ...formData.location, [e.target.name]: e.target.value },
          })
        }
        placeholder="Address eg: "
        validationRules={{ required: false }}
        onValidationChange={(value) => handleValidateChange("address", value)}
      />
    </>
  );
};

export default AddressStep;
