import { useState, useEffect } from "react";

const useWindowSize = ({ smallScreenBreakpoint = 768 } = {}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(
    () => window.innerWidth <= smallScreenBreakpoint
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= smallScreenBreakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isSmallScreen };
};

export default useWindowSize;
