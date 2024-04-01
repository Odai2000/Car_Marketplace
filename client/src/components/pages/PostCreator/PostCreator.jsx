import "./PostCreator.css";
import Input from "../../UI/FormControls/Input";
import Select from "../../UI/FormControls/select";
import Button from "../../UI/Button/Button";
import { useEffect, useState } from "react";

function PostCreator() {
  const fromYear = 1950;
  const toYear = 2025;
  const yearsOptions = Array.from(
    { length: toYear - fromYear + 1 },

    (x, y) => ({
      value: y + fromYear,
      label: y + fromYear,
    })
  );

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 700);
    };

    handleResize()

    window.addEventListener('resize',handleResize)

  },[]);

  return (
    <div className="PostCreator">
      <form className="PostCreator-form">
        <div className="form-header col-2">
          <h2>Create New Post</h2>
        </div>

        <div className="form-group post-img">
          <Button variant="primary">Add Image</Button>
        </div>

        <div className="form-group post-data">
          <Input
            type="text"
            name="Title"
            placeholder="Title"
            styleName={!isSmallScreen?"col-2":''}
          />

          <Select name="make" placeholder="Select Make"></Select>

          <Select name="model"></Select>

          <Select name="body">
            <option value="coupe">Coupe</option>
          </Select>

          <Select name="year" options={yearsOptions} />

          <Select name="engine"></Select>

          <Select name="Transmisson">
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </Select>

          <Input type="text" name="mileage" placeholder="mileage" />

          <Input type="text" name="hp" placeholder="hp" />
          <div className="form-button">
            <Button variant="primary">Post</Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PostCreator;
