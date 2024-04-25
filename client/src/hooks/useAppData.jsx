import { useContext } from "react";
import {AppContext} from "../context/AppDataProvider";
const useAppData = () => {
  return useContext(AppContext);
};

export default useAppData;
