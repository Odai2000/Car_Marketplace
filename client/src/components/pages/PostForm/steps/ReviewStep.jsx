import { useEffect, useState } from "react";
import Post from "../../../Post/Post";
const ReviewStep = ({
  formData,
  setFormData,
  setControlsValidity,
  isSmallScreen,
  imageStates,
}) => {

  useEffect(() => {
    setControlsValidity({});
  }, []);


  return (
    <>
      <div className="post-review">
        <Post data={{ ...formData, images: imageStates?.previews }} />
      </div>
    </>
  );
};

export default ReviewStep;
