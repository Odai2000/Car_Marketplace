import { useEffect, useState } from "react";
import Button from "../../UI/Button/Button";
import "./UserSettings.css";
import Input from "../../UI/FormControls/Input";
import useAuth from "../../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import {
  FaAddressCard,
  FaArrowRightFromBracket,
  FaGear,
  FaUser,
} from "react-icons/fa6";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const UserSettings = () => {
  const [view, setView] = useState("profile");
  // const [userData, setUserData] = useState({});

  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    await fetch(`${serverUrl}/user`, {
      method: "PATCH",
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${auth.accessToken}`,
      },
      body: JSON.stringify({
        _id: auth.userData._id,
        firstName: firstName,
        lastName: lastName,
        password: password,
        email: email,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setAuth((prev) => ({
          ...prev,
          userData: data.updatedUser,
        }));
        // navigate("/me");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    await fetch(`${serverUrl}/me/change-password`, {
      method: "PATCH",
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${auth.accessToken}`,
      },
      body: JSON.stringify({
        password: password,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      }),
    })
      .then((response) => {
        if (response.ok) {
          navigate("/me/settings");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleAccountDelete = async (e) => {
    e.preventDefault();
    await fetch(`${serverUrl}/user`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${auth.accessToken}`,
        
      },
      body: JSON.stringify({
        _id: auth.userData._id,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .catch((error) => {
        console.log(error);
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
              styleName={`tab ${view === "profile" ? "active" : ""}`}
              variant="primary round"
              onClick={() => {
                setView("profile");
              }}
            >
              <FaUser /> Profile
            </Button>
            <Button
              styleName={`tab ${
                view === "personalInformation" ? "active" : ""
              }`}
              onClick={() => {
                setView("personalInformation");
              }}
              variant="primary round"
            >
              <FaAddressCard /> Personal Information
            </Button>
            <Button
              styleName={`tab ${view === "perferences" ? "active" : ""}`}
              onClick={() => {
                setView("perferences");
              }}
              variant="primary round"
            >
              <FaGear /> Perferences
            </Button>
          </div>

          <div className="footer flex">
            <div className="profile-container flex">
              <div className="profile-image">
                <div className="default-profile-image">
                  <FaUser style={{ color: "#fff" }} />
                </div>
              </div>
              <div className="name">{firstName + " " + lastName}</div>
            </div>
            <div className="logout-icon">
              <FaArrowRightFromBracket />
            </div>
          </div>
        </div>
        <div className="config-panel">
          {view === "profile" ? (
            <div className="view profile-config">
              <Button
                onClick={() => {
                  setView("changePassword");
                }}
              >
                Change password
              </Button>
              <Button variant="primary" onClick={handleAccountDelete} destructive>
                Delete Account
              </Button>
            </div>
          ) : (
            ""
          )}

          {view === "personalInformation" ? (
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

          {view === "changePassword" ? (
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
    </>
  );
};

export default UserSettings;
