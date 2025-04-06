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
import { PiEngineFill } from "react-icons/pi";
import { TbManualGearbox } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import useMap from "../../hooks/useMap";
import PropTypes from "prop-types";

const Post = ({ data }) => {
  const navigate = useNavigate();
  const { getMapURL } = useMap();

  const handleMessage = () => {
    navigate(`/chat/${data?.user}`);
  };

  let imageUrls = data?.imagesUrls;

  let defaultBlock = [
    <div key="0" className="no-image" alt="No Photos">
      <FaCamera style={{ height: "2em", width: "2em" }} /> No Photos
    </div>,
  ];

  return (
    <div className="post" key={data?._id}>
      <div className="post-img-container">
        {imageUrls && imageUrls.length > 0 ? (
          <Carousel single counter>
            {imageUrls.map((url, index) => (
              <img key={index} src={url} />
            ))}
          </Carousel>
        ) : (
          defaultBlock
        )}
      </div>

      <div className="post-details">
        <span className="post-title ">
          <h3>{data?.title}</h3>
        </span>

        <span className="post-price ">
          {data?.price >= 0 && `$${data.price.toLocaleString()}`}
        </span>

        <span className="car-name">
          {`${data?.car?.make || ""} ${data?.car?.model || ""}`}
        </span>

        <span>
          <FaCar /> {data?.car?.bodyType}
        </span>
        <span>
          <FaCalendar /> {data?.car?.year}
        </span>
        <span>
          <FaRoad />{" "}
          {data?.car?.mileage && `${data.car.mileage.toLocaleString()} km`}
        </span>
        <span>
          <FaGasPump /> {data?.car?.fuel}
        </span>
        <span>
          <PiEngineFill />{" "}
          {data?.car?.hp && `${data.car.hp.toLocaleString()} hp`}
        </span>
        <span>
          <TbManualGearbox /> {data?.car?.transmission}
        </span>
        <span className="post-location ">
          {data?.location?.longitude && data?.location?.latitude ? (
            <>
              {" "}
              <FaLocationDot />
              <a
                href={getMapURL({
                  longitude: data.location.longitude,
                  latitude: data.location.latitude,
                })}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data?.location?.address}
              </a>{" "}
            </>
          ) : (
            data?.location?.address
          )}
        </span>
        <div className="post-footer ">
          <div className="btn-group post-btn-group ">
            <Button variant="primary">
              <FaPhone /> Call
            </Button>
            <Button variant="primary" onClick={handleMessage}>
              <FaMessage /> Message
            </Button>
          </div>
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
    imageIds: PropTypes.arrayOf(PropTypes.string),

    car: PropTypes.shape({
      make: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      bodyType: PropTypes.string.isRequired,
      fuel: PropTypes.string.isRequired,
      mileage: PropTypes.number.isRequired,
      hp: PropTypes.number.isRequired,
    }).isRequired,

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
    imageIds: [],

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
      countyCode: null,
      latitude: null,
      longitude: null,
    },
  },
};
export default Post;
