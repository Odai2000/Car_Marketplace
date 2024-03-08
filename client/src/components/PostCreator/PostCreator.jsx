import "./PostCreator.css"
import Input from "../UI/Input/Input";

function PostCreator() {
  return (
    <div className="PostCreator">
        <h2>Create New post</h2>
      <form className="">
        <Input type="text" name="Title" placeholder="Title" styleName="col-4" />
        <select type="text" name="make" placeholder="Select Make">
          Select Make
        </select>
        <select type="text" name="model">
          Select Model
        </select>
        <select type="text" name="body">
          Select Body Type
        </select>
        <select type="text" name="year">
          Select Year
        </select>
        <select type="text" name="engine">
          Select Engine type
        </select>
        <select type="" name="Transmisson">
          Select Engine type
        </select>
        <Input type="text" name="mileage" placeholder="mileage" />
        <Input type="text" name="hp" placeholder="hp" />
      </form>
    </div>
  );
}

export default PostCreator;
