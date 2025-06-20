import "./PostCreator.css";
import Button from "../../UI/Button/Button";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";

import AddressStep from "./steps/AddressStep";
import BasicInfoStep from "./steps/BasicInfoStep";
import CarInfoStep from "./steps/CarInfoStep";
import CarPhotosStep from "./steps/CarPhotosStep";
import ReviewStep from "./steps/ReviewStep";
import useConfig from "../../../hooks/useConfig";
import { FaAngleRight } from "react-icons/fa6";
import useWindowSize from "../../../hooks/useWindow";
import { useLocation } from "react-router-dom";
import useAuthFetch from "../../../hooks/useAuthFetch";

const steps = [
  { component: CarInfoStep, name: "Car details" },
  { component: BasicInfoStep, name: "Basic information" },
  { component: AddressStep, name: "Address details" },
  { component: CarPhotosStep, name: "Photos" },
  { component: ReviewStep, name: "Review" },
];

const PostForm = ({ isUpdating = false }) => {
  const { auth } = useAuth();
  const authFetch = useAuthFetch();
  const { config } = useConfig();
  const location = useLocation();
  const postData = location?.state?.postData;
  const [stepIndex, setStepIndex] = useState(0);
  const [isStepValid, setIsStepValid] = useState();

  const [imageStates, setImageStates] = useState({
    files: [],
    toRemove: [],
    existing: postData?.images || [],
    previews: [],
  });

  const [formData, setFormData] = useState(
    postData || {
      title: "",
      car: {},
      price: '',
      location: {},
      images: [],
    }
  );

  const [controlsValidity, setControlsValidity] = useState({});
  const { isSmallScreen } = useWindowSize();

  useEffect(() => {
    const isValid = Object.values(controlsValidity).every(
      (valid) => valid === true
    );
    setIsStepValid(isValid);
  }, []);

  // useEffect(() => {
  //   setFormData((prev) => ({ ...prev, images: imageStates.files }));
  // }, [imageStates.files]);

  useEffect(() => {
    const isValid = Object.values(controlsValidity).every(
      (valid) => valid === true
    );
    setIsStepValid(isValid);
  }, [controlsValidity]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isUpdating) editPost();
    else createPost();
  };

  const nextStep = () => {
    setStepIndex(stepIndex + 1);
  };

  const backStep = () => {
    setStepIndex(stepIndex - 1);
  };

  const createPost = async () => {
    const formPayload = new FormData();
    formPayload.append(
      "data",
      JSON.stringify({
        title: formData.title,
        car: formData.car,
        price: formData.price,
        location: formData.location,
      })
    );

    imageStates.files.forEach((file) => {
      formPayload.append("images", file);
    });

    await authFetch(`${config.serverURL}/post`, {
      method: "POST",
      body: formPayload,
    })
      .then((response) => response.json())
      .catch((error) => console.log(error));
  };

  const editPost = async () => {
    const formPayload = new FormData();
    formPayload.append(
      "data",
      JSON.stringify({
        _id: postData?._id,
        imagesIdsToDelete: imageStates?.toRemove||[],
        title: formData.title,
        car: formData.car,
        price: formData.price,
        location: formData.location,

      })
    );

    imageStates.files.forEach((file) => {
      formPayload.append("images", file);
    });

    await authFetch(`${config.serverURL}/post`, {
      method: "PATCH",
      body: formPayload,
    })
      .then((response) => response.json())
      .catch((error) => console.log(error));
  };

  const CurrentStep = steps[stepIndex].component;

  const handleValidateChange = (field, isValid) => {
    setControlsValidity((prev) => ({ ...prev, [field]: !!isValid }));
  };

  return (
    <div className="PostCreator">
      <form className="PostCreator-form">
        <div className="form-header col-2">
          <h2>{`${isUpdating ? "Edit post" : "New post"}`}</h2>
        </div>

        <div className="form-subheader col-2">
          <h3>{steps[stepIndex].name}</h3>
        </div>

        {!isSmallScreen && (
          <div className="form-progress flex">
            {steps.map((step, index) => (
              <div
                className={`step-tab flex ${index == stepIndex && "active"} ${
                  index < stepIndex && "completed"
                }`}
                key={step.name}
                onClick={() => {
                  index <= stepIndex && setStepIndex(index);
                }}
              >
                {step.name}
                {index < steps.length - 1 && (
                  <div className="icon">
                    <FaAngleRight />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="form-group post-data">
          <CurrentStep
            formData={formData}
            setFormData={setFormData}
            isSmallScreen={isSmallScreen}
            setControlsValidity={setControlsValidity}
            handleValidateChange={handleValidateChange}
            setImageStates={setImageStates}
            imageStates={imageStates}
          />
        </div>

        <div className="btn-group">
          {stepIndex > 0 ? (
            <Button type="button" variant="primary" onClick={backStep}>
              Back
            </Button>
          ) : (
            ""
          )}
          {stepIndex < steps.length - 1 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={!isStepValid}
              variant="primary"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              variant="primary"
              disabled={!isStepValid}
            >
              {`${isUpdating ? "Save" : "Post"}`}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostForm;
