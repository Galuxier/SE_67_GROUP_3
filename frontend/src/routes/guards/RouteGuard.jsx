/* eslint-disable react/display-name */
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { memo } from "react";

export const AdminRouteGuard = memo(({ children }) => {
  const { user, isLoggedIn, isAdmin } = useAuth();

  if (!isLoggedIn || !user || !user.role || !user.role.includes("admin") || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
});

export const GymManagementRouteGuard = memo(({ children }) => {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn || !user || !user.role || !user.role.includes("gym_owner")) {
    return <Navigate to="/" replace />;
  }

  return children;
});

export const EventManagementRouteGuard = memo(({ children }) => {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn || !user || !user.role || (!user.role.includes("organizer") && !user.role.includes("gym_owner"))) {
    return <Navigate to="/" replace />;
  }

  return children;
});

export const ShopManagementRouteGuard = memo(({ children }) => {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn || !user || !user.role || !user.role.includes("shop_owner")) {
    return <Navigate to="/" replace />;
  }

  return children;
});

export const PlaceManagementRouteGuard = memo(({ children }) => {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn || !user || !user.role || !user.role.includes("lessor")) {
    return <Navigate to="/" replace />;
  }

  return children;
});
