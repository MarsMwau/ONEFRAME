import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const CreateAlbum = () => {
  const [open, setOpen] = useState(true);
  const [albumName, setAlbumName] = useState("");
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    navigate("/albums");
  };

  const handleCreate = async () => {
    if (albumName) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      try {
        const decodedToken = decodeToken(token);
        console.log("Decoded Token:", decodedToken);

        const response = await fetch(
          "https://oneframe-api.onrender.com/api/albums",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: albumName,
              userId: decodedToken.userId,
            }),
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
        console.log("Created album:", data);
        navigate("/albums");
      } catch (error) {
        console.error("Error creating album:", error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create New Album</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter the name of your new album.</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Album Name"
          placeholder="Family Photos."
          fullWidth
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreate} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAlbum;
