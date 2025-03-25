
import Post from "../../../Post/Post"
const ReviewStep = ({ formData, setFormData, isSmallScreen }) => {
  return (
    <>
    <div className="post-review"><Post data={formData}/></div>
      
    </>
  );
};

export default ReviewStep;
