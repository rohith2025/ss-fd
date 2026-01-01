import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, role } = useAuth();

  // Check authentication first
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If role is null/undefined, redirect to login (token might be invalid)
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Check role authorization - only if allowedRoles is specified
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
