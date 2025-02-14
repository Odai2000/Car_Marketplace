import { useContext } from "react";
import {ToastContext} from "../context/ToastProvider";

const useToast = () => {
    return useContext(ToastContext);
};

export default useToast;
