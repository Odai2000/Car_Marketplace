/* eslint-disable react/prop-types */
import "./Carousel.css";
import { Children, useRef, useState } from "react";
import Button from "../Button/Button";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import useConfig from "../../../hooks/useConfig";

const Carousel = ({
  single,
  counter,
  gap = "0",
  thumbnails,
  children,
  ...props
}) => {
  const [index, setIndex] = useState(0);
  const ref = useRef(null);
  const { config } = useConfig;

  const previous = () => {
    setIndex(index > 0 ? index - 1 : index);
    ref.current.scrollBy({
      left: -ref.current.clientWidth,
      behavior: "smooth",
    });
  };

  const next = () => {
    const length = Children.count(children);
    setIndex(index < length - 1 ? index + 1 : index);
    ref.current.scrollBy({
      left: ref.current.clientWidth,
      behavior: "smooth",
    });
  };

  let count = 0;

  return (
    <div className="Carousel">
      <div
        className={`carousel-container ${single || thumbnails ? "single" : ""}`}
      >
        <Button styleName="carousel-btn" onClick={previous}>
          <FaAngleLeft />
        </Button>
        <div
          className={`items ${single || thumbnails ? "single" : ""} `}
          ref={ref}
          style={{ gap: gap }}
        >
          {Children.map(children, (child) => (
            <div key={count++} className="carousel-item">
              {child}
            </div>
          ))}

          {counter && (
            <div className="counter">
              {index + 1}/{Children.count(children)}
            </div>
          )}
        </div>
        <Button styleName="carousel-btn" style={{ right: 0 }} onClick={next}>
          <FaAngleRight />
        </Button>
      </div>

      {/* thumbnails strip for photos preview  WIP*/}
      {/* {thumbnails && (
        <div className="thumbnails">
          {Children.map(children, (child) => (
            <div
              key={count++}
              className={`thumbnail ${index === count} active`}
              onClick={() => {
                setIndex(count);
              }}
            >
              {child}
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default Carousel;
