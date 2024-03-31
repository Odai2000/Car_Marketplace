import "./Carousel.css";
import { Children, useEffect, useRef, useState } from "react";
import Button from "../Button/Button";
import { FaAngleRight, FaAngleLeft, FaCircle } from "react-icons/fa6";
import { IconContext } from "react-icons/lib";

const Carousal = ({
  items,
  single,
  counter,
  gap = "0",
  children,
  ...props
}) => {
  const [index, setIndex] = useState([]);
  useEffect(() => {
    setIndex(0);
  }, []);

  const pervious = () => {
    setIndex(index > 0 ? index - 1 : index);
    ref.current.scrollBy({
      left: -ref.current.clientWidth,
      behavior: "smooth",
    });
  };

  const next = () => {
    let old = index;
    setIndex(index < 4 - 1 ? index + 1 : index);
    ref.current.scrollBy({
      left: ref.current.clientWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {}, [index]);

  const ref = useRef(null);
  let count = 0;

  return (
    <div className="Carousel">
      <Button styleName="carousel-btn" onClick={pervious}>
        <FaAngleLeft />
      </Button>
      <div
        className={`items ${single ? "single" : ""} `}
        ref={ref}
        style={{ gap: gap }}
      >
        {items
          ? items.map((item) => (
              <div key={count++} className="carousel-item">
                {item}
              </div>
            ))
          : children}

        {counter ? (
          <div className="counter">
            {index + 1}/{4}
          </div>
        ) : (
          ""
        )}
      </div>
      <Button styleName="carousel-btn" style={{ right: 0 }} onClick={next}>
        <FaAngleRight />
      </Button>
    </div>
  );
};

export default Carousal;
