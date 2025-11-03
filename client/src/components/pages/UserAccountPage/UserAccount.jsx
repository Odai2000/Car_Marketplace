import "./UserAccount.css";
import Button from "../../UI/Button/Button";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import DefaultProfile from "../../UI/Utility/DefaultProfile/DefaultProfile";
import useAuthFetch from "../../../hooks/useAuthFetch";
import Post from "../../Post/Post";
import useConfig from "../../../hooks/useConfig";
import useProfileImageUpload from "../../../hooks/useProfileImageUpload";
import { useRef } from "react";

const UserAccount = () => {
  const [userData, setUserData] = useState(null);

  const [email, setEmail] = useState(null);
  const [emailVert, setEmailVert] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [articles, setArticles] = useState([]);

  const { auth } = useAuth();
  const { config } = useConfig();
  const { _id } = useParams();
  const authFetch = useAuthFetch();
  const location = useLocation();

  const profileImageUploader = useProfileImageUpload(auth?.userData?._id, true);

  const imageInput = useRef();

  const loadData = async () => {
    try {
      if (location.pathname === "/me") {
        // use user data from auth
        if (auth.userData) {
          setUserData({
            firstName: auth.userData?.firstName,
            lastName: auth.userData?.lastName,
            username: auth?.userData?.username,
            emailVert: auth?.userData?.emailVert,
            user_id: auth?.userData?._id,
          });
        }
      } else if (_id) {
        //  fetch user data by id
        await fetch(`${config.serverURL}/user/${_id}`)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            setUserData({
              firstName: data?.firstName,
              lastName: data?.lastName,
              username: data?.username,
              emailVert: data?.emailVert,
              user_id: data?._id,
              profileImageUrl: data?.profileImageUrl,
            });
          });
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [auth, location.pathname]);

  useEffect(() => {
    const user_id = userData?.user_id;
    if (!user_id) return;

    if (activeTab === "posts" && !posts?.length) {
      fetch(`${config.serverURL}/post/user/${user_id}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setPosts(data);
        });
    } else if (activeTab === "saved-posts" && !savedPosts?.length) {
      authFetch(`${config.serverURL}/user/me/saved-posts`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setSavedPosts(data.savedPosts);
        });
    }
  }, [activeTab, userData]);

  return (
    <>
      <div className="UserAccount">
        <div className="user-header">
          <div className="profile-image">
            {auth && auth?.userData?._id === userData?._id ? (
              <div
                className="edit-pfp-btn"
                onClick={() => {
                  imageInput.current.click();
                }}
              >
                edit
              </div>
            ) : (
              ""
            )}
            {auth?.userData?.profileImageUrl ? (
              <img src={auth?.userData?.profileImageUrl} />
            ) : (
              <DefaultProfile size="md" />
            )}
          </div>
          <div className="user-info">
            <div className="name">{`${userData?.firstName} ${userData?.lastName}`}</div>
            <div className="username">@{userData?.username}</div>

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

        <div className="account-content card flex-col">
          <div className="tabs">
            <div
              className={`tab ${activeTab === "posts" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("posts");
              }}
            >
              Posts
            </div>
            {location.pathname === "/me" ? (
              <div
                className={`tab ${activeTab === "saved-posts" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("saved-posts");
                }}
              >
                Saved Posts
              </div>
            ) : (
              ""
            )}
            <div
              className={`tab ${activeTab === "articles" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("articles");
              }}
            >
              Articles
            </div>
          </div>
        </div>
        <div className="content">
          {activeTab === "posts" &&
            posts?.map((post) => <Post key={post._id} data={post} />)}
          {activeTab === "saved-posts" &&
            savedPosts?.map((post) => <Post key={post._id} data={post} />)}
        </div>
        <input
          type="file"
          ref={imageInput}
          onChange={profileImageUploader.handleChange}
          hidden
          accept={profileImageUploader.acceptString}
        />
      </div>
    </>
  );
};

export default UserAccount;
