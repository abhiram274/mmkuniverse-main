import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const adminMail = localStorage.getItem("admin_mail");

  if (!adminMail) {
    return <Navigate to="/admin_login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;