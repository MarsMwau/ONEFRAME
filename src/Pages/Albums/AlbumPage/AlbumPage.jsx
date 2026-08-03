import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
import PhotoViewer from "./PhotoViewer/PhotoViewer";
import { AlbumsAndPhotosContext } from "../../shared/AlbumsAndPhotosContext";
import "./AlbumPage.css";
import { toast } from "react-hot-toast";

const AlbumPage = () => {
  const { id, photoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { albums, setAlbums } = useContext(AlbumsAndPhotosContext);
  
  const [album, setAlbum] = useState(null);
  const [selectedPhotoId, setSelectedPhotoId] = useState(photoId || null);

  // --- MENU & MODAL STATES ---
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [photoFiles, setPhotoFiles] = useState([]);

  useEffect(() => {
    const fetchAlbum = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`http://localhost:8080/api/albums/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setAlbum(data);
      } catch (error) {
        toast.error("Error fetching album.");
        console.error("Error fetching album:", error);
      }
    };
    if (id) fetchAlbum();
  }, [id]);

  useEffect(() => {
    setSelectedPhotoId(photoId);
  }, [photoId]);

  // --- MENU LOGIC ---
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // --- EDIT ALBUM TITLE ---
  const handleEditOpen = () => {
    setNewTitle(album?.title || "");
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleEditSave = async () => {
    const token = localStorage.getItem("token");
    if (!token || !id) return;

    try {
      const response = await fetch(`http://localhost:8080/api/albums/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      setAlbum({ ...album, title: newTitle });
      setAlbums(albums.map((a) => (a._id === id ? { ...a, title: newTitle } : a)));
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating album:", error);
      toast.error("Error updating album.");
    }
  };

  // --- DELETE ALBUM ---
  const handleDeleteAlbum = async () => {
    const token = localStorage.getItem("token");
    if (!token || !id) return;

    try {
      const response = await fetch(`http://localhost:8080/api/albums/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");

      setAlbums(albums.filter((a) => a._id !== id));
      handleMenuClose();
      navigate("/albums");
      toast.success("Album deleted successfully.");
    } catch (error) {
      console.error("Error deleting album:", error);
      toast.error("Error deleting album.");
    }
  };

  // --- UPLOAD BATCH PHOTOS ---
  const handleUpload = async () => {
    const token = localStorage.getItem("token");
    if (!token || !id) return;

    try {
      if (photoFiles && photoFiles.length > 0) {
        const formData = new FormData();
        formData.append("title", `${album.title} - Untitled Photo`);
        formData.append("albumId", id);

        Array.from(photoFiles).forEach((file) => {
          if (file.type.startsWith("image/")) {
            formData.append("images", file);
          }
        });
        toast.success("Uploading photos...");

        const response = await fetch("http://localhost:8080/api/photos", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const newPhotos = await response.json();
        toast.success("Photos uploaded successfully!");
        
        // Update UI locally immediately
        const updatedAlbum = { ...album, photos: [...(album.photos || []), ...newPhotos] };
        setAlbum(updatedAlbum);
        setAlbums(albums.map((a) => (a._id === id ? updatedAlbum : a)));
      }

      setUploadOpen(false);
      setPhotoFiles([]);
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Error uploading photo.");
    }
  };

  // --- PHOTO VIEWER LOGIC ---
  const handlePhotoClick = (photo) => {
    setSelectedPhotoId(photo._id);
    navigate(`${location.pathname}/${photo._id}`);
  };

  const handleClosePhotoView = () => {
    setSelectedPhotoId(null);
    navigate(`/album/${id}`, { replace: true });
  };
  const handleDeletePhoto = async (targetPhotoId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8080/api/photos/${targetPhotoId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const updatedPhotos = album.photos.filter((photo) => photo._id !== targetPhotoId);
      const updatedAlbum = { ...album, photos: updatedPhotos };
      
      setAlbum(updatedAlbum);
      setAlbums(albums.map((a) => (a._id === id ? updatedAlbum : a)));
      setSelectedPhotoId(null);
      navigate(`/album/${id}`);
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Error deleting photo.");
    }
  };

  if (!album) return <div className="loading-state">Loading...</div>;

  const getFullImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/uploads")) return `http://localhost:8080/api${url}`;
    return `http://localhost:8080${url}`;
  };

  const sortedPhotos = [...(album.photos || [])].sort((a, b) => (a._id < b._id ? 1 : -1));
  const selectedPhoto = album?.photos.find((photo) => photo._id === selectedPhotoId);

  return (
    <div className="album-page">
      <div className="album-header">
        <div className="header-left">
          <ArrowBackIcon onClick={() => navigate("/albums")} className="back-icon" />
          <h2>{album.title}</h2>
        </div>
        
        {/* HIGHLIGHTED FIX: Menu placed perfectly top-right inside the album */}
        <div className="header-right">
          <MoreVertIcon onClick={handleMenuOpen} className="menu-icon" />
        </div>
      </div>

      <div className="photos-container">
        {sortedPhotos.map((photo) => (
          <div key={photo._id} className="photo-card" onClick={() => handlePhotoClick(photo)}>
            <img src={getFullImageUrl(photo.imageUrl)} alt={photo.title} />
            <p className="p-title">{photo.title}</p>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <PhotoViewer
          selectedPhoto={selectedPhoto}
          setSelectedPhoto={setSelectedPhotoId}
          onClose={handleClosePhotoView}
          photos={sortedPhotos} 
          onDelete={() => handleDeletePhoto(selectedPhoto._id)}
          getFullImageUrl={getFullImageUrl}
        />
      )}

      {/* --- MENU OPTIONS --- */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { setUploadOpen(true); handleMenuClose(); }}>Add Photos</MenuItem>
        <MenuItem onClick={handleEditOpen}>Edit Album Title</MenuItem>
        <MenuItem onClick={handleDeleteAlbum} style={{ color: "red" }}>Delete Album</MenuItem>
      </Menu>

      {/* --- EDIT DIALOG --- */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Album Title</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus margin="dense" label="New Title" type="text" fullWidth
            value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" style={{ backgroundColor: "var(--button-color)", color: "white" }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* --- UPLOAD DIALOG --- */}
      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)}>
        <DialogTitle>Add Photos to {album.title}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Select individual images or upload a whole folder.
          </DialogContentText>
          <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
            <input type="file" accept="image/*" multiple onChange={(e) => setPhotoFiles(e.target.files)} />
            <span style={{ fontWeight: 'bold' }}>OR</span>
            <input type="file" accept="image/*" multiple webkitdirectory="true" onChange={(e) => setPhotoFiles(e.target.files)} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadOpen(false)}>Cancel</Button>
          <Button onClick={handleUpload} variant="contained" style={{ backgroundColor: "var(--button-color)", color: "white" }}>Upload</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AlbumPage;