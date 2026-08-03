import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AlbumsAndPhotosContext } from "../shared/AlbumsAndPhotosContext";
import { MasonrySkeleton } from "../shared/Skeletons";
import "./Home.css";
import PageTransition from "../shared/PageTransition";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";

const Home = () => {
  const { photos, isLoading } = useContext(AlbumsAndPhotosContext);
  const navigate = useNavigate();

  const getFullImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/uploads")) {
      return `http://localhost:8080/api${url}`;
    }
    return `http://localhost:8080${url}`;
  };

  const handleImageClick = (id) => {
    navigate(`/photo/${id}`);
  };

  const sortedPhotos = [...photos].sort((a, b) => (a._id < b._id ? 1 : -1));

  return (
    <PageTransition>
      <div className="gallery-content">
        <h2 className="gallery-title">Photos</h2>

        {/* HIGHLIGHTED FIX: Check isLoading FIRST */}
        {isLoading ? (
          <MasonrySkeleton />
        ) : sortedPhotos.length === 0 ? (
          <div className="modern-empty-state">
            <div className="empty-icon-ring">
              <PhotoLibraryOutlinedIcon className="empty-icon" />
            </div>
            <h3>Your gallery is empty</h3>
            <p>
              Let's frame some memories! Upload your first photo to get started.
            </p>
          </div>
        ) : (
          <div className="gallery">
            {sortedPhotos.map((photo) => (
              <div
                className="gallery-item"
                key={photo._id}
                onClick={() => handleImageClick(photo._id)}
              >
                <img
                  src={getFullImageUrl(photo.imageUrl)}
                  alt={photo.title}
                  className="g-img"
                />
                <h3 className="g-title">{photo.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Home;
