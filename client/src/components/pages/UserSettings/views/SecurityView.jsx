import { useEffect, useState, useRef } from "react";
import Button from "../../../UI/Button/Button";
import Input from "../../../UI/FormControls/Input";
import useConfig from "../../../../hooks/useConfig";
import useAuth from "../../../../hooks/useAuth";
import useAuthFetch from "../../../../hooks/useAuthFetch";
import useToast from "../../../../hooks/useToast";
import useWindow from "../../../../hooks/useWindow";

const SecurityView = () => {
  const { config } = useConfig();
  const { auth, setAuth } = useAuth();
  const authFetch = useAuthFetch();
  const { showToast } = useToast();
  const { isSmallScreen } = useWindow();

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    await authFetch(`${config.serverURL}/me/change-password`, {
      method: "PATCH",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        showToast("Password changed.", "success");
      })
      .catch((error) => {
        console.log(error);
        showToast("Password change failed", "error");
      });
  };

  return (
    <div className="view security-view">
      <div className="container change-password">
        <h2>Change password</h2>
        <form className="change-password-form">
          <Input
            label="Current Password"
            name="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            validationRules={{ required: true, minLength: 8 }}
          />
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password..."
            validationRules={{ required: true, minLength: 8 }}
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="confirm password..."
            validationRules={{ required: true, minLength: 8 }}
          />

          <div className="change-btn-container">
            <Button variant="primary" onClick={handlePasswordChange}>
              Change
            </Button>
          </div>
        </form>
      </div>

     </div>
  );
};

export default SecurityView;
