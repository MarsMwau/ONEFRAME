import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlbumsAndPhotosContext } from "../shared/AlbumsAndPhotosContext";
import "./Search.css";

const Search = () => {
  const { albums, photos } = useContext(AlbumsAndPhotosContext);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPhotos = photos.filter((photo) =>
    photo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigate = useNavigate();

  const handleImageClick = (id) => {
    navigate(`/photo/${id}`);
  };
  const handleAlbumClick = (id) => {
    navigate(`/album/${id}`);
  };

  return (
    <div className="search-content">
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for albums or photos"
        />
        <div className="search-albums">
          <h2>Albums</h2>
          <div className="album-items">
            {filteredAlbums.map((album) => (
              <div
                key={album._id}
                onClick={() => handleAlbumClick(album._id)}
                className="item-card"
              >
                <img src={album.photos[0]?.imageUrl} alt={album.title} />
                <h3>{album.title}</h3>
              </div>
            ))}
          </div>
        </div>
        <div className="search-photos">
          <h2>Photos</h2>
          <div className="photo-grid">
            {filteredPhotos.map((photo) => (
              <div
                key={photo._id}
                onClick={() => handleImageClick(photo._id)}
                className="photo-item"
              >
                <img src={photo.imageUrl} alt={photo.title} />
                <h3>{photo.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
