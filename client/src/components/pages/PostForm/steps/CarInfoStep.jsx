import { useCallback, useEffect, useState } from "react";
import useAppData from "../../../../hooks/useAppData";
import Input from "../../../UI/FormControls/Input";
import Select from "../../../UI/FormControls/Select";

const CarInfoStep = ({
  formData,
  setFormData,
  isSmallScreen,
  setControlsValidity,
  handleValidateChange,
}) => {
  const { carSpecsData, loadingCarSpecs } = useAppData();
  const [selectedMake, setSelectedMake] = useState({});

  useEffect(() => {
    setControlsValidity({
      make: !!formData.car.make,
      model: !!formData.car.model,
      bodyType: !!formData.car.bodyType,
      year: !!formData.car.year,
      fuel: !!formData.car.fuel,
      transmission: !!formData.car.transmission,
      mileage: !!formData.car.mileage,
      hp: !!formData.car.hp,
      condition: !!formData.car.hp,
    });

    if (formData.car.make && carSpecsData?.makes) {
      const make = carSpecsData.makes.find(
        (make) => make.name === formData.car.make
      );
      setSelectedMake(make || {});
    }
  }, []);

  const yearsOptions = ((fromYear = 1950, toYear = 2025) => {
    return Array.from({ length: toYear - fromYear + 1 }, (x, y) => ({
      value: toYear - y,
      label: toYear - y,
    }));
  })(); //notice: this is an array not a function

  const handleMakeChange = (e) => {
    console.log("e", e);
    const makeData = carSpecsData.makes.find((make) => {
      return make.name === e;
    });
    setSelectedMake(makeData);
    setFormData((prev) => ({
      ...prev,
      car: {
        ...prev.car,
        make: makeData?.name,
      },
    }));
  };

  if (loadingCarSpecs) {
    console.log("loadingCarSpecs");
    return <div>Loading.....</div>;
  }

  return (
    <>
      <Select
        name="make"
        value={formData.car.make}
        onChange={(e) => {
          handleMakeChange(e.target.value);
        }}
        defaultOption={{ label: "Select Make", value: "" }}
        validationRules={{ required: true }}
        onValidationChange={(value) => handleValidateChange("make", value)}
      >
        {carSpecsData.makes.map((make, index) => (
          <option key={index} value={make.name}>
            {make.name}
          </option>
        ))}
      </Select>

      <Select
        name="model"
        value={formData.car.model}
        defaultOption={{ label: "Select Model", value: "" }}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            car: { ...prev.car, [e.target.name]: e.target.value },
          }))
        }
        validationRules={{ required: true }}
        onValidationChange={(value) => handleValidateChange("model", value)}
      >
        {selectedMake?.models?.map((model, index) => (
          <option key={index} value={model}>
            {model}
          </option>
        ))}
      </Select>

      <Select
        name="bodyType"
        value={formData.car.bodyType}
        defaultOption={{ label: "Select body type", value: "" }}
        onChange={(e) =>
          setFormData({
            ...formData,
            car: { ...formData.car, [e.target.name]: e.target.value },
          })
        }
        validationRules={{ required: true }}
        onValidationChange={(value) => handleValidateChange("bodyType", value)}
      >
        {carSpecsData.bodyTypes.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </Select>

      <Select
        name="year"
        value={formData.car.year}
        defaultOption={{ label: "Select Year", value: "" }}
        onChange={(e) =>
          setFormData({
            ...formData,
            car: { ...formData.car, [e.target.name]: e.target.value },
          })
        }
        options={yearsOptions}
        validationRules={{ required: true }}
        onValidationChange={(value) => handleValidateChange("year", value)}
      />

      <Select
        name="fuel"
        value={formData.car.fuel}
        defaultOption={{ label: "Select Fuel", value: "" }}
        onChange={(e) =>
          setFormData({
            ...formData,
            car: { ...formData.car, [e.target.name]: e.target.value },
          })
        }
        validationRules={{ required: true }}
        onValidationChange={(value) => handleValidateChange("fuel", value)}
      >
        {carSpecsData.fuelTypes.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </Select>

      <Select
        name="transmission"
        value={formData.car.transmission}
        defaultOption={{ label: "Select Transmission", value: "" }}
        onChange={(e) =>
          setFormData({
            ...formData,
            car: { ...formData.car, [e.target.name]: e.target.value },
          })
        }
        validationRules={{ required: true }}
        onValidationChange={(value) =>
          handleValidateChange("transmission", value)
        }
      >
        <option value="Automatic">Automatic</option>
        <option value="Manual">Manual</option>
      </Select>
      <Select
        name="condition"
        value={formData.car.condition}
        defaultOption={{ label: "Select condition", value: "" }}
        onChange={(e) =>
          setFormData({
            ...formData,
            car: { ...formData.car, [e.target.name]: e.target.value },
          })
        }
        validationRules={{ required: true }}
        onValidationChange={(value) => handleValidateChange("condition", value)}
      >
        <option value="Excellent">Excellent</option>
        <option value="Good">Good</option>
        <option value="Fair">Fair</option>
        <option value="Salvage">Salvage</option>
      </Select>
      <Input
        type="text"
        name="mileage"
        value={formData.car.mileage}
        onChange={(e) =>
          setFormData({
            ...formData,
            car: { ...formData.car, [e.target.name]: e.target.value },
          })
        }
        validationRules={{ required: true, maxLength: 8, numeric: true }}
        placeholder="Mileage"
        onValidationChange={(value) => handleValidateChange("mileage", value)}
      />

      <Input
        type="text"
        name="hp"
        value={formData.car.hp}
        onChange={(e) =>
          setFormData({
            ...formData,
            car: { ...formData.car, [e.target.name]: e.target.value },
          })
        }
        placeholder="HP"
        validationRules={{ required: true, maxLength: 4, numeric: true }}
        onValidationChange={(value) => handleValidateChange("hp", value)}
      />
    </>
  );
};

export default CarInfoStep;
