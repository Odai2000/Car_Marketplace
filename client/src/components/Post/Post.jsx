import "./Post.css";
import { useRef } from "react";
import Button from "../UI/Button/Button";
import Carousel from "../UI/Carousel/Carousel";
import { FaCamera } from "react-icons/fa6";
import { FaCar } from "react-icons/fa6";
import { FaCalendar } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { FaMessage } from "react-icons/fa6";

const Post = () => {
  let items = ["1st","2nd","3th","4th"]
  return (
    <div className="post ">
      <div className="post-img">
        <Carousel single items={items}>
        </Carousel>
      </div>

      <div className="post-details">
        <h3 className="post-title col-4">Title</h3>

        <span className="post-price col-4">$$$</span>

        <span>
          <FaCar /> Make
        </span>
        <span>Model</span>
        <span>
          <FaCalendar /> 2010
        </span>
        <span>Engine</span>
        <span>Transmission</span>
        <span>Mileage</span>
        <span>HP</span>
        <span className="post-location col-2">City,Co</span>
        <Button variant="primary">
          <FaPhone /> Call
        </Button>
        <Button variant="primary">
          <FaMessage /> Message
        </Button>
      </div>
    </div>
  );
};

export default Post;
