import { useEffect, useRef } from "react";
import Button from "../../../UI/Button/Button";
import DragAndDrop from "../../../UI/FormControls/DragAndDropFileUploader/DragAndDropFileUploader";

const CarPhotosStep = ({
  formData,
  setFormData,
  setControlsValidity,
  isSmallScreen,
}) => {
  const imageInput = useRef();
  const handleImageInput = () => {
    imageInput.current.click();
  };

  const acceptString = "image/jpeg, image/png, image/webp";

  useEffect(() => {
    setControlsValidity({ images: !!formData?.images });
  }, []);
  
  return (
    <>
      <div className="m-post-img">
        <input
          ref={imageInput}
          type="file"
          accept={acceptString}
          multiple
          onChange={(e) => {
            const fileArray = Array.from(e.target.files);
            setFormData({ ...formData, images: fileArray });
          }}
          style={{ display: "none" }}
        />
        <Button type="button" variant="primary" onClick={handleImageInput}>
          Add Image
        </Button>
        <span># images added</span>
      </div>

      {!isSmallScreen && (
        <DragAndDrop
          accept={acceptString}
          onChange={(fileArray) => {
            setFormData({ ...formData, images: fileArray });
          }}
          maxFiles={20}
          maxSize={3 * 1024 * 1024}
          value={formData?.images}
          onClick={handleImageInput}
        />
      )}
    </>
  );
};

export default CarPhotosStep;
