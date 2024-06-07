import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AlbumsAndPhotosContext } from "../shared/AlbumsAndPhotosContext";
import "./Home.css";

const Home = () => {
  const { photos } = useContext(AlbumsAndPhotosContext);
  const navigate = useNavigate();

  const handleImageClick = (id) => {
    navigate(`/photo/${id}`);
  };

  return (
    <div className="gallery-content">
      <h2 className="gallery-title">Photos</h2>
      {photos.length === 0 ? (
        <div className="no-photos-message">
          <p>Welcome to ONEFRAME! You have no photos, let's create memories together.</p>
        </div>
      ) : (
        <div className="gallery">
          {photos.map((photo) => (
            <div
              className="gallery-item"
              key={photo._id}
              onClick={() => handleImageClick(photo._id)}
            >
              <img src={photo.imageUrl} alt={photo.title} className="g-img" />
              <h3 className="g-title">{photo.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;