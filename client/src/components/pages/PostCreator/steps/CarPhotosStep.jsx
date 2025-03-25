import { useRef } from "react";
import Button from "../../../UI/Button/Button";

const CarPhotosStep = ({ formData, setFormData, isSmallScreen }) => {
  const imageInput = useRef();
  const handleImageInput = () => {
    imageInput.current.click();
  };
  return (
    <>
      <div className="form-group post-img">
        <Button type="button" variant="primary" onClick={handleImageInput}>
          Add Image
        </Button>
      </div>
      <div className="m-post-img">
        <input
          ref={imageInput}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const fileArray = Array.from(e.target.files);
            setFormData({ ...formData, 'images': fileArray });
          }}
          style={{ display: "none" }}
        />
        <Button type="button" variant="primary" onClick={handleImageInput}>
          Add Image
        </Button>
        <span># images added</span>
      </div>
    </>
  );
};

export default CarPhotosStep;
