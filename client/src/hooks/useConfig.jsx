import { useContext } from "react";
import { ConfigContext } from "../context/ConfigProvider";

const useConfig = () => {
  return useContext(ConfigContext);
};

export default useConfig;
