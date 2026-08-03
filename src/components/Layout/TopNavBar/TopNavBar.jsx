import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar"; // Imported Avatar for the profile pic
import lightLogo from '../../../assets/light-logo.svg'; 
import darkLogo from '../../../assets/dark-logo.svg';
import "./TopNavBar.css";

const TopNavBar = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [userPic, setUserPic] = useState("");

  useEffect(() => {
    // 1. Fetch the user's profile picture for the top right icon
    const fetchUserPic = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:8080/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUserPic(data.profilePic);
        }
      } catch (error) {
        console.error("Error fetching user data for navbar:", error);
      }
    };

    fetchUserPic();

    // 2. Hide Navbar when scrolling down
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getFullImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/uploads")) return `http://localhost:8080/api${url}`;
    return `http://localhost:8080${url}`;
  };

  return (
    <div className={`top-nav ${isVisible ? "" : "hidden"}`}>
      <div className="top-container">
        
        {/* Left Side: Logo */}
        <div className="top-logo" onClick={() => navigate("/home")}>
          <img src={lightLogo} alt="ONE FRAME" className="logo-light" />
          <img src={darkLogo} alt="ONE FRAME" className="logo-dark" />
        </div>

        {/* Right Side: Clickable Profile Icon */}
        <div className="top-profile" onClick={() => navigate("/profile")}>
          <Avatar 
            src={userPic ? getFullImageUrl(userPic) : ""} 
            className="nav-avatar"
          />
        </div>

      </div>
    </div>
  );
};

export default TopNavBar;