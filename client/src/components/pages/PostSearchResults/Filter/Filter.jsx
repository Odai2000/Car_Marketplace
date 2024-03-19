import Button from "../../../UI/Button/Button";
import Select from "../../../UI/FormControls/select";

function Filter() {
  return (
    <>
      <div className="Filter card">
        <h2>Filter</h2>
        <form>
          <Select name="make">
            <option>Make</option>
          </Select>
          <Select name="model">
            <option>Model</option>
          </Select>
          <Select name="year-from">
            <option>From Year</option>
          </Select>
          <Select name="year-to">
            <option>To Year</option>
          </Select>
          <Select name="type" styleName="col-2">
            Any
          </Select>
          <Select name="engine">Any</Select>
          <Select name="hp">0000</Select>
          <Select name="condition">Any</Select>
          <Select name="mileage">000000</Select>
          <Button variant="primary" styleName="col-2">
            Filter
          </Button>
        </form>
      </div>
    </>
  );
}

export default Filter;
