import "./Post.css";
import Button from "../UI/Button/Button";
import Carousel from "../UI/Carousel/Carousel";
import {
  FaCamera,
  FaCar,
  FaCalendar,
  FaRoad,
  FaPhone,
  FaMessage,
  FaGasPump,
  FaLocationDot,
} from "react-icons/fa6";
import { PiDotsThreeOutlineFill, PiEngineFill } from "react-icons/pi";
import { TbManualGearbox } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import useMap from "../../hooks/useMap";
import PropTypes from "prop-types";
import useAuth from "../../hooks/useAuth";
import { IconContext } from "react-icons";

const Post = ({ data = null }) => {
  const navigate = useNavigate();
  const { getMapURL } = useMap();
  const { auth } = useAuth();

  const handleMessage = () => {
    navigate(`/chat/${data?.user_id}`);
  };

  let images = data?.images;

  let defaultBlock = [
    <div key="0" className="no-image" alt="No Photos">
      <FaCamera style={{ height: "2em", width: "2em" }} /> No Photos
    </div>,
  ];

  return (
    <div className="post" key={data?._id}>
      <div className="post-img-container">
        {images && images.length > 0 ? (
          <Carousel single counter>
            {images.map((image, index) => (
              <img key={index} src={image.imageURL} />
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
            <FaCar /> <span>{data?.car?.bodyType}</span>
          </span>
          <span>
            <FaCalendar /> <span>{data?.car?.year}</span>
          </span>
          <span>
            <FaRoad />{" "}
            <span>
              {data?.car?.mileage && `${data.car.mileage.toLocaleString()} km`}
            </span>
          </span>
          <span>
            <FaGasPump /> <span>{data?.car?.fuel}</span>
          </span>
          <span>
            <PiEngineFill />{" "}
            <span>
              {data?.car?.hp && `${data.car.hp?.toLocaleString()} hp`}
            </span>
          </span>
          <span>
            <TbManualGearbox /> <span>{data?.car?.transmission}</span>
          </span>
        </IconContext.Provider>
        <span className="post-location">
          <FaLocationDot />
          <span className="address">
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

        <div className="post-footer ">
          <div className="btn-group post-btn-group ">
            {auth?.userData?._id === data.user_id ? (
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/edit", { state: { postData: data } });
                }}
              >
                Edit
              </Button>
            ) : (
              <>
                {" "}
                <Button variant="primary">
                  <FaPhone /> Call
                </Button>
                <Button variant="primary" onClick={handleMessage}>
                  <FaMessage /> Message
                </Button>
              </>
            )}
          </div>

          {/* <div className="post-opts-btn">
            <Button
              variant="icon"
              onClick={() => {
                navigate("/edit", { state: { postData: data } });
              }}
            >
              <PiDotsThreeOutlineFill />
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
};
Post.propTypes = {
  data: PropTypes.shape({
    user: PropTypes.string.isRequired,
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
      countyCode: PropTypes.string.isRequired,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }).isRequired,
  }).isRequired,
};

Post.defaultProps = {
  data: {
    user: "failedToGetUser",
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
