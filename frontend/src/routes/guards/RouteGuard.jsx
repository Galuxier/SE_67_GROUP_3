import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AdminRouteGuard = ({ children }) => {
  const { user, isLoggedIn, isAdmin } = useAuth();
  
  if (!isLoggedIn || !user || !user.role || !user.role.includes("admin") || !isAdmin) {
    // Redirect to home if not authenticated
    return <Navigate to="/" replace />;
  }
  
  // If authenticated
  return children;
};

export const GymManagementRouteGuard = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  
  if (!isLoggedIn || !user || !user.role || !user.role.includes("gym_owner")) {
    // Redirect to home if not authenticated
    return <Navigate to="/" replace />;
  }
  
  // If authenticated
  return children;
};

export const EventManagementRouteGuard = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  
  if (!isLoggedIn || !user || !user.role || (!user.role.includes("organizer") && !user.role.includes("gym_owner"))) {
    // Redirect to home if not authenticated
    return <Navigate to="/" replace />;
  }
  
  // If authenticated
  return children;
};

export const ShopManagementRouteGuard = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  
  if (!isLoggedIn || !user || !user.role || !user.role.includes("shop_owner")) {
    // Redirect to home if not authenticated
    return <Navigate to="/" replace />;
  }
  
  // If authenticated
  return children;
};

export const PlaceManagementRouteGuard = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  
  if (!isLoggedIn || !user || !user.role || !user.role.includes("lessor")) {
    // Redirect to home if not authenticated
    return <Navigate to="/" replace />;
  }
  
  // If authenticated and has lessor role, render the children components
  return children;
};