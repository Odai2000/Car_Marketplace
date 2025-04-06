import "./PostCreator.css";
import Button from "../../UI/Button/Button";
import {useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";

import AddressStep from "./steps/AddressStep";
import BasicInfoStep from "./steps/BasicInfoStep";
import CarInfoStep from "./steps/CarInfoStep";
import CarPhotosStep from "./steps/CarPhotosStep";
import ReviewStep from "./steps/ReviewStep";
import useConfig from "../../../hooks/useConfig";
import { FaAngleRight } from "react-icons/fa6";
import useWindowSize from "../../../hooks/useWindow";

const steps = [
  { component: CarInfoStep, name: "Car details" },
  { component: BasicInfoStep, name: "Basic information" },
  { component: AddressStep, name: "Address details" },
  { component: CarPhotosStep, name: "Photos" },
  { component: ReviewStep, name: "Review" },
];

const PostCreator = () => {
  const { auth } = useAuth();
  const { config } = useConfig();

  const [stepIndex, setStepIndex] = useState(0);
  const [isStepValid, setIsStepValid] = useState();

  const [formData, setFormData] = useState({
    title: "",
    car: {},
    price: 0,
    location: {},
    images: [],
    user: auth.userData._id,
  });

  const [controlsValidity, setControlsValidity] = useState({});
  const { isSmallScreen } = useWindowSize();

  useEffect(() => {
    const isValid = Object.values(controlsValidity).every(
      (valid) => valid === true
    );
    setIsStepValid(isValid);
  }, []);

  useEffect(() => {
    const isValid = Object.values(controlsValidity).every(
      (valid) => valid === true
    );
    setIsStepValid(isValid);
  }, [controlsValidity]);

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost();
  };

  const nextStep = () => {
    setStepIndex(stepIndex + 1);
  };

  const backStep = () => {
    setStepIndex(stepIndex - 1);
  };

  const createPost = async () => {
    await fetch(`${config.serverURL}/post`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .catch((error) => console.log(error));
  };

  const CurrentStep = steps[stepIndex].component;

  const handleValidateChange = (field, isValid) => {
    setControlsValidity((prev) => ({ ...prev, [field]: !!isValid }));
    console.log(field, isValid);
    console.log(isStepValid);
  }

  return (
    <div className="PostCreator">
      <form className="PostCreator-form">
        <div className="form-header col-2">
          <h2>Create New Post</h2>
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
              Post
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostCreator;
