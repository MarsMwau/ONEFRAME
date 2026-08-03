import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlbumsAndPhotosContext } from "../shared/AlbumsAndPhotosContext";
import "./Search.css";
import PageTransition from "../shared/PageTransition";

const Search = () => {
  const { albums, photos } = useContext(AlbumsAndPhotosContext);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAlbums = albums
    .filter((album) =>
      album.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => (a._id < b._id ? 1 : -1));

  // --- HIGHLIGHTED FIX: Filter AND sort photos newest to oldest ---
  const filteredPhotos = photos
    .filter((photo) =>
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => (a._id < b._id ? 1 : -1));

  const navigate = useNavigate();

  const handleImageClick = (id) => {
    navigate(`/photo/${id}`);
  };

  const handleAlbumClick = (id) => {
    navigate(`/album/${id}`);
  };

  const getFullImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/uploads")) {
      return `http://localhost:8080/api${url}`;
    }
    return `http://localhost:8080${url}`;
  };

  return (
    <PageTransition>
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
              {filteredAlbums.length === 0 ? (
                <p>No albums found.</p>
              ) : (
                filteredAlbums.map((album) => (
                  <div
                    key={album._id}
                    onClick={() => handleAlbumClick(album._id)}
                    className="item-card"
                  >
                    <img
                      src={
                        album.photos && album.photos.length > 0
                          ? getFullImageUrl(album.photos[0].imageUrl)
                          : "https://via.placeholder.com/150?text=No+Image"
                      }
                      alt={album.title}
                    />
                    <h3>{album.title}</h3>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="search-photos">
            <h2>Photos</h2>
            <div className="photo-grid">
              {filteredPhotos.length === 0 ? (
                <p>No photos found.</p>
              ) : (
                filteredPhotos.map((photo) => (
                  <div
                    key={photo._id}
                    onClick={() => handleImageClick(photo._id)}
                    className="photo-item"
                  >
                    <img
                      src={getFullImageUrl(photo.imageUrl)}
                      alt={photo.title}
                    />
                    <h3>{photo.title}</h3>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Search;
