import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login/Login.css"; // Reuse Login styles for consistency
import logo2 from "../../../assets/logo2.svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "", type: "" });

    try {
      // 1. Send the email to your backend
      const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      // 2. Handle the response
      if (response.ok) {
        setStatus({ 
            type: "success", 
            message: "If that email exists, we've sent a reset link!" 
        });
      } else {
        // Even if it fails (e.g. user not found), for security we often 
        // show the same message or a vague error.
        setStatus({ 
            type: "error", 
            message: data.message || "Something went wrong. Try again." 
        });
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      setStatus({ 
          type: "error", 
          message: "Network error. Make sure your backend is running." 
      });
    }
  };

  return (
    <div className="login-section">
      <div className="login-container" style={{maxWidth: "500px", margin: "0 auto"}}>
        <div className="login-form" style={{width: "100%"}}>
          <button className="back-button" onClick={() => navigate("/login")}>
            <ArrowBackIcon />
          </button>
          
          <div className="logo-container">
            <img src={logo2} alt="logo" />
          </div>
          
          <h2 style={{textAlign: "center"}}>Reset Password</h2>
          <p style={{textAlign: "center", color: "#666", marginBottom: "20px"}}>
            Enter your email and we'll send you instructions to reset your password.
          </p>

          <form className="form" onSubmit={handleSubmit}>
            
            {status.message && (
                <div className={`status-banner ${status.type}`} style={{width: "100%"}}>
                    <span>{status.message}</span>
                </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                required
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-btn">
              <button type="submit" className="form-submit-btn">
                Send Reset Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;