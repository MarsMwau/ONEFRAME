import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import signImage from "../../../assets/sign-up-image.svg";
import logo2 from "../../../assets/logo2.svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// Import an error icon for the modern look
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"; 

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  
  // New state for server-side errors (Duplicate user, network fail, etc.)
  const [serverError, setServerError] = useState(""); 
  
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
    const { name, username, email, password } = formData;
    if (name && username && email && password && !emailError && !passwordError) {
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
        "Password must be 8-14 chars, with uppercase, lowercase, number & special char."
      );
    } else if (forbiddenPattern.test(password)) {
      setPasswordError("Password cannot contain 'name', 'username', 'email', or 'password'.");
    } else if (alphanumericPattern.test(password)) {
      setPasswordError("Password must include at least one special character.");
    } else {
      setPasswordError("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear the server error as soon as the user starts typing to fix it
    if (serverError) setServerError("");

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
    if (emailError || passwordError) return;

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("User registered:", data);
        localStorage.setItem("successMessage", "Account created successfully!");
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);

        // --- MODERN ERROR HANDLING LOGIC ---
        // 1. Handle Duplicate Key (MongoDB Code 11000)
        if (errorData.code === 11000 || (errorData.errorResponse && errorData.errorResponse.code === 11000)) {
            const errStr = JSON.stringify(errorData);
            if (errStr.includes("email")) {
                setServerError("This email is already in use. Try signing in.");
            } else if (errStr.includes("username")) {
                setServerError("This username is already taken.");
            } else {
                setServerError("Account already exists with these details.");
            }
        } 
        // 2. Handle Generic Backend Errors
        else {
            setServerError(errorData.message || "Something went wrong. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setServerError("Network error. Check your internet connection.");
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
            
            {/* --- MODERN ERROR BANNER --- */}
            {serverError && (
                <div className="error-banner">
                    <ErrorOutlineIcon className="error-icon" />
                    <span>{serverError}</span>
                </div>
            )}

            <div className="form-grp">
              <label htmlFor="name">Full Name</label>
              <input
                required
                placeholder="Enter your full name"
                name="name"
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-grp">
              <label htmlFor="username">Username</label>
              <input
                required
                placeholder="Choose a username"
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