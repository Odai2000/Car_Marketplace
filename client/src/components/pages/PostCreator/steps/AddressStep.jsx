import { useEffect, useState } from "react";
import useAppData from "../../../../hooks/useAppData";
import Input from "../../../UI/FormControls/Input";
import Button from "../../../UI/Button/Button";
import Select from "../../../UI/FormControls/select";
import useConfig from "../../../../hooks/useConfig";
import Autocomplete from "../../../UI/FormControls/Autocomplete";
import useToast from "../../../../hooks/useToast";
import { FaLocationCrosshairs } from "react-icons/fa6";

const AddressStep = ({
  formData,
  setFormData,
  isSmallScreen,
  setControlsValidity,
  handleValidateChange,
}) => {
  const { config } = useConfig();
  const { showToast } = useToast();
  const { countriesData, loadingCountries } = useAppData();
  const [selectedCountry, setSelectedCountry] = useState({});

  useEffect(() => {
    setControlsValidity({
      countryCode: !!formData.location.countryCode,
      // stateCode: !!formData.location.stateCode,
    });

    if (formData.location.countryCode && countriesData) {
      const country = countriesData.find(
        (country) => country.code === formData.location.countryCode
      );
      setSelectedCountry(country || null);
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

  const getCoords = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            resolve(coords);
          },
          (error) => {
            navigator.permissions
              .query({ name: "geolocation" })
              .then((permission) =>
                console.log("Permission state:", permission.state)
              );
            let errorMessage = "Location access failed: ";
            switch (error.code) {
              case 1: // PERMISSION_DENIED
                errorMessage += "You denied location permission.";
                break;
              case 2: // POSITION_UNAVAILABLE
                errorMessage +=
                  "Couldn't detect your location. Ensure GPS/Wi-Fi is on.";
                break;
              case 3: // TIMEOUT
                errorMessage += "Location request timed out. Try again.";
                break;
              default:
                errorMessage += "Unknown error (is your device online?).";
            }
            reject(new Error(errorMessage));
          }
        );
      } else {
        const msg = "Geolocation is not supported by this browser.";
        showToast(msg);
        console.log(msg);
        reject(new Error(msg));
      }
    });
  };
  const geocoding = async (query) => {
    try {
      const response = await fetch(
        `${config.geocodingProviderURL}/api/?q=${encodeURIComponent(
          query
        )}&limit=4` // might add limit to params
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const reverseGeocoding = async (coords) => {
    try {
      const response = await fetch(
        `${config.geocodingProviderURL}/reverse?lon=${coords.longitude}&lat=${coords.latitude}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetLocation = async () => {
    const coords = await getCoords();

    const geocodeData = await reverseGeocoding(coords);
    const properties = geocodeData.features[0].properties;

    const address = `${properties.name ? properties.name + ", " : ""}${
      properties.street ? properties.street + ", " : ""
    }${properties.city ? properties.city + ", " : ""}${
      properties.country ? properties.country : ""
    }`;

    setFormData({
      ...formData,
      location: {
        ...formData.location,
        latitude: coords.latitude,
        longitude: coords.longitude,
        countryCode: geocodeData.features[0].properties.countrycode,
        address: address,
      },
    });

    setControlsValidity({
      countryCode: !!geocodeData.features[0].properties.countrycode,
    }); //failed to find better solution for now....

  };

  const fetchAddressSuggestions = async (query) => {
    try {
      const geocodeData = await geocoding(query);
      const suggestions = geocodeData.features
        .filter((feature) => {
          return (
            feature.properties.countrycode === formData.location.countryCode
          );
        })
        .map((feature) => {
          const properties = feature.properties;
          const coords = feature.geometry.coordinates;

          return {
            display: `${properties.name ? properties.name + ", " : ""}${
              properties.street ? properties.street + ", " : ""
            }${properties.city ? properties.city + ", " : ""}${
              properties.country ? properties.country : ""
            }`,
            coords, // [longitude, latitude]
          };
        });
      return suggestions;
    } catch (error) {
      console.log(error);
    }
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
        onValidationChange={(value) =>
          handleValidateChange("countryCode", value)
        }
      >
        {countriesData.map((country) => (
          <option value={country.code} key={country.code}>
            {country.name}
          </option>
        ))}
      </Select>

      <Autocomplete
        type="text"
        name="address"
        value={formData.location.address}
        getDisplayValue={(item) => item.display}
        onSelection={(selected) => {
          setFormData({
            ...formData,
            location: {
              ...formData.location,
              address: selected?.display || "",
              longitude: selected?.longitude || null,
              latitude: selected?.latitude || null,
            },
          });
        }}
        onChange = {(e)=>{setFormData({...formData, location: {
          ...formData.location,
          address: e.target.value} })}}
        fetchData={fetchAddressSuggestions}
        placeholder="Address (optional) eg: "
        validationRules={{ required: false }}
        onValidationChange={(value) => handleValidateChange("address", value)}
      />
      <Button styleName={'geolocation-btn'} variant={"primary"} onClick={handleGetLocation} icon>
     <FaLocationCrosshairs/> {isSmallScreen && 'Use My GeoLocation' }
      </Button>
    </>
  );
};

export default AddressStep;
