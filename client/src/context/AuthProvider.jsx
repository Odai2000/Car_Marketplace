import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import useConfig from "../hooks/useConfig";
export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const { config } = useConfig();

  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  const login = async (username, password) => {
    try {
      const response = await fetch(`${config.serverURL}/user/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorMsg =
          response.status === 401
            ? "Incorrect username or password"
            : "Login failed";
        throw new Error(errorMsg);
      }

      const data = await response.json();

      setAuth({
        accessToken: data.accessToken,
        roles: data.userData?.roles || [],
        userData: data.userData || [],
      });

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, errorMsg: error.message };
    }
  };

  const register = async (firstName, lastName, email, username, password) => {
    try {
      const response = await fetch(`${config.serverURL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorMsg =
          response.status === 400 ? "Invalid Info" : "Registration failed";
        throw new Error(errorMsg);
      }

      const data = await response.json(); //might
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        errorMsg: error.message || "Registration failed",
      };
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${config.serverURL}/user/logout`, {
        method: "POST",
        credentials: "include",
            headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      });

      if (response.ok) {
        setPersist(false);
        setAuth(null);
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, errorMsg: error.message };
    }
  };
  return (
    <AuthContext.Provider
      value={{ auth, setAuth, persist, setPersist, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
