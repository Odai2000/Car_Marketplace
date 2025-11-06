import { createContext, useState } from "react";
import Modal from "../components/UI/Modal/Modal";
import LoginForm from "../components/AuthForms/LoginForm";
import RegisterForm from "../components/AuthForms/RegisterForm";

export const AuthModalContext = createContext();

export const AuthModalProvider =({ children })=> {
  const [mode, setMode] = useState(null); // "login" | "register" | null

  const close = () => setMode(null);
  const openLogin = () => setMode("login");
  const openRegister = () => setMode("register");

  return (
    <AuthModalContext.Provider value={{ openLogin, openRegister, close }}>
      {children}

      <Modal
        show={!!mode}
        onClose={close}
        title={mode === "login" ? "Login" : "Register"}
      >
        {mode === "login" && <LoginForm onSuccess={close} />}
        {mode === "register" && <RegisterForm onSuccess={close} />}
      </Modal>
    </AuthModalContext.Provider>
  );
}
