import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import signImage from "../../../assets/sign-up-image.svg";
import logo2 from "../../../assets/logo2.svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigate = useNavigate();

  const emailSchema = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordSchema =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,14}$/;
  const forbiddenPattern =
    /^(?=.*\bname\b|\busername\b|\bemail\b|\bpassword\b).*$/;
  const alphanumericPattern = /^[a-zA-Z0-9]*$/;

  useEffect(() => {
    const { username, email, password } = formData;
    if (username && email && password && !emailError && !passwordError) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [formData, emailError, passwordError]);

  const validateEmail = (email) => {
    if (!emailSchema.test(email)) {
      setEmailError("Invalid email format.");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (password) => {
    if (!passwordSchema.test(password)) {
      setPasswordError(
        "Password must be 8-14 characters long, include at least one lowercase letter, one uppercase letter, one number, and one special character."
      );
    } else if (forbiddenPattern.test(password)) {
      setPasswordError(
        "Password must not contain the words 'name', 'username', 'email', or 'password'."
      );
    } else if (alphanumericPattern.test(password)) {
      setPasswordError("Password must include at least one special character.");
    } else {
      setPasswordError("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "email") {
      validateEmail(value);
    } else if (name === "password") {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || passwordError) {
      return;
    }

    try {
      const response = await fetch(
        "https://oneframe-api.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("User registered:", data);
        localStorage.setItem("successMessage", "Account created successfully!");
        navigate("/login");
      } else {
        console.error("Registration failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="signup-section">
      <div className="signup-container">
        <div className="signup-image">
          <img src={signImage} alt="SignUp" />
        </div>
        <div className="sign-up-form">
          <button className="back-button" onClick={handleBackClick}>
            <ArrowBackIcon />
          </button>
          <div className="signup-logo">
            <img src={logo2} alt="Logo" />
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <h3>Create an account</h3>
            <div className="form-grp">
              <label htmlFor="username">Username</label>
              <input
                required
                placeholder="Enter your name"
                name="username"
                id="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-grp">
              <label htmlFor="email">Email</label>
              <input
                required
                placeholder="Enter your email"
                name="email"
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              {emailError && <p className="error-message">{emailError}</p>}
            </div>
            <div className="form-grp">
              <label htmlFor="password">Password</label>
              <input
                required
                name="password"
                placeholder="Enter your password"
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}
            </div>
            <div className="form-btn">
              <button
                type="submit"
                className="form-submit-btn"
                disabled={isButtonDisabled}
              >
                Create
              </button>
            </div>
            <p className="signup-link">
              Have an account?
              <a className="signup-link link" href="/login">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
