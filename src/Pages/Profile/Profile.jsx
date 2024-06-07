import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Tabs, Tab, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { AlbumsAndPhotosContext } from "../shared/AlbumsAndPhotosContext";
import "./Profile.css";

const decodeToken = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
};

const Profile = () => {
  const [tabValue, setTabValue] = useState("photos");
  const [user, setUser] = useState(null);
  const { albums, photos } = useContext(AlbumsAndPhotosContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      try {
        const decodedToken = decodeToken(token);
        console.log("Decoded Token:", decodedToken);

        const response = await fetch(
          "https://oneframe-api.onrender.com/api/users/me",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
          if (response.status === 401) {
            console.error("Unauthorized: Token might be invalid or expired");
          }
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Fetched user data:", data);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleImageClick = (id) => {
    navigate(`/photo/${id}`);
  };

  const handleAlbumClick = (id) => {
    navigate(`/album/${id}`);
  };

  return (
    <div className="profile">
      <div className="cover-photo">
        <img
          src="https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Cover"
        />
      </div>
      <Button
        variant="contained"
        className="logout"
        color="primary"
        onClick={handleLogout}
      >
        Logout
      </Button>
      <div className="profile-details">
        <Avatar className="profile-avatar">
          <PersonIcon style={{ fontSize: "4em", color: "black" }} />
        </Avatar>
        <div className="profile-container">
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <div className="profile-stats">
            <span>{albums.length} albums</span>
            <span>{photos.length} photos</span>
          </div>
        </div>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Photos" value="photos" />
          <Tab label="Albums" value="albums" />
        </Tabs>
        <div className="profile-content">
          {tabValue === "photos" && (
            <div className="photos-grid">
              {photos.map((photo) => (
                <div
                  key={photo._id}
                  onClick={() => handleImageClick(photo._id)}
                  className="photo-item"
                >
                  <img src={photo.imageUrl} alt={photo.title} />
                  <h3>{photo.title}</h3>
                </div>
              ))}
            </div>
          )}
          {tabValue === "albums" && (
            <div className="albums-grid">
              {albums.map((album) => (
                <div
                  key={album._id}
                  onClick={() => handleAlbumClick(album._id)}
                  className="album-card"
                >
                  <img
                    src={
                      album.photos.length > 0
                        ? album.photos[0].imageUrl
                        : "https://via.placeholder.com/150"
                    }
                    alt={album.title}
                  />
                  <h3>{album.title}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
