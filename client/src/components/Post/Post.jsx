import "./Post.css";
import Button from "../UI/Button/Button";
import Carousel from "../UI/Carousel/Carousel";
import {
  FaCamera,
  FaPhone,
  FaMessage,
  FaLocationDot,
  FaEllipsisVertical,
} from "react-icons/fa6";
import {
  PiCarSimpleThin,
  PiRoadHorizonThin,
  PiCalendarBlankThin,
  PiGasPumpThin,
  PiEngineThin,
  PiGearThin,
  PiMapPinThin
} from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import useMap from "../../hooks/useMap";
import PropTypes from "prop-types";
import useAuth from "../../hooks/useAuth";
import { IconContext } from "react-icons";
import Dropdown from "../UI/Dropdown/Dropdown";
import useAuthFetch from "../../hooks/useAuthFetch";
import useToast from "../../hooks/useToast";
import useConfig from "../../hooks/useConfig";
import { useState } from "react";
import PostSkeleton from "../UI/skeletons/PostSkeleton/PostSkeleton";

const Post = ({ data = null }) => {
  const [isDragging, setIsDragging] = useState(false);

  const navigate = useNavigate();
  const { getMapURL } = useMap();
  const { auth, setAuth } = useAuth();
  const authFetch = useAuthFetch();
  const { showToast } = useToast();
  const { config } = useConfig();

  const isOwner = auth?.userData?._id === data.user_id;
  const isAdmin = auth?.roles?.includes("ADMIN");
  const isUser = auth?.roles?.includes("USER");
  const isSaved = auth?.userData?.savedPosts?.includes(data?._id);

  const handleMessage = () => {
    navigate(`/chat/${data?.user_id}`);
  };

  const handleSave = async () => {
    try {
      await authFetch(
        `${config.serverURL}/user/${auth?.userData._id}/save-post`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: data?._id,
          }),
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setAuth({
            ...auth,
            userData: { ...auth?.userData, savedPosts: data?.savedPosts },
          });
        });
    } catch (error) {
      showToast("error", "Failed to save");

      console.error(error);
    }
  };

  const handleUnsave = async () => {
    try {
      await authFetch(
        `${config.serverURL}/user/${auth?.userData._id}/unsave-post`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: data?._id,
          }),
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setAuth({
            ...auth,
            userData: { ...auth?.userData, savedPosts: data?.savedPosts },
          });
        });
    } catch (error) {
      showToast("Failed to unsave", "error");
      console.error(error);
    }
  };
  const handleDelete = async () => {
    try {
      const response = await authFetch(
        `${config.serverURL}/post/${data?._id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) showToast("success", "Post deleted.");
    } catch (error) {
      showToast("error", "Failed to delete post");

      console.error(error);
    }
  };

  const handleMouseDown = () => setIsDragging(false);
  const handleMouseMove = () => setIsDragging(true);
  let images = data?.images;

  let defaultBlock = [
    <div key="0" className="no-image" alt="No Photos">
      <FaCamera style={{ height: "2em", width: "2em" }} /> No Photos
    </div>,
  ];
  const DropdownOpts = (
    <>
      {isOwner || isAdmin ? (
        <>
          <li>Archive</li>
          <li onClick={handleDelete}>Delete</li>
        </>
      ) : isUser ? (
        <>
          {isSaved ? (
            <li onClick={handleUnsave}>Unsave</li>
          ) : (
            <li onClick={handleSave}>Save</li>
          )}
          <li>Report</li>
        </>
      ) : null}
    </>
  );
  const handleNavigate = () => {
    if (!isDragging) navigate(`/post/${data?._id}`);
  };
  return (
    <div
      className="post"
      key={data?._id}
      onClick={handleNavigate}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <div className="post-img-container" onClick={(e) => e.stopPropagation()}>
        {images && images.length > 0 ? (
          <Carousel single counter>
            {images.map((image, index) => (
              <img
                key={index}
                src={`${image.imageURL}`}
                onClick={(e) => e.stopPropagation()}
              />
            ))}
          </Carousel>
        ) : (
          defaultBlock
        )}
      </div>

      {/* may change later to be post-body > post-details footer */}
      <div className="post-details">
        <IconContext.Provider
          value={{ color: "var(--primary)", size: "1.4rem" }}
        >
          <span className="post-title ">
            <h3>{data?.title}</h3>
          </span>
          <span className="post-price ">
            {(data?.price >= 0 && `$${data.price.toLocaleString()}`) || "$"}
          </span>

          <span className="car-name">
            {`${data?.car?.make || ""} ${data?.car?.model || ""}`}
          </span>
          <span>
            <PiCarSimpleThin /> <span>{data?.car?.bodyType}</span>
          </span>
          <span>
            <PiCalendarBlankThin /> <span>{data?.car?.year}</span>
          </span>
          <span>
            <PiRoadHorizonThin />
            <span>
              {data?.car?.mileage && `${data.car.mileage.toLocaleString()} km`}
            </span>
          </span>
          <span>
            <PiGasPumpThin /> <span>{data?.car?.fuel}</span>
          </span>
          <span>
            <PiEngineThin />
            <span>
              {data?.car?.hp && `${data.car.hp?.toLocaleString()} hp`}
            </span>
          </span>
          <span>
            <PiGearThin /> <span>{data?.car?.transmission}</span>
          </span>
        </IconContext.Provider>
        <span
          className="post-location"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <PiMapPinThin size="1.5rem"/>
          <span
            className="address"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {data?.location?.address &&
            data?.location?.longitude &&
            data?.location?.latitude ? (
              <a
                href={getMapURL({
                  longitude: data.location.longitude,
                  latitude: data.location.latitude,
                })}
              >
                {data.location.address}
              </a>
            ) : data?.location?.address ? (
              data.location.address
            ) : (
              data?.location?.countryCode
            )}
          </span>
        </span>

        <div className="post-footer  " onClick={(e) => e.stopPropagation()}>
          <div className="btn-group post-btn-group ">
            {isOwner ? (
              <Button
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/edit", { state: { postData: data } });
                }}
              >
                Edit
              </Button>
            ) : (
              <>
                <Button variant="primary">
                  <FaPhone /> Call
                </Button>
                <Button
                  variant="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMessage();
                  }}
                >
                  <FaMessage /> Message
                </Button>
              </>
            )}

            <Dropdown
              className="opts-btn"
              onClick={(e) => {
                e.stopPropagation();
              }}
              trigger={
                <Button styleName="opts-btn" variant="icon" onClick={() => {}}>
                  <div className="overlay">
                    <FaEllipsisVertical />
                  </div>
                </Button>
              }
            >
              <ul>{DropdownOpts} </ul>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

Post.skeleton = PostSkeleton

Post.skeletons= (count=12)=> ( [...Array(count)].map((_,i)=>(<PostSkeleton key={i}/>)))
Post.propTypes = {
  data: PropTypes.shape({
    user_id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(PropTypes.object),

    car: PropTypes.shape({
      make: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      bodyType: PropTypes.string.isRequired,
      fuel: PropTypes.string.isRequired,
      mileage: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      hp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    }),

    location: PropTypes.shape({
      countryCode: PropTypes.string.isRequired,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }).isRequired,
  }).isRequired,
};

Post.defaultProps = {
  data: {
    user_id: null,
    title: "",
    price: 0,
    images: [],

    car: {
      make: "",
      model: "",
      bodyType: "",
      fuel: "",
      mileage: "",
      hp: "",
      year: "",
      transmission: "",
    },

    location: {
      countyCode: "",
      latitude: null,
      longitude: null,
    },
  },
};
export default Post;
