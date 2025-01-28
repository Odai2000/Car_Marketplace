import { useEffect, useState } from "react";
import Button from "../../UI/Button/Button";
import "./UserSettings.css";
import Input from "../../UI/FormControls/Input";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import {
  FaAddressCard,
  FaArrowRightFromBracket,
  FaGear,
  FaUser,
} from "react-icons/fa6";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const UserSettings = () => {
  const [view, setView] = useState("profile");
  // const [view, setView] = useState("personalInformation");
  const [userData, setUserData] = useState("personalInformation");

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);

  const { auth } = useAuth();
  const update = async () => {
    await fetch(`${serverUrl}/user/update`, {
      method: "PATCH",
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${auth.accessToken}`,
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        password: password,
        email: email,
      }).then((response) => {
        if (response.ok) navigate("/me");
      }),
    });
  };

  useEffect(() => {
    fetch(`${serverUrl}/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.accessToken}`,
      },
    }).then((response) => {
      response
        .json()
        .then((data) => {
          setUserData(data);
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    });
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
              <div className="name">
                {userData.firstName + " " + userData.lastName}
              </div>
            </div>
            <div className="logout-icon">
              <FaArrowRightFromBracket />
            </div>
          </div>
        </div>
        <div className="config-panel">
          {view === "profile" ? (
            <div className="view profile-config">
              <Button>Verify Email</Button>
              <Button>Change password</Button>
              <Button variant="primary" destructive>
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
                  value={userData.firstName}
                  // onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter First name"
                >
                  {firstName}
                </Input>
                <Input
                  label="Last Name"
                  name="lastName"
                  value={userData.lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter Last name"
                />
                <Input
                  label="Email"
                  name="email"
                  value={userData.email}
                  onChange={(e) => setEmail(e.target.email)}
                  placeholder="Enter email"
                />
                {/* <Input
                label="Mobile Number"
                name="mobileNo"
                placeholder="Enter mobile number"
              /> */}
                <div className="save-btn-container" onClick={""}>
                  <Button variant="primary" onClick={update}>Save</Button>
                </div>
              </form>
              <div className="delete-btn-container">
                <Button variant="primary" destructive>
                  Delete Account
                </Button>
              </div>
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
