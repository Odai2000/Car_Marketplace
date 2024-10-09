import "./PostCreator.css";
import Input from "../../UI/FormControls/Input";
import Select from "../../UI/FormControls/select";
import Button from "../../UI/Button/Button";
import { useRef, useEffect, useState } from "react";
import useAppData from "../../../hooks/useAppData";

const PostCreator = () => {
  const { carSpecsData, loading } = useAppData()
  const [selectedMake, setSelectedMake] = useState({});

  const [title, setTitle] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [body, setBody] = useState("");
  const [year, setYear] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmisson, setTransmisson] = useState("Automatic");
  const [mileage, setMileage] = useState("");
  const [hp, setHp] = useState("");
  const [images, setImages] = useState([]);

  const [isSmallScreen, setIsSmallScreen] = useState(false);

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
    setMake(makeData.name);
    setSelectedMake(makeData);
  };

  const imageInput = useRef();
  const handleImageInput = () => {
    imageInput.current.click();
  };

  useEffect(() => {
    if (carSpecsData && carSpecsData.makes) {
      setSelectedMake(carSpecsData.makes[0]);
      setMake(carSpecsData.makes[0].name);
      setModel(carSpecsData.makes[0].models[0]);
    }
    if (carSpecsData && carSpecsData.bodyTypes) {
      setBody(carSpecsData.bodyTypes[0]);
    }
    if (carSpecsData && carSpecsData.fuelTypes) {
      setFuel(carSpecsData.fuelTypes[0]);
    }
    if (yearsOptions) {
      setYear(yearsOptions[0].value);
    }

  }, [carSpecsData]);


  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 700);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    createPost(
    );
  };

  const createPost = async (
  ) => {
    const car = {
      make: make,
      model: model,
      body: body,
      year: year,
      fuel: fuel,
      transmisson: transmisson,
      mileage: mileage,
      hp: hp,
      isNewCondition: true,
    };

    const formData = new FormData();
    formData.append("title", title);
    formData.append("car", JSON.stringify(car));
    formData.append("user", "65f0765f39d8cc57da67e25b");
    for (const image of images){
      formData.append("images",image)
    }
    formData.append("images",images)

    await fetch("http://localhost:8080/post", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .catch((error) => console.log(error));
  };

  if (loading) {
    console.log("loading");
    return <div>Loading.....</div>;
  }
  console.log(selectedMake);
  return (
    <div className="PostCreator">
      <form onSubmit={handleSubmit} className="PostCreator-form">
        <div className="form-header col-2">
          <h2>Create New Post</h2>
        </div>

        <div className="form-group post-img">
          <Button variant="primary" onClick={handleImageInput}>
            Add Image
          </Button>
        </div>

        <div className="form-group post-data">
          <Input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            styleName={!isSmallScreen ? "col-2" : ""}
          />

          <Select
            name="make"
            value={make}
            label="Make"
            onChange={(e) => {
              handleMakeChange(e.target.value);
            }}
            placeholder="Select Make"
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
            label="Model"
            onChange={(e) => setModel(e.target.value)}
          >
            {selectedMake?.models?.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </Select>

          <Select
            name="body"
            value={body}
            label="Body"
            onChange={(e) => setBody(e.target.value)}
          >
            {carSpecsData.bodyTypes.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </Select>

          <Select
            name="year"
            value={year}
            label="Register Year"
            onChange={(e) => setYear(e.target.value)}
            options={yearsOptions}
          />

          <Select
            name="fuel"
            value={fuel}
            label="Fuel"
            onChange={(e) => setFuel(e.target.value)}
          >
            {carSpecsData.fuelTypes.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </Select>

          <Select
            name="transmisson"
            value={transmisson}
            label="Transmisson"
            onChange={(e) => setTransmisson(e.target.value)}
          >
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </Select>

          <Input
            type="text"
            name="mileage"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder="mileage"
          />

          <Input
            type="text"
            name="hp"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            placeholder="hp"
          />

          <div className="m-post-img">
            <input
              ref={imageInput}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const fileArray = Array.from(e.target.files);
                setImages(fileArray);
              }}
              style={{ display: "none" }}
            />
            <Button type="button" variant="primary" onClick={handleImageInput}>
              Add Image
            </Button>
            <span># images added</span>
          </div>

          <div className="form-button">
            <Button type="submit" variant="primary">
              Post
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostCreator;
