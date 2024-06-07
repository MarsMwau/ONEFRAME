import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhotoViewer from "./PhotoViewer/PhotoViewer";
import "./AlbumPage.css";

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

const AlbumPage = () => {
  const { id, photoId } = useParams(); // Get photoId from URL params
  const navigate = useNavigate();
  const location = useLocation();
  const [album, setAlbum] = useState(null);
  const [selectedPhotoId, setSelectedPhotoId] = useState(photoId || null);

  useEffect(() => {
    const fetchAlbum = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }
      console.log("Fetching album with ID:", id);
      try {
        const decodedToken = decodeToken(token);
        console.log("Decoded Token:", decodedToken);

        const response = await fetch(
          `https://oneframe-api.onrender.com/api/albums/${id}`,
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
        console.log("Fetched album:", data);
        setAlbum(data);
      } catch (error) {
        console.error("Error fetching album:", error);
      }
    };

    fetchAlbum();
  }, [id]);

  useEffect(() => {
    setSelectedPhotoId(photoId);
  }, [photoId]);

  const handlePhotoClick = (photo) => {
    setSelectedPhotoId(photo._id);
    navigate(`${location.pathname}/${photo._id}`);
  };

  const handleClosePhotoView = () => {
    setSelectedPhotoId(null);
    navigate(`/album/${id}`);
  };

  const selectedPhoto = album?.photos.find(
    (photo) => photo._id === selectedPhotoId
  );

  if (!album) {
    return <div>Loading...</div>;
  }

  return (
    <div className="album-page">
      <div className="album-header">
        <ArrowBackIcon onClick={() => navigate(-1)} />
        <h2>{album.title}</h2>
      </div>
      <div className="photos-container">
        {album.photos.map((photo) => (
          <div
            key={photo._id}
            className="photo-card"
            onClick={() => handlePhotoClick(photo)}
          >
            <img src={photo.imageUrl} alt={photo.title} />
            <p className="p-title">{photo.title}</p>
          </div>
        ))}
      </div>
      {selectedPhoto && (
        <PhotoViewer
          selectedPhoto={selectedPhoto}
          setSelectedPhoto={setSelectedPhotoId}
          onClose={handleClosePhotoView}
          photos={album.photos}
        />
      )}
    </div>
  );
};

export default AlbumPage;
