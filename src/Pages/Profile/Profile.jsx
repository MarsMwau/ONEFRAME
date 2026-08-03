import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Tabs,
  Tab,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Skeleton,
} from "@mui/material";
import { ThemeContext } from "../shared/ThemeContext";
import { Switch, FormControlLabel } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { AlbumsAndPhotosContext } from "../shared/AlbumsAndPhotosContext";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "../../components/context/AuthContext";
import "./Profile.css";
import lightLogo from "../../assets/light-logo.svg";
import darkLogo from "../../assets/dark-logo.svg";
import toast from "react-hot-toast";
import PageTransition from "../shared/PageTransition";

const decodeToken = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join(""),
  );
  return JSON.parse(jsonPayload);
};

const Profile = () => {
  const [tabValue, setTabValue] = useState("photos");
  const [user, setUser] = useState(null);

  const { albums, photos, isLoading } = useContext(AlbumsAndPhotosContext);
  const { logout: contextLogout } = useAuth();
  const navigate = useNavigate();

  // --- SETTINGS MENU & DIALOG STATE ---
  const [anchorEl, setAnchorEl] = useState(null);
  const [openUsernameDialog, setOpenUsernameDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const { mode, setMode } = useContext(ThemeContext);

  // HIGHLIGHTED FIX: Reference for the hidden file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8080/api/users/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data);
        setNewUsername(data.username);
      } else {
        toast.error(data.message || "Failed to fetch user data.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error fetching user data.");
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      localStorage.removeItem("token");
      if (contextLogout) contextLogout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => {
    setAnchorEl(null);
    setStatusMsg("");
  };

  const handleUpdateUsername = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8080/api/users/username", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newUsername }),
      });

      if (response.ok) {
        setUser({ ...user, username: newUsername });
        setOpenUsernameDialog(false);
        handleMenuClose();
        toast.success("Username updated successfully!");
      } else {
        toast.error("Failed to update username.");
      }
    } catch (error) {
      toast.error("Network error.");
    }
  };

  const handleUpdatePassword = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8080/api/users/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setOpenPasswordDialog(false);
        setNewPassword("");
        handleMenuClose();
        toast.success("Password updated successfully!");
      } else {
        setStatusMsg(data.message || "Failed to update password.");
        toast.error(data.message || "Failed to update password.");
      }
    } catch (error) {
      setStatusMsg("Network error.");
      toast.error("Network error.");
    }
  };

  // HIGHLIGHTED FIX: Function to handle the actual image upload
  const handleProfilePicUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("http://localhost:8080/api/users/avatar", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUser({ ...user, profilePic: data.profilePicUrl });
        toast.success("Profile picture updated successfully!");
      } else {
        console.error("Failed to upload profile picture");
        toast.error("Failed to upload profile picture.");
      }
    } catch (error) {
      console.error("Error uploading picture:", error);
      toast.error("Error uploading profile picture.");
    }
  };

  const getFullImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/uploads")) {
      return `http://localhost:8080/api${url}`;
    }
    return `http://localhost:8080${url}`;
  };

  if (!user || isLoading) {
    return (
      <PageTransition>
        <div className="profile-page">
          <div className="profile-cover">
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
            />
          </div>
          <div className="profile-card">
            <div className="profile-header">
              <div className="avatar-wrapper">
                <Skeleton
                  variant="circular"
                  width={120}
                  height={120}
                  className="modern-avatar"
                  animation="wave"
                />
              </div>
              <div
                className="profile-info"
                style={{ width: "100%", maxWidth: "300px" }}
              >
                <Skeleton
                  variant="text"
                  width="80%"
                  height={40}
                  animation="wave"
                />
                <Skeleton
                  variant="text"
                  width="60%"
                  height={24}
                  animation="wave"
                />
              </div>
              <Skeleton
                variant="rectangular"
                width={90}
                height={40}
                sx={{ borderRadius: 2 }}
                animation="wave"
              />
            </div>

            <div className="storage-dashboard">
              <Skeleton
                variant="text"
                width={150}
                height={32}
                sx={{ mb: 2 }}
                animation="wave"
              />
              <div className="storage-item">
                <Skeleton
                  variant="text"
                  width="100%"
                  height={24}
                  animation="wave"
                />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={8}
                  sx={{ borderRadius: 1, mt: 1 }}
                  animation="wave"
                />
              </div>
              <div className="storage-item" style={{ marginTop: "1.2rem" }}>
                <Skeleton
                  variant="text"
                  width="100%"
                  height={24}
                  animation="wave"
                />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={8}
                  sx={{ borderRadius: 1, mt: 1 }}
                  animation="wave"
                />
              </div>
            </div>

            <div className="profile-tabs-section">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "40px",
                  marginBottom: "20px",
                }}
              >
                <Skeleton
                  variant="text"
                  width={80}
                  height={30}
                  animation="wave"
                />
                <Skeleton
                  variant="text"
                  width={80}
                  height={30}
                  animation="wave"
                />
              </div>
              <div className="modern-grid photos-layout">
                {Array.from(new Array(6)).map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    width="100%"
                    height={200}
                    sx={{ borderRadius: 3 }}
                    animation="wave"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const maxPhotos = 500;
  const maxAlbums = 50;
  const photoPercentage = Math.min((photos.length / maxPhotos) * 100, 100);
  const albumPercentage = Math.min((albums.length / maxAlbums) * 100, 100);

  return (
    <div className="profile-page">
      <div className="profile-cover">
        <img src={lightLogo} alt="Cover" className="logo-light" />
        <img src={darkLogo} alt="Cover" className="logo-dark" />
      </div>

      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-wrapper">
            <Avatar
              src={user.profilePic ? getFullImageUrl(user.profilePic) : ""}
              className="modern-avatar"
            />
            <div
              className="camera-icon"
              // HIGHLIGHTED FIX: Opens the hidden file selector
              onClick={() => fileInputRef.current.click()}
            >
              <PhotoCamera fontSize="small" />
            </div>

            {/* HIGHLIGHTED FIX: The hidden input that handles the file selection */}
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleProfilePicUpload}
            />
          </div>

          <div className="profile-info">
            <div className="username-row">
              <h2>{user.username}</h2>
              <IconButton onClick={handleMenuOpen} className="settings-btn">
                <SettingsIcon />
              </IconButton>
            </div>
            <p className="email-text">{user.email}</p>
          </div>

          <Button
            variant="outlined"
            className="modern-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        <div className="storage-dashboard">
          <h3 className="dashboard-title">Storage Usage</h3>
          <div className="storage-item">
            <div className="storage-info">
              <span className="storage-label">Photos Stored</span>
              <span className="storage-count">
                {photos.length} / {maxPhotos}
              </span>
            </div>
            <LinearProgress
              variant="determinate"
              value={photoPercentage}
              className="progress-bar"
              sx={{
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": { backgroundColor: "#111" },
              }}
            />
          </div>

          <div className="storage-item">
            <div className="storage-info">
              <span className="storage-label">Albums Created</span>
              <span className="storage-count">
                {albums.length} / {maxAlbums}
              </span>
            </div>
            <LinearProgress
              variant="determinate"
              value={albumPercentage}
              className="progress-bar"
              sx={{
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": { backgroundColor: "#555" },
              }}
            />
          </div>
        </div>

        <div className="profile-tabs-section">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            TabIndicatorProps={{ style: { backgroundColor: "#000" } }}
          >
            <Tab label="Photos" value="photos" className="modern-tab" />
            <Tab label="Albums" value="albums" className="modern-tab" />
          </Tabs>

          <div className="profile-content">
            {tabValue === "photos" && (
              <div className="modern-grid photos-layout">
                {photos.map((photo) => (
                  <div
                    key={photo._id}
                    onClick={() => navigate(`/photo/${photo._id}`)}
                    className="grid-item"
                  >
                    <img
                      src={getFullImageUrl(photo.imageUrl)}
                      alt={photo.title}
                    />
                  </div>
                ))}
              </div>
            )}

            {tabValue === "albums" && (
              <div className="modern-grid albums-layout">
                {albums.map((album) => (
                  <div
                    key={album._id}
                    onClick={() => navigate(`/album/${album._id}`)}
                    className="grid-item album-item"
                  >
                    <img
                      src={
                        album.photos.length > 0
                          ? getFullImageUrl(album.photos[0].imageUrl)
                          : "https://via.placeholder.com/150"
                      }
                      alt={album.title}
                    />
                    <div className="album-overlay">
                      <h3>{album.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            setOpenUsernameDialog(true);
            handleMenuClose();
          }}
        >
          Change Username
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenPasswordDialog(true);
            handleMenuClose();
          }}
        >
          Update Password
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={mode === "dark"}
                onChange={(e) => setMode(e.target.checked ? "dark" : "light")}
              />
            }
            label="Dark Mode"
          />
        </MenuItem>
      </Menu>

      <Dialog
        open={openUsernameDialog}
        onClose={() => setOpenUsernameDialog(false)}
      >
        <DialogTitle>Edit Username</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Username"
            type="text"
            fullWidth
            variant="outlined"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          {statusMsg && <p className="error-text">{statusMsg}</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUsernameDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateUsername}
            variant="contained"
            style={{ backgroundColor: "black" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
      >
        <DialogTitle>Update Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {statusMsg && <p className="error-text">{statusMsg}</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleUpdatePassword}
            variant="contained"
            style={{ backgroundColor: "black" }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Profile;
