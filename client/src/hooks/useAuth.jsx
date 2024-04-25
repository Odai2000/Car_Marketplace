import { useContext } from "react";
import AuthProvider from "../context/AuthProvider";

const useAuth = () => {
  return useContext(AuthProvider);
};

export default useAuth;
