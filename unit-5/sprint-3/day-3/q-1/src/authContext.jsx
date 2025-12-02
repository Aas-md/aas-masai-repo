import React, { createContext, useContext, useState, useEffect } from "react";

const KEY = "mindtrack_user_v1";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(KEY, JSON.stringify(user));
    else localStorage.removeItem(KEY);
  }, [user]);

  const loginAsStudent = (email = "student@example.com") =>
    setUser({ role: "student", email, name: "Student" });

  const loginAsMentor = (email = "mentor@example.com") =>
    setUser({ role: "mentor", email, name: "Mentor" });

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loginAsStudent, loginAsMentor, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
