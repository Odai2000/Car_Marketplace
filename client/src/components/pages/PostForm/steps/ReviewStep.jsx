import { useEffect, useState } from "react";
import Post from "../../../Post/Post";
const ReviewStep = ({
  formData,
  setFormData,
  setControlsValidity,
  isSmallScreen,
}) => {
  const [imageObjects, setImageObjects] = useState([]);

  useEffect(() => {
    setControlsValidity({});
  }, []);

  useEffect(() => {
    // would execute only when creating
    if (formData?.images?.length > 0 && !formData.images[0].imageURL) {
      setImageObjects(
        formData?.images.map((file) => {
          return {
            imageId: "",
            imageURL: URL.createObjectURL(file),
          };
        })
      );

      return () => {
        imageObjects?.forEach((obj) => URL.revokeObjectURL(obj.imageURL));
      };
    }
  }, [formData?.images]);

  return (
    <>
      <div className="post-review">
        <Post data={{ ...formData, images: imageObjects }} />
      </div>
    </>
  );
};

export default ReviewStep;
