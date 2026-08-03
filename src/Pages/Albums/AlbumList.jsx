import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { AlbumsAndPhotosContext } from "../shared/AlbumsAndPhotosContext";
import { GridSkeleton } from "../shared/Skeletons";
import "./AlbumList.css";
import PageTransition from "../shared/PageTransition";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";

const AlbumList = () => {
  const { albums, isLoading } = useContext(AlbumsAndPhotosContext);
  const [searchQuery, setSearchQuery] = useState("");

  const getFullImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/uploads")) {
      return `http://localhost:8080/api${url}`;
    }
    return `http://localhost:8080${url}`;
  };

  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <PageTransition>
      <div className="albums">
        <div className="albums-content">
          <div className="albums-header-row">
            <h2 className="albums-title">Albums</h2>

            <div className="modern-search-bar">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <GridSkeleton />
          ) : (
            <div className="albums-container">
              {albums.length === 0 ? (
                <div className="modern-empty-state">
                  <div className="empty-icon-ring">
                    <PhotoLibraryOutlinedIcon className="empty-icon" />
                  </div>
                  <h3>No Albums Yet?</h3>
                  <p>
                    Let's frame some memories! Create your first album to get
                    started.
                  </p>
                </div>
              ) : (
                filteredAlbums.map((album) => (
                  <div className="album-card" key={album._id}>
                    <Link to={`/album/${album._id}`} className="album-link">
                      <div className="album-image">
                        <img
                          src={
                            album.photos && album.photos.length > 0
                              ? getFullImageUrl(album.photos[0].imageUrl)
                              : "https://via.placeholder.com/600x400?text=No+Image"
                          }
                          alt={album.title}
                        />
                      </div>
                      <div className="album-details">
                        <h3>{album.title}</h3>
                        <span className="album-count">
                          {album.photos ? album.photos.length : 0}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default AlbumList;
