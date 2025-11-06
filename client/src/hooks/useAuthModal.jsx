import { useContext } from "react";
import {AuthModalContext} from "../context/AuthModalProvider";

const useAuthModal = () => {
    return useContext(AuthModalContext);
};

export default useAuthModal