import { FaUser } from "react-icons/fa6";
import Button from "../../UI/Button/Button";
import Input from "../../UI/FormControls/Input";
import "./UserAccount.css";
import { Link, useLocation } from "react-router-dom";
import {  useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";


const serverUrl = import.meta.env.VITE_SERVER_URL;


const UserAccount = () => {
  const [userData, setUserData] = useState(null);
  
  const { auth } = useAuth();
  useEffect(() => {
    fetch(`${serverUrl}/user/me`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.accessToken}`
      }})
      .then((response) => {
        console.log(response)
        response.json()
        .then((data) => {
          setUserData(data);
          console.log("data",data)
        })   .catch((err) => {
          console.error("Error fetching user data:", err);
        });
      })
  }, [auth]);

  const location = useLocation();
  if(!userData) return 'loading...'
    
    return (
    <>
      <div className="UserAccount">
        <div className="user-header">
          <div className="profile-image">
            <div className="default-profile-image">
              <FaUser style={{ color: "#999" }} />
            </div>
          </div>
          <div className="user-info">
            <div className="name">{`${userData?.firstName} ${userData?.lastName}`}</div>
            <div className="username">{userData?.username}</div>

            {location.pathname === "/my-account" ? (
              <Link to="/my-account/edit">
                <Button styleName="edit-user-btn" variant="primary">
                  Edit details
                </Button>
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>

        {location.pathname === "/my-account" ? (
          <div className="tabs">
            <div className="tab">Posts</div>
            <div className="tab">Fav Posts</div>
            <div className="tab">Articles</div>
          </div>
        ) : (
          ""
        )}
        {location.pathname === "/my-account/edit" ? (
          <div className="edit-account-info">
            <form>
              <Input
                label="First Name"
                name="firstName"
                placeholder="Enter First name"
              />
              <Input
                label="Last Name"
                name="lastName"
                placeholder="Enter Last name"
              />
              <Input label="Email" name="email" placeholder="Enter email" />
              <Input
                label="Mobile Number"
                name="mobileNo"
                placeholder="Enter mobile number"
              />
              <div className="save-btn-container">
                <Button variant="primary">Save</Button>
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
    </>
  );
};

export default UserAccount;
