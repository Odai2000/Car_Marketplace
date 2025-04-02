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
} from "react-icons/fa6";
import { PiEngineFill } from "react-icons/pi";
import { TbManualGearbox } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import useMap from "../../hooks/useMap";

const Post = ({ data }) => {
  const navigate = useNavigate();
  const { getMapURL } = useMap();

  const handleMessage = () => {
    navigate(`/chat/${data?.user}`);
  };

  let imageUrls = data?.imagesUrls;

  let defaultBlock = [
    <div key="0" className="no-image" alt="No Photos" onClick={handleMessage}>
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
        <h3 className="post-title ">{data?.title}</h3>

        <span className="post-price ">{data ? "$" + data.price : ""}</span>

        <span className="car-name">
          {data?.car?.make + " " + data?.car?.model}
        </span>

        <span>
          <FaCar /> {data?.car?.bodyType}
        </span>
        <span>
          <FaCalendar /> {data?.car?.year}
        </span>
        <span>
          <FaRoad /> {data?.car?.mileage + " km"}
        </span>
        <span>
          <FaGasPump /> {data?.car?.fuel}
        </span>
        <span>
          <PiEngineFill /> {data?.car?.hp + " " + "hp"}
        </span>
        <span>
          <TbManualGearbox /> {data?.car?.transmission}
        </span>

        <div className="post-footer ">
          <span className="post-location ">
            {data?.location.longitude && data?.location.latitude ? (
              <a
                href={getMapURL({
                  longitude: data.location.longitude,
                  latitude: data.location.latitude,
                })}
              >
                {data.location.address}
              </a>
            ) : (
              data?.location?.address
            )}
          </span>

          <div className="btn-group post-btn-group ">
            <Button variant="primary">
              <FaPhone /> Call
            </Button>
            <Button
              variant="primary"
              value={data?.user}
              onClick={handleMessage}
            >
              <FaMessage /> Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
