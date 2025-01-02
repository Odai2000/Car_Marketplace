import "./PostCreator.css";
import Input from "../../UI/FormControls/Input";
import Select from "../../UI/FormControls/select";
import Button from "../../UI/Button/Button";
import { useRef, useEffect, useState } from "react";
import useAppData from "../../../hooks/useAppData";

const PostCreator = () => {
  const { carSpecsData, loading } = useAppData();
  const [selectedMake, setSelectedMake] = useState({});

  const [title, setTitle] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [body, setBody] = useState("");
  const [year, setYear] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("Automatic");
  const [mileage, setMileage] = useState("");
  const [hp, setHp] = useState("");
  const [price, setPrice] = useState("");
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
    setModel(carSpecsData.makes[0].models[0]);
  };

  const imageInput = useRef();
  const handleImageInput = () => {
    imageInput.current.click();
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 700);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    createPost();
  };

  const createPost = async () => {
    const car = {
      make: make,
      model: model,
      body: body,
      year: year,
      fuel: fuel,
      transmission: transmission,
      mileage: mileage,
      hp: hp,
      isNewCondition: true,
    };

    const formData = new FormData();
    formData.append("title", title);
    formData.append("car", JSON.stringify(car));
    formData.append("user", "65f0765f39d8cc57da67e25b");
    for (const image of images) {
      formData.append("images", image);
    }
    formData.append("images", images);

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
            validationRules={{ required: true, minLength: 2, maxLength: 80 }}
          />

          <Select
            name="make"
            value={make}
            onChange={(e) => {
              handleMakeChange(e.target.value);
            }}
            defaultOption={{ label: "Select Make", value: '' }}
            validationRules={{ required: true }}
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
            defaultOption={{ label: "Select Model", value: '' }}
            onChange={(e) => setModel(e.target.value)}
            validationRules={{ required: true }}
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
            defaultOption={{ label: "Select Body", value: '' }}
            onChange={(e) => setBody(e.target.value)}
            validationRules={{ required: true }}
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
            defaultOption={{ label: "Select Year", value: '' }}
            onChange={(e) => setYear(e.target.value)}
            options={yearsOptions}
            validationRules={{ required: true }}
          />

          <Select
            name="fuel"
            value={fuel}
            defaultOption={{ label: "Select Fuel", value: '' }}
            onChange={(e) => setFuel(e.target.value)}
            validationRules={{ required: true }}
          >
            {carSpecsData.fuelTypes.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </Select>

          <Select
            name="transmission"
            value={transmission}
            defaultOption={{ label: "Select Transmission", value: '' }}
            onChange={(e) => setTransmission(e.target.value)}
            validationRules={{ required: true }}
          >
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </Select>

          <Input
            type="text"
            name="mileage"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            validationRules={{ required: true, maxLength: 8,numeric: true }}
            placeholder="Mileage"
          />

          <Input
            type="text"
            name="hp"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            placeholder="HP"
            validationRules={{ required: true, maxLength: 4, numeric: true }}
          />

          <Input
            type="text"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            validationRules={{ required: true, maxLength: 9, numeric: true }}
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
