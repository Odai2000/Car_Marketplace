import { useState, useEffect } from "react";
import useConfig from "./useConfig";


const useWindowSize = () => {
  const {config} = useConfig();

  const mdBreakpoint = config?.mdBreakpoint;
  const [isSmallScreen, setIsSmallScreen] = useState(
    () => window.innerWidth <= mdBreakpoint
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= mdBreakpoint)
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isSmallScreen };
};



export default useWindowSize;
