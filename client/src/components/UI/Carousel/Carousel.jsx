/* eslint-disable react/prop-types */
import "./Carousel.css";
import { Children, useRef, useState } from "react";
import Button from "../Button/Button";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

const Carousel = ({
  single,
  counter,
  gap = "0",
  thumbnails,
  children,
  scrollBy
}) => {
  const [index, setIndex] = useState(0);
  const ref = useRef(null);

  const previous = () => {
    setIndex(index > 0 ? index - 1 : index);
    ref.current.scrollBy({
      left: scrollBy? -scrollBy :-ref.current.clientWidth,
      behavior: "smooth",
    });
  };

  const next = () => {
    const length = Children.count(children);
    setIndex(index < length - 1 ? index + 1 : index);
    ref.current.scrollBy({
      left: scrollBy? scrollBy : ref.current.clientWidth,
      behavior: "smooth",
    });
  };


   const scrollToIndex = (targetIndex) => {
    if (ref.current) {
      ref.current.scrollTo({
        left: ref.current.clientWidth * targetIndex,
        behavior: "smooth",
      });
    }
  };

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
          {Children.map(children, (child,i) => (
            <div key={i} className="carousel-item">
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

      {/* thumbnails strip for photos preview */}
      {thumbnails && (
        <div className="thumbnails">
          {Children.map(children, (child,i) => (
            <div
              key={i}
              className={`thumbnail ${index === i} active`}
              onClick={() => {
                setIndex(i);
                scrollToIndex(i)
              }}
            >
              {child}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
