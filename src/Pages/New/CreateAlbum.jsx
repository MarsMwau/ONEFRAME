import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { toast } from "react-hot-toast";
import PageTransition from "../shared/PageTransition";


const CreateAlbum = () => {
  const [open, setOpen] = useState(true);
  const [albumName, setAlbumName] = useState("");
  const [photoFiles, setPhotoFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const handleClose = () => {
    if (isUploading) return;
    setOpen(false);
    navigate("/albums");
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhotoFiles(e.target.files);
    }
  };

  const handleCreate = async () => {
    if (!albumName) {
      toast.error("Please enter an album name.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found");
      return;
    }

    setIsUploading(true);

    try {
      const albumResponse = await fetch("http://localhost:8080/api/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: albumName,
        }),
      });

      if (!albumResponse.ok) {
        const errorDetails = await albumResponse.json().catch(() => ({}));
        toast.error(errorDetails.message || "Failed to create album.");
        throw new Error(errorDetails.message || "Failed to create album.");
      }

      const newAlbum = await albumResponse.json();
      const newAlbumId = newAlbum._id;

      if (photoFiles && photoFiles.length > 0) {
        const formData = new FormData();
        formData.append("title", `${albumName} - Batch Upload`);
        formData.append("albumId", newAlbumId);
        let validImagesCount = 0;
        Array.from(photoFiles).forEach((file) => {
          if (file.type.startsWith("image/")) {
            formData.append("images", file);
            validImagesCount++;
          } else {
            console.warn(`Skipped non-image file: ${file.name}`);
          }
        });

        // Only send the request if we actually found valid images in the folder
        if (validImagesCount > 0) {
          const photoResponse = await fetch(
            "http://localhost:8080/api/photos",
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            },
          );

          if (!photoResponse.ok) {
            const photoError = await photoResponse.json().catch(() => ({}));
            toast.error(photoError.message || "Failed to upload photos.");
            console.error("Photo Upload Error:", photoError);
          }
        } else {
          toast.warn(
            "No valid images were found in the selected files/folder.",
          );
        }
      }

      setIsUploading(false);
      setOpen(false);
      navigate(`/album/${newAlbumId}`);
    } catch (error) {
      toast.error("Error creating album or uploading photos.");
      console.error("Error creating album or uploading photos:", error);
      setIsUploading(false);
    }
  };

  return (
    <PageTransition>
      <Dialog
        open={open}
        onClose={handleClose}
        disableEscapeKeyDown={isUploading}
        PaperProps={{
          style: {
            borderRadius: "16px",
            padding: "10px",
            backgroundColor: "var(--surface-color)",
            color: "var(--text-color)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.5rem", pb: 1 }}>
          Create New Album
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 2, color: "var(--text-secondary)" }}>
            Give your album a name and add some memories to get started.
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            label="Album Name"
            placeholder="e.g. Summer Vacation 2026"
            fullWidth
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            disabled={isUploading}
            variant="outlined"
            sx={{ mb: 3 }}
          />

          <Box
            sx={{
              border: "2px dashed var(--border-color)",
              borderRadius: "12px",
              textAlign: "center",
              p: 4,
              backgroundColor: "var(--background-color)",
              transition: "border-color 0.3s ease",
            }}
          >
            {photoFiles.length === 0 ? (
              <>
                <CloudUploadIcon
                  sx={{ fontSize: 48, color: "var(--text-secondary)", mb: 1 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Add Photos (Optional)
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-secondary)", mb: 3 }}
                >
                  Upload a few select images or pull in an entire folder at
                  once.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyItems: "center",
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<InsertPhotoIcon />}
                    onClick={() => fileInputRef.current.click()}
                    disabled={isUploading}
                    sx={{
                      flex: 1,
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    Select Files
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CreateNewFolderIcon />}
                    onClick={() => folderInputRef.current.click()}
                    disabled={isUploading}
                    sx={{
                      flex: 1,
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    Select Folder
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ py: 2 }}>
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 50, color: "#9682dc", mb: 1 }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#9682dc" }}
                >
                  {photoFiles.length} Items Selected
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-secondary)", mt: 1 }}
                >
                  Ready to upload as soon as you create the album.
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setPhotoFiles([])}
                  disabled={isUploading}
                  sx={{ mt: 2, color: "var(--text-secondary)" }}
                >
                  Clear Selection
                </Button>
              </Box>
            )}

            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <input
              type="file"
              accept="image/*"
              multiple
              webkitdirectory="true"
              hidden
              ref={folderInputRef}
              onChange={handleFileChange}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleClose}
            disabled={isUploading}
            sx={{ color: "var(--text-secondary)", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={!albumName || isUploading}
            sx={{
              backgroundColor: "var(--button-color)",
              color: "#ffffff",
              fontWeight: 700,
              padding: "8px 24px",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "var(--secondary-color)",
              },
            }}
          >
            {isUploading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Uploading...
              </>
            ) : (
              "Create Album"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </PageTransition>
  );
};

export default CreateAlbum;
