import { useEffect, useState } from "react";
import Post from "../../../Post/Post";
const ReviewStep = ({ formData, setFormData,setControlsValidity, isSmallScreen }) => {
  const [previewURLs, setPreviewURLs] = useState([]);

  useEffect(()=>{  setControlsValidity({})},[])

  useEffect(() => {
    const urls = formData?.images?.map(file => URL.createObjectURL(file)) || [];
    setPreviewURLs(urls);

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [formData?.images]);
  
  return (
    <>
      <div className="post-review">
        <Post data={{ ...formData, imagesUrls: previewURLs }} />
      </div>
    </>
  );
};

export default ReviewStep;
