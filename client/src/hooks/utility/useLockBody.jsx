import { useEffect } from "react";

const useLockBody = (toggle) => {
  useEffect(() => {
    if (toggle) {
      document.body.style.overflow = "hidden";

      document.body.style.pointerEvents = "none";
      document.body.style.userSelect = "none !important";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
      document.body.style.userSelect = "";
    };
  }, [toggle]);
};

export default useLockBody;
