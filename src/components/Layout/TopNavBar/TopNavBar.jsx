import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo2.svg";
import "./TopNavBar.css";

const TopNavBar = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    // Hide Navbar when scrolling down
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

  const handleLogoClick = () => {
    navigate("/home");
  };

  return (
    <div className={`top-nav ${isVisible ? "" : "hidden"}`}>
      <div className="top-container">
        <div className="top-logo" onClick={handleLogoClick}>
          <img src={logo} alt="logo" />
        </div>
      </div>
    </div>
  );
};

export default TopNavBar;
