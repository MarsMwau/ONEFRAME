import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import album from "../../assets/album.svg";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  // routes for signing up and signing in
  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="landing-section">
      <div className="landing-container">
        <div className="left-container">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="auth-container">
            <h3>Sign in or Create your account here</h3>
            <div className="auth-btns">
              <button className="sign-up-btn" onClick={handleSignUp}>
                Sign Up
              </button>
              <button className="log-in-btn" onClick={handleLogin}>
                Log In
              </button>
            </div>
          </div>
        </div>
        <div className="right-container">
          <div className="image-container">
            <img src={album} alt="album" />
          </div>
          <h2>Every Picture tells a story.</h2>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
