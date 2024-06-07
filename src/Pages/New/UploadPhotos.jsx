import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

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

const UploadPhotos = () => {
  const { albumId } = useParams();
  const [open, setOpen] = useState(true);
  const [photoLink, setPhotoLink] = useState("");
  const [photoTitle, setPhotoTitle] = useState("");
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    navigate("/albums");
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

      const photoData = {
        title: photoTitle,
        imageUrl: photoLink,
        albumId,
        userId: decodedToken.userId,
      };

      const response = await fetch(
        "https://oneframe-api.onrender.com/api/photos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(photoData),
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
      console.log("Uploaded photo:", data);

      setOpen(false);
      navigate("/albums");
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Upload Photos</DialogTitle>
      <DialogContent>
        <DialogContentText>Upload photos to your Album.</DialogContentText>
        <TextField
          margin="dense"
          label="Photo Title"
          fullWidth
          value={photoTitle}
          onChange={(e) => setPhotoTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Photo Link"
          fullWidth
          value={photoLink}
          onChange={(e) => setPhotoLink(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleUpload} color="primary">
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadPhotos;
