import { createContext, useState, useCallback } from "react";
import Modal from "../components/UI/Modal/Modal";
import Button from "../components/UI/Button/Button";

export const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [options, setOptions] = useState(null);
  const [resolver, setResolver] = useState(null);

  const openDialog = useCallback((config = {}) => {
    return new Promise((resolve) => {
      setResolver(() => resolve);

      setOptions({
        title: config.title || "",
        text: config.text || "",
        actions: config.actions || [{ label: "Ok",value:true ,variant: "primary" }],
        cancellable: config.cancellable,
        isVisible: true,
      });
    });
  }, []);

  const closeDialog = (value) => {
    if (resolver) resolver(value);
    setResolver(null);
    setOptions(null);
  };

  return (
    <DialogContext.Provider value={{ openDialog }}>
      {children}

      {options?.isVisible && (
        <Modal
          cancellable={options.cancellable}
          show={options.isVisible}
          onClose={() => closeDialog("cancel")}
        >
          <h2>{options.title}</h2>
          <span>{options.text}</span>

          <div style={{ marginTop: "1rem" }}>
            {options.actions.map((action, i) => (
              <Button
                key={`dialog-action-${i}`}
                variant={action.variant}
                onClick={() => closeDialog(action.value)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </Modal>
      )}
    </DialogContext.Provider>
  );
};
