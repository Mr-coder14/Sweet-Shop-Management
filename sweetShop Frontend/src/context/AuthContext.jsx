import { createContext, useState, useEffect } from "react";
import { verifyToken } from "../api/authUtils";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Initialize auth on app load / refresh
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuth(null);
        setLoading(false);
        return;
      }

      const { valid, user } = await verifyToken();

      if (valid && user) {
        setAuth({ user });
      } else {
        localStorage.removeItem("token");
        setAuth(null);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // 🔹 Login
  const login = async (token) => {
    localStorage.setItem("token", token);

    const { valid, user } = await verifyToken();

    if (valid && user) {
      setAuth({ user });
    } else {
      logout();
    }
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("token");
    setAuth(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
