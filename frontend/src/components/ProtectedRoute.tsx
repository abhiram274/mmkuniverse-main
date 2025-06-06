import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const adminId = localStorage.getItem("admin_id");

  if (!adminId) {
    return <Navigate to="/admin_login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;