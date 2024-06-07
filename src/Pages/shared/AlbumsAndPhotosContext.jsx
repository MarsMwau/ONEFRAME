import React, { createContext, useState, useEffect } from "react";

export const AlbumsAndPhotosContext = createContext();

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

export const AlbumsAndPhotosProvider = ({ children }) => {
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchAlbumsAndPhotos = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      try {
        const decodedToken = decodeToken(token);
        const userId = decodedToken.userId;

        const responseAlbums = await fetch(`https://oneframe-api.onrender.com/api/albums?userId=${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!responseAlbums.ok) {
          throw new Error("Network response was not ok");
        }

        const dataAlbums = await responseAlbums.json();
        setAlbums(dataAlbums);

        const responsePhotos = await fetch(`https://oneframe-api.onrender.com/api/photos?userId=${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!responsePhotos.ok) {
          throw new Error("Network response was not ok");
        }

        const dataPhotos = await responsePhotos.json();
        setPhotos(dataPhotos);
      } catch (error) {
        console.error("Error fetching albums and photos:", error);
      }
    };

    fetchAlbumsAndPhotos();
  }, []);

  return (
    <AlbumsAndPhotosContext.Provider value={{ albums, setAlbums, photos, setPhotos }}>
      {children}
    </AlbumsAndPhotosContext.Provider>
  );
};