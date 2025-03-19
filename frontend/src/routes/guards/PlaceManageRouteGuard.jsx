// src/routes/PlaceManagementRouteGuard.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PlaceManagementRouteGuard = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  
  if (!isLoggedIn || !user || !user.role || !user.role.includes("lessor")) {
    // Redirect to home if not authenticated
    return <Navigate to="/" replace />;
  }
  
  // If authenticated and has lessor role, render the children components
  return children;
};

export default PlaceManagementRouteGuard;