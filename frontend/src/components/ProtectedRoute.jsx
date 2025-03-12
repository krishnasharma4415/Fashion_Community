import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("authToken"); // Simulated auth check

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;