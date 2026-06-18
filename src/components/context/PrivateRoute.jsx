// components/context/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // CRITICAL: Check both the Context State AND LocalStorage
  // Context might be null for a split second on reload, but the token exists.
  const hasToken = localStorage.getItem("token");

  if (!currentUser && !hasToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
