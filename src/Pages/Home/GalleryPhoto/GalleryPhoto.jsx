import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./GalleryPhoto.css";

const decodeToken = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );
  return JSON.parse(jsonPayload);
};

const GalleryPhoto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [touchStartX, setTouchStartX] = useState(0);

  useEffect(() => {
    const fetchPhotoById = async () => {
      if (id) {
        const token = localStorage.getItem("token");
        const decodedToken = decodeToken(token);
        if (!decodedToken) {
          console.error("Invalid token");
          return;
        }

        try {
          const response = await fetch(
            `https://oneframe-api.onrender.com/api/photos/${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          setPhoto(data);

          // Fetch all photos
          const allPhotosResponse = await fetch(
            "https://oneframe-api.onrender.com/api/photos",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!allPhotosResponse.ok) {
            throw new Error("Network response was not ok");
          }

          const allPhotosData = await allPhotosResponse.json();
          setPhotos(allPhotosData);
        } catch (error) {
          console.error("Error fetching photo by ID:", error);
        }
      }
    };

    fetchPhotoById();
  }, [id]);

  const handleNext = () => {
    const currentIndex = photos.findIndex((p) => p._id === id);
    if (currentIndex !== -1 && currentIndex < photos.length - 1) {
      navigate(`/photo/${photos[currentIndex + 1]._id}`);
    }
  };

  const handlePrev = () => {
    const currentIndex = photos.findIndex((p) => p._id === id);
    if (currentIndex !== -1 && currentIndex > 0) {
      navigate(`/photo/${photos[currentIndex - 1]._id}`);
    }
  };

  const handleSwipe = (direction) => {
    if (direction === "left") {
      handleNext();
    } else if (direction === "right") {
      handlePrev();
    }
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;
    if (diffX > 50) {
      handleSwipe("left");
    } else if (diffX < -50) {
      handleSwipe("right");
    }
  };

  return (
    <div
      className="imgOpen open"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {photo && (
        <>
          <img src={photo.imageUrl} alt="img" />
          <h3 className="img-title">{photo.title}</h3>
        </>
      )}
      <ArrowBackIcon onClick={() => navigate("/home")} className="close-icon" />
      <ArrowBackIosIcon onClick={handlePrev} className="prev-icon" />
      <ArrowForwardIosIcon onClick={handleNext} className="next-icon" />
    </div>
  );
};

export default GalleryPhoto;
