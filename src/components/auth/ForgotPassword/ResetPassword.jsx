import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Login/Login.css"; // Reuse Login styles
import logo2 from "../../../assets/logo2.svg";

const ResetPassword = () => {
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setStatus({ type: "error", message: "Passwords do not match." });
        return;
    }

    try {
      // Pointing to LOCALHOST for testing
      const response = await fetch(`http://localhost:8080/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: "Password reset successful! Redirecting..." });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setStatus({ type: "error", message: data.message || "Failed to reset password." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Network error. Try again." });
    }
  };

  return (
    <div className="login-section">
      <div className="login-container" style={{maxWidth: "500px", margin: "0 auto"}}>
        <div className="login-form" style={{width: "100%"}}>
          <div className="logo-container">
            <img src={logo2} alt="logo" />
          </div>
          
          <h2 style={{textAlign: "center"}}>Set New Password</h2>

          <form className="form" onSubmit={handleSubmit}>
            {status.message && (
                <div className={`status-banner ${status.type}`} style={{width: "100%"}}>
                    <span>{status.message}</span>
                </div>
            )}

            <div className="form-group">
              <label>New Password</label>
              <input
                required
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                required
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="form-btn">
              <button type="submit" className="form-submit-btn">
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;