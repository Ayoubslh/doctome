import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const api = "http://localhost:3000";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      if (localStorage.getItem("auth_token") === "demo-token") {
        setUser({ role: "doctor", user_id: "demo-id", username: "Demo Doctor" });
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }
      const response = await axios.get(`${api}/auth/me`);
      if (response.data && response.data.user_id) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
      // Attempt token refresh or logout on 401
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("auth_token", newToken);
    if (userData) {
      localStorage.setItem("auth_user", JSON.stringify(userData));
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
