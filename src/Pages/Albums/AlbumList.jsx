import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AlbumsAndPhotosContext } from "../shared/AlbumsAndPhotosContext";
import "./AlbumList.css";

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

const AlbumList = () => {
  const { albums, setAlbums } = useContext(AlbumsAndPhotosContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [selectedAlbumPhotosCount, setSelectedAlbumPhotosCount] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [photoLink, setPhotoLink] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoTitle, setPhotoTitle] = useState("");
  const navigate = useNavigate();

  const handleMenuOpen = (event, albumId, photosCount) => {
    setAnchorEl(event.currentTarget);
    setSelectedAlbumId(albumId);
    setSelectedAlbumPhotosCount(photosCount);
    console.log("Selected Album ID set to:", albumId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditOpen = () => {
    const album = albums.find((album) => album._id === selectedAlbumId);
    setNewTitle(album?.title || "");
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found");
      return;
    }

    if (!selectedAlbumId) {
      console.error("Selected album ID is not set");
      return;
    }

    try {
      const response = await fetch(
        `https://oneframe-api.onrender.com/api/albums/${selectedAlbumId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: newTitle }),
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
      console.log("Updated album:", data);
      setAlbums(
        albums.map((album) =>
          album._id === selectedAlbumId ? { ...album, title: newTitle } : album
        )
      );
      handleEditClose();
    } catch (error) {
      console.error("Error updating album:", error);
    }
  };

  const handleUpload = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found");
      return;
    }

    try {
      const decodedToken = decodeToken(token);
      console.log("Decoded Token:", decodedToken);

      let response;

      if (photoFile) {
        // If a photo file is provided, use FormData
        const formData = new FormData();
        formData.append("title", photoTitle);
        formData.append("albumId", selectedAlbumId);
        formData.append("file", photoFile);

        response = await fetch("https://oneframe-api.onrender.com/api/photos", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } else if (photoLink) {
        // If a photo URL is provided, use JSON
        const payload = {
          title: photoTitle,
          imageUrl: photoLink,
          albumId: selectedAlbumId,
        };

        response = await fetch("https://oneframe-api.onrender.com/api/photos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        console.error("No photo link or file provided");
        return;
      }

      console.log("Response status:", response.status);

      if (!response.ok) {
        if (response.status === 401) {
          console.error("Unauthorized: Token might be invalid or expired");
        }
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Uploaded photo:", data);
      setOpen(false);
      navigate("/albums");
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/albums");
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found");
      return;
    }

    if (!selectedAlbumId) {
      console.error("Selected album ID is not set");
      return;
    }

    try {
      const response = await fetch(
        `https://oneframe-api.onrender.com/api/albums/${selectedAlbumId}`,
        {
          method: "DELETE",
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

      setAlbums(albums.filter((album) => album._id !== selectedAlbumId));
      handleMenuClose();
    } catch (error) {
      console.error("Error deleting album:", error);
    }
  };

  return (
    <div className="albums">
      <div className="albums-content">
        <h2 className="albums-title">Albums</h2>
        <div className="albums-container">
          {albums.length === 0 ? (
            <div className="no-albums-message">
              <p>You have no albums. Create your first album now!</p>
            </div>
          ) : (
            albums.map((album) => (
              <div className="album-card" key={album._id}>
                <div className="album-image">
                  <Link to={`/album/${album._id}`}>
                    <img
                      src={album.photos[0]?.imageUrl || ""}
                      alt={album.photos[0]?.title || ""}
                    />
                  </Link>
                  <div className="album-details">
                    <div className="album-title">
                      <h3>{album.title}</h3>
                    </div>
                    <div className="album-actions">
                      <MoreVertIcon
                        onClick={(event) =>
                          handleMenuOpen(event, album._id, album.photos.length)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem>{`Number of Photos: ${selectedAlbumPhotosCount}`}</MenuItem>
        <MenuItem onClick={handleEditOpen}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
        <MenuItem onClick={() => setOpen(true)}>Add Photo</MenuItem>
      </Menu>
      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Album Title</DialogTitle>
        <DialogContent>
          <DialogContentText>Update the album title below:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="New Title"
            type="text"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload Photo</DialogTitle>
        <DialogContent>
          <DialogContentText>Add a photo to the album.</DialogContentText>
          <TextField
            margin="dense"
            label="Photo Title"
            type="text"
            fullWidth
            value={photoTitle}
            onChange={(e) => setPhotoTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Photo Link"
            type="text"
            fullWidth
            value={photoLink}
            onChange={(e) => setPhotoLink(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files[0])}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpload}>Upload</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AlbumList;
