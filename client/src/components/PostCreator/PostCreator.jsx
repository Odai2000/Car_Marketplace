import "./PostCreator.css";
import Input from "../UI/FormControls/Input";
import Select from "../UI/FormControls/select";
import Button from "../UI/Button/Button";

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
            styleName="col-2"
          />

          <select name="make" placeholder="Select Make"></select>

          <select name="model"></select>

          <Select name="body">
            <option value="coupe">Coupe</option>
          </Select>

          <Select name="year" options={yearsOptions} />

          <select name="engine"></select>

          <select name="Transmisson">
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>

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
