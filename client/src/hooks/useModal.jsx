import { useContext } from "react";
import { ModalContext } from "../context/ModalProvider";

const useModal = () => {
    return useContext(ModalContext);
};

export default useModal;
