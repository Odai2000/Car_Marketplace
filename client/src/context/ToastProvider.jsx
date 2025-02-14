import { createContext, useEffect, useState } from "react";
import Toast from "../components/UI/Toast/Toast";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toastOptions, setToastOptions] = useState({
  });

  const showToast = (message, variant = "info", duration = 100000, cancellable = true) => {
    setToastOptions({ message, variant, duration, cancellable, isVisible: true });  
  
    setTimeout(() => {
      setToastOptions((prev) => ({ ...prev, isVisible: false }));
    }, duration);
  };
  
  const setVisibility = (visibility) => {
    setToastOptions((prev) => ({
      ...prev,
      isVisible: visibility,
    }));
  };
  return (
    <ToastContext.Provider value={{ toastOptions,showToast }}>
      {toastOptions.isVisible && (
        <Toast
          message={toastOptions.message}
          variant={toastOptions.variant}
          icon={toastOptions.icon}
          cancellable={toastOptions.cancellable}
          isVisible={toastOptions.isVisible}
          setVisibility={setVisibility}
        />
      )}
      {children}
    </ToastContext.Provider>
  );
};
