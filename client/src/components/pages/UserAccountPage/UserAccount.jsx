import { FaUser } from "react-icons/fa6";
import Button from "../../UI/Button/Button";
import "./UserAccount.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import DefaultProfile from "../../UI/Utility/DefaultProfile/DefaultProfile";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const UserAccount = () => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const [emailVert, setEmailVert] = useState(null);

  const { auth } = useAuth();
  const navigate = useNavigate;

  useEffect(() => {
    setFirstName(auth.userData.firstName);
    setLastName(auth.userData.lastName);
    setUsername(auth.userData.username);
    setEmail(auth.userData.email);
    setEmailVert(auth.userData.emailVert);
  }, [auth]);

  const location = useLocation();

  return (
    <>
      <div className="UserAccount">
        <div className="user-header">
          <div className="profile-image">
            <DefaultProfile size="max(5rem, 8vw)" />
          </div>
          <div className="user-info">
            <div className="name">{`${firstName} ${lastName}`}</div>
            <div className="username">@{username}</div>

            {location.pathname === "/me" ? (
              <Link to="/me/settings">
                <Button styleName="edit-user-btn" variant="primary">
                  Edit details
                </Button>
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>

        {location.pathname === "/me" ? (
          <>
            <div className="tabs">
              <div className="tab">Posts</div>
              <div className="tab">Fav Posts</div>
              <div className="tab">Articles</div>
            </div>

            <div className="card">
              <h3>Things to do</h3>
              <ul>
                <li>Verify ur email</li>
                <li>Verify ur email</li>
                <li>Verify ur email</li>
              </ul>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default UserAccount;
