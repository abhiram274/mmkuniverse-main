import React from "react";
import { Navigate } from "react-router-dom";

const UserProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem("MMK_U_user_id");
  const userName = localStorage.getItem("MMK_U_name");

  if (!userId || !userName) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default UserProtectedRoute;
