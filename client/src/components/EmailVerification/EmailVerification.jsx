import { useEffect, useState } from "react";
import "./EmailVerification.css";
import { useParams, useLocation } from "react-router-dom";
import  useConfig  from "../../hooks/useConfig";

const EmailVerification = () => {
  const [isSuccess, setIsSuccess] = useState("");
  const { _id } = useParams();
  const location = useLocation();
  const { serverUrl } = useConfig();

  const verifyEmail = async () => {
    try {
      const query = new URLSearchParams(location.search);
      const token = decodeURIComponent(query.get('token'));
      
      const response = await fetch(`${serverUrl}/user/${_id}/verify-email`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token })
      });
      setIsSuccess(response.ok);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    verifyEmail();
  }, []);

  return (
    <>
      <div className="verify-email-container">
        {isSuccess ? <p>Email Verified</p> : <p>Invalid or expired link</p>}
      </div>
    </>
  );
};

export default EmailVerification;
