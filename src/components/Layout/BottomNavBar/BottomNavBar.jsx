import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import CollectionsIcon from "@mui/icons-material/Collections";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import "./BottomNavBar.css";

const BottomNavBar = () => {
  const [value, setValue] = useState("Home");
  const [hideNav, setHideNav] = useState(false);
  const navigate = useNavigate();

  // Navigation routes
  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case "Home":
        navigate("/home");
        break;
      case "Albums":
        navigate("/albums");
        break;
      case "New":
        navigate("/create-album");
        break;
      case "Search":
        navigate("/search");
        break;
      case "Profile":
        navigate("/profile");
        break;
      default:
        break;
    }
  };

  // Hide the navigation bar when scrolling down
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setHideNav(true);
      } else {
        setHideNav(false);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`bottom-nav ${hideNav ? "hide" : ""}`}>
      <div className="bottom-container">
        <BottomNavigation showLabels value={value} onChange={handleChange}>
          <BottomNavigationAction
            label="Home"
            value="Home"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            label="Albums"
            value="Albums"
            icon={<CollectionsIcon />}
          />
          <BottomNavigationAction
            label="New"
            value="New"
            icon={<AddIcon />}
            className="NewButton"
          />
          <BottomNavigationAction
            label="Search"
            value="Search"
            icon={<SearchIcon />}
          />
          <BottomNavigationAction
            label="Profile"
            value="Profile"
            icon={<PersonIcon />}
          />
        </BottomNavigation>
      </div>
    </div>
  );
};

export default BottomNavBar;
