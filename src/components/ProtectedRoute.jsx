import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Guards admin-only pages. Redirects to /admin/login if no token found.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
