import { useState, useEffect } from "react";
import useConfig from "./useConfig";


const useWindowSize = () => {
  const config = useConfig();

  const smallScreenBreakpoint = config?.smallScreenBreakpoint || 500;
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
