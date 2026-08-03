import React from "react";
import { useNavigate } from "react-router-dom";
import lightLogo from "../../assets/light-logo.svg";
import darkLogo from "../../assets/dark-logo.svg";
import album from "../../assets/album.svg";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

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
            {/* HIGHLIGHTED FIX: Added both logos with their respective classes */}
            <img src={lightLogo} alt="logo" className="logo-light" />
            <img src={darkLogo} alt="logo" className="logo-dark" />
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