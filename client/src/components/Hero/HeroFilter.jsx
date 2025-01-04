import Button from "../UI/Button/Button";
import { FaAngleRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAppData from "../../hooks/useAppData";
import Select from "../UI/FormControls/select";

function HeroFilter() {
  const { carSpecsData, loading } = useAppData();
  const [selectedMake, setSelectedMake] = useState({});

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [yearMin, setYearMin] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [mileageMax, setMileageMax] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const navigate = useNavigate();

  const yearsOptions = ((fromYear = 1950, toYear = 2025) => {
    return Array.from({ length: toYear - fromYear + 1 }, (x, y) => ({
      value: toYear - y,
      label: toYear - y,
    }));
  })(); //notice: this is an array not a function

  const mileageOptions = ((fromMileage = 0, toMileage = 100000) => {
    return Array.from(
      { length: (toMileage - fromMileage) / 10000 + 1 },
      (x, y) => ({
        value: fromMileage + y * 10000,
        label: fromMileage + y * 10000 + " km",
      })
    );
  })(); //notice: this is an array not a function
  const bodyOptions = carSpecsData?.bodyTypes?.map((type) => ({
    value: type.toLowerCase(),
    label: type,
  }));
  const priceOptions = [
    { value: 1000, label: "$1000" },
    { value: 2000, label: "$2000" },
    { value: 4000, label: "$4000" },
    { value: 5000, label: "$5000" },
    { value: 8000, label: "$8000" },
    { value: 10000, label: "$10000" },
    { value: 15000, label: "$15000" },
    { value: 20000, label: "$20000" },
    { value: 30000, label: "$30000" },
    { value: 40000, label: "$40000" },
    { value: 50000, label: "$50000" },
    { value: 60000, label: "$60000" },
    { value: 70000, label: "$70000" },
    { value: 80000, label: "$80000" },
    { value: 90000, label: "$90000" },
    { value: 125000, label: "$125000" },
    { value: 150000, label: "$150000" },
    { value: 200000, label: "$200000" },
  ];

  const handleMakeChange = (e) => {
    console.log("e", e);

    const makeData = carSpecsData.makes.find((make) => {
      return make.name === e;
    });

    if (!makeData) setMake("");
    else {
      setMake(makeData.name);
      setModel("");
    }
    setSelectedMake(makeData);
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      make,
      model,
      yearMin,
      bodyType,
      mileageMax,
      priceMax,
    });

    navigate(`/posts?${query}`);
  };

  if (loading) {
    console.log("loading");
    return <div>Loading.....</div>;
  }
  return (
    <>
      <div className="herofilter-container form">
        <h1>Look for your next car now.</h1>
        <form onSubmit={handlesubmit}>
          <Select
            name="make"
            value={make}
            onChange={(e) => {
              handleMakeChange(e.target.value);
            }}
            defaultOption={{ label: "Make", value: "" }}
          >
            {carSpecsData.makes.map((make, index) => (
              <option key={index} value={make.name}>
                {make.name}
              </option>
            ))}
          </Select>
          <Select
            name="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            defaultOption={{ label: "Model", value: "" }}
          >
            {selectedMake?.models?.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </Select>
          <Select
            name="yearMin"
            value={yearMin}
            onChange={(e) => setYearMin(e.target.value)}
            options={yearsOptions}
            defaultOption={{ label: "Registered from", value: "" }}
          />
          <Select
            name="bodyType"
            value={bodyType}
            onChange={(e) => setBodyType(e.target.value)}
            options={bodyOptions}
            defaultOption={{ label: "Body type", value: "" }}
          ></Select>
          <Select
            name="mileageMax"
            value={mileageMax}
            onChange={(e) => setMileageMax(e.target.value)}
            options={mileageOptions}
            defaultOption={{ label: "Max mileage", value: "" }}
          />
          <Select
            name="priceMax"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            options={priceOptions}
            defaultOption={{ label: "Budget", value: "" }}
          />
          <Button variant="link" id="hero-advanced-btn">
            Advanced search
            <FaAngleRight />
          </Button>
          <Button id="hero-btn" variant="primary">
            Search
          </Button>
        </form>
      </div>
    </>
  );
}

export default HeroFilter;
