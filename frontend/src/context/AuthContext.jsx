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
              const parsedUser = JSON.parse(userData);
              setUser(parsedUser);
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
    // Token should already be stored by authService, but ensure it's there
    if (token && !localStorage.getItem('authToken')) {
      localStorage.setItem('authToken', token);
    }
    
    // Store user data
    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    setIsAuthenticated(true);
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