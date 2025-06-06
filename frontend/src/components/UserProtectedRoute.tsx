import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const UserProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {

    const userId = localStorage.getItem("MMK_U_user_id");
    const userEmail = localStorage.getItem("MMK_U_email");

    if (userId && userEmail) {
      setIsValid(true);
    }
    setIsChecking(false);
  }, []);

  if (isChecking) return null; // or a spinner/loading UI

  return isValid ? <>{children}</> : <Navigate to="/login" replace />;
};

export default UserProtectedRoute;
