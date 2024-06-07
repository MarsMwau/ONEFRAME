import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo2 from "../../../assets/logo2.svg";
import OAuth from "../OAuth/OAuth";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import logmage from "../../../assets/login-img.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://oneframe-api.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      // Store only the token part without the 'Bearer' prefix
      const tokenPart = data.token.split(" ")[1];
      localStorage.setItem("token", tokenPart);

      console.log("token", tokenPart);

      if (response.ok) {
        console.log("Login successful", data);
        setNotification({ type: "success", message: "Login successful!" });
        navigate("/home");
      } else {
        // Handle login error
        console.error("Login failed", data);
        setNotification({
          type: "error",
          message: "Login failed. Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setNotification({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

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
            <img src={logo2} alt="logo" />
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <h3>Sign in with</h3>
            <OAuth />
            <div className="separator">
              <div></div>
              <span>OR</span>
              <div></div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                required
                placeholder="Enter your email"
                name="email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-btn">
              <button type="submit" className="form-submit-btn">
                Sign In
              </button>
            </div>
          </form>
          {notification && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
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
