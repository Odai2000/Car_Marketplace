import { useEffect, useRef, useState } from "react";
import Button from "../../UI/Button/Button";

import "./UserSettings.css";
import Input from "../../UI/FormControls/Input";
import useToast from "../../../hooks/useToast";
import useAuth from "../../../hooks/useAuth";
import useConfig from "../../../hooks/useConfig";
import { Link, useNavigate } from "react-router-dom";
import {
  FaAddressCard,
  FaArrowRightFromBracket,
  FaGear,
  FaUser,
} from "react-icons/fa6";
import DefaultProfile from "../../UI/Utility/DefaultProfile/DefaultProfile";
import useAuthFetch from "../../../hooks/useAuthFetch";
import useProfileImageUpload from "../../../hooks/useProfileImageUpload";

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { auth, setAuth, logout } = useAuth();
  const { config } = useConfig();

  const imageInput = useRef();

  const { showToast } = useToast();
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const profileImageUploader = useProfileImageUpload(auth?.userData?._id, true);

  const handleSave = async (e) => {
    e.preventDefault();
    await authFetch(`${config.serverURL}/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: auth.userData._id,
        firstName: firstName,
        lastName: lastName,
        email: email,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((data) => {
        setAuth((prev) => ({
          ...prev,
          userData: data.userData,
        }));
        showToast("Changes saved.", "success");
        // navigate("/me");
      })
      .catch((error) => {
        console.log(error);
        showToast("Failed to save changes.", "error");
      });
  };

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
        navigate("/me/settings");
        showToast("Password changed.", "success");
      })
      .catch((error) => {
        console.log(error);
        showToast("Password change failed", "error");
      });
  };

  const handleAccountDelete = async (e) => {
    e.preventDefault();
    await authFetch(`${config.serverURL}/user`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: auth.userData._id,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        showToast("Account deleted.", "success");
      })
      .catch((error) => {
        console.log(error);
        showToast("Failed to delete account", "error");
      });
  };

  useEffect(() => {
    setFirstName(auth.userData.firstName);
    setLastName(auth.userData.lastName);
    setUsername(auth.userData.username);
    setEmail(auth.userData.email);
  }, [auth]);

  return (
    <>
      <div className="UserSettings">
        <div className="sidebar">
          <div id="logo">
            <Link to="/">
              <img src="/src/assets/logo-white.svg" alt="logo" />
            </Link>
          </div>
          <div className="vertical-tabs">
            <Button
              styleName={`tab ${activeTab === "profile" ? "active" : ""}`}
              variant="primary round"
              onClick={() => {
                setActiveTab("profile");
              }}
            >
              <FaUser /> Profile
            </Button>
            <Button
              styleName={`tab ${
                activeTab === "personalInformation" ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab("personalInformation");
              }}
              variant="primary round"
            >
              <FaAddressCard /> Personal Information
            </Button>
            <Button
              styleName={`tab ${activeTab === "perferences" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("perferences");
              }}
              variant="primary round"
            >
              <FaGear /> Perferences
            </Button>
          </div>

          <div className="footer flex">
            <div className="profile-container flex">
              <div className="profile-image">
                {auth?.userData?.profileImageUrl ? (
                  <img
                    src={auth?.userData?.profileImageUrl}
                    alt="profile-image"
                  />
                ) : (
                  <DefaultProfile size="1em" />
                )}
              </div>
              <div className="name">{firstName + " " + lastName}</div>
            </div>
            <div className="logout-icon" onClick={logout}>
              <FaArrowRightFromBracket />
            </div>
          </div>
        </div>
        <div className="config-panel">
          {activeTab === "profile" ? (
            <div className="activeTab profile-config">
              <Button
                variant="secondary"
             onClick={() => {
    if (imageInput.current) {
      imageInput.current.value = '';
    }
    imageInput.current.click();
  }}
              >
                Change Profile Picture
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setActiveTab("changePassword");
                }}
              >
                Change password
              </Button>
              <Button
                variant="primary"
                onClick={handleAccountDelete}
                destructive
              >
                Delete Account
              </Button>
            </div>
          ) : (
            ""
          )}

          {activeTab === "personalInformation" ? (
            <div className="edit-account-info">
              <form>
                <Input
                  label="First Name"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter First name"
                  validationRules={{
                    required: true,
                    minLength: 2,
                    maxLength: 24,
                  }}
                ></Input>
                <Input
                  label="Last Name"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter Last name"
                  validationRules={{
                    required: true,
                    minLength: 2,
                    maxLength: 24,
                  }}
                />
                <Input
                  label="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  validationRules={{ required: true, email: true }}
                />
                {/* <Input
                label="Mobile Number"
                name="mobileNo"
                placeholder="Enter mobile number"
              /> */}
                <div className="save-btn-container">
                  <Button variant="primary" onClick={handleSave}>
                    Save
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            ""
          )}

          {activeTab === "changePassword" ? (
            <div className="change-password ">
              <h2>Change Password</h2>
              <form>
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
          ) : (
            ""
          )}
        </div>
      </div>

      <input
        type="file"
        ref={imageInput}
        onChange={profileImageUploader.handleChange}
        hidden
        accept={profileImageUploader.acceptString}
      />
    </>
  );
};

export default UserSettings;
