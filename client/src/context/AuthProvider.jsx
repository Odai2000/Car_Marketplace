import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const navigate=useNavigate()
  const [auth, setAuth] = useState(null);

  const [persist, setPersist] = useState(JSON.parse(localStorage.getItem('persist'))||false);
  
  const logout=()=>{
    localStorage.removeItem('refreshToken')
    setAuth(null)
    navigate('/')
  }
  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
