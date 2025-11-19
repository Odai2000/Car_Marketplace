import { useContext } from "react";
import { DialogContext } from "../context/DialogProvider";

const useDialog = () => {
    return useContext(DialogContext);
};

export default useDialog;
