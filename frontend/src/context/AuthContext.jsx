import { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getStoredToken();
      
      if (token) {
        // Verify token is still valid
        const isValid = await authService.verifyToken(token);
        
        if (isValid) {
          setIsAuthenticated(true);
          
          // Load user data from localStorage
          const userData = localStorage.getItem("user");
          if (userData) {
            try {
              setUser(JSON.parse(userData));
            } catch (error) {
              console.error("Error parsing user data:", error);
            }
          }
        } else {
          // Token is invalid, clear auth data
          authService.clearAuthData();
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token, userData = null) => {
    setIsAuthenticated(true);
    
    if (userData) {
      setUser(userData);
    }
  };

  const logout = () => {
    authService.clearAuthData();
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user,
      setIsAuthenticated,
      login,
      logout,
      updateUser,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};