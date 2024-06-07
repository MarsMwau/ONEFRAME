import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import Login from "./components/auth/Login/Login";
import SignUp from "./components/auth/SignUp/SignUp";
import PrivateRoute from "./components/context/PrivateRoute";
import Home from "./Pages/Home/Home";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
    </Routes>
  );
};

export default AppRoutes;
