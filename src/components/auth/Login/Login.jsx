import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // <--- Import Link
import "./Login.css";
import lightLogo from "../../../assets/light-logo.svg"; 
import darkLogo from "../../../assets/dark-logo.svg";
import OAuth from "../OAuth/OAuth";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import logmage from "../../../assets/login-img.svg";
import { useAuth } from "../../context/AuthContext";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [banner, setBanner] = useState({ message: "", type: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful", data);
        setBanner({
          type: "success",
          message: "Login successful! Redirecting...",
        });

        const tokenPart = data.token.split(" ")[1];
        localStorage.setItem("token", tokenPart);
        login(tokenPart);

        setTimeout(() => navigate("/home"), 1000);
      } else {
        console.error("Login failed", data);
        setBanner({
          type: "error",
          message: data.message || "Invalid credentials. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setBanner({
        type: "error",
        message: "Unable to connect to server. Please check your internet.",
      });
    }
  };

  const handleInput = (setter) => (e) => {
    setter(e.target.value);
    if (banner.message) setBanner({ message: "", type: "" });
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="login-section">
      <div className="login-container">
        <div className="login-image">
          <img src={logmage} alt="" />
        </div>
        <div className="login-form">
          <button className="back-button" onClick={handleBackClick}>
            <ArrowBackIcon />
          </button>
          <h2>Welcome Back!</h2>
          <div className="logo-container">
            <img src={lightLogo} alt="Logo" className="logo-light" />
            <img src={darkLogo} alt="Logo" className="logo-dark" />
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <h3>Sign in with</h3>
            <OAuth />

            <div className="separator">
              <div></div>
              <span>OR</span>
              <div></div>
            </div>

            {banner.message && (
              <div className={`status-banner ${banner.type}`}>
                {banner.type === "error" ? (
                  <ErrorOutlineIcon />
                ) : (
                  <CheckCircleOutlineIcon />
                )}
                <span>{banner.message}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                required
                placeholder="Enter your email"
                name="email"
                id="email"
                type="email"
                value={email}
                onChange={handleInput(setEmail)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                required
                name="password"
                placeholder="Enter your password"
                id="password"
                type="password"
                value={password}
                onChange={handleInput(setPassword)}
              />
            </div>

            {/* --- FORGOT PASSWORD LINK --- */}
            <div className="forgot-pass-container">
              <Link to="/forgot-password" className="forgot-pass-link">
                Forgot Password?
              </Link>
            </div>

            <div className="form-btn">
              <button type="submit" className="form-submit-btn">
                Sign In
              </button>
            </div>
          </form>

          <p className="signup-link">
            Don't have an account?
            <a className="signup-link link" href="/signup">
              Sign up now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
