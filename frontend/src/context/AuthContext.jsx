import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getCurrentUser } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("aurum_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("aurum_token") || "");
  const [loading, setLoading] = useState(true);

  // Sync token & check auth on initial load
  useEffect(() => {
    const verify = async () => {
      const storedToken = localStorage.getItem("aurum_token");
      if (storedToken) {
        try {
          const profile = await getCurrentUser();
          setUser(profile);
          localStorage.setItem("aurum_user", JSON.stringify(profile));
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    verify();
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("aurum_token", data.token);
    localStorage.setItem("aurum_user", JSON.stringify(data.user));
    return data.user;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("aurum_token", data.token);
    localStorage.setItem("aurum_user", JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("aurum_token");
    localStorage.removeItem("aurum_user");
  };

  const isSeller = Boolean(user && (user.role === "seller" || user.role === "dealer"));
  const isBuyer = Boolean(user && user.role === "buyer");

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isSeller,
    isBuyer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
