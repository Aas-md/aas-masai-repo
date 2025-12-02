import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(localStorage.getItem("login")) || false
  );

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem("login", true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("login", false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
