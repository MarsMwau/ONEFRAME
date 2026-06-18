import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload"; // Optional: Looks nice

// ... keep your decodeToken function here ...
const decodeToken = (token) => { /* ... same as before ... */ };

const UploadPhotos = () => {
  const { albumId } = useParams();
  const [open, setOpen] = useState(true);
  const [photoTitle, setPhotoTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // Changed from photoLink string
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    navigate("/albums");
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found");
      return;
    }

    if (!selectedFile) {
        alert("Please select a file first!");
        return;
    }

    try {
      // 1. Use FormData instead of JSON
      const formData = new FormData();
      formData.append("image", selectedFile); // Must match the backend: upload.single('image')
      formData.append("title", photoTitle);
      formData.append("albumId", albumId);
      
      // Note: We don't strictly need to send userId if the backend extracts it from the Token
      // But if your schema requires it in the body, add it:
      // const decoded = decodeToken(token);
      // formData.append("userId", decoded.userId);

      const response = await fetch("http://localhost:8080/api/photos", {
        method: "POST",
        headers: {
          // IMPORTANT: Do NOT set Content-Type to application/json
          // Let the browser set the Content-Type to multipart/form-data
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Send the form data object
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log("Uploaded photo:", data);

      setOpen(false);
      navigate(`/album/${albumId}`); // Better UX: Go back to the specific album
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Upload Photo</DialogTitle>
      <DialogContent>
        <DialogContentText>Choose an image from your device.</DialogContentText>
        
        <TextField
          autoFocus
          margin="dense"
          label="Photo Title"
          fullWidth
          value={photoTitle}
          onChange={(e) => setPhotoTitle(e.target.value)}
        />

        {/* File Input */}
        <div style={{ marginTop: "20px", marginBottom: "10px" }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Select File
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="image/*"
              />
            </Button>
            {selectedFile && (
                <span style={{ marginLeft: "10px", fontSize: "0.9rem" }}>
                    {selectedFile.name}
                </span>
            )}
        </div>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleUpload} color="primary" variant="contained">
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadPhotos;