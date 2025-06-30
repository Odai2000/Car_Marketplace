import { useEffect, useRef } from "react";
import Button from "../../../UI/Button/Button";
import ImageManager from "../../../UI/ImagesManager/ImageManager";

const CarPhotosStep = ({
  formData,
  setFormData,
  setControlsValidity,
  isSmallScreen,
  imageStates,
  setImageStates,
}) => {
  const imageInput = useRef();

  const handleImageInput = () => {
    imageInput.current.click();
  };

  const acceptString = "image/jpeg, image/png, image/webp";

  useEffect(() => {
    // setControlsValidity({ images: !!formData?.images });
  }, []);

  return (
    <>
      <div className="m-post-img">
        <input
          ref={imageInput}
          type="file"
          accept={acceptString}
          multiple
          onChange={(states) => {
            setImageStates((prev) => ({
              ...prev,
              ...states,
              toRemove: [...new Set([...prev.toRemove, ...(states.toRemove || [])])], // prevent overriding or duplication by child
            }));
          }}
          style={{ display: "none" }}
        />
        <Button type="button" variant="primary" onClick={handleImageInput}>
          Add Image
        </Button>
        <span># images added</span>
      </div>

      {!isSmallScreen && (
        <ImageManager
          accept={acceptString}
          maxFiles={20}
          maxSize={3 * 1024 * 1024}
          files={imageStates?.files}
          imageObjects={imageStates?.existing.filter(
            (item) => !imageStates?.toRemove?.includes(item.imageId)
          )}
          onChange={(states) => {
            setImageStates((prev) => ({
              ...prev,
              ...states,
              toRemove: [...new Set([...prev.toRemove, ...(states.toRemove || [])])], // prevent overriding or duplication by child
            }));
          }}
        />
      )}
    </>
  );
};

export default CarPhotosStep;
