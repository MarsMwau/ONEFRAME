import React, { createContext, useState, useEffect } from "react";

export const AlbumsAndPhotosContext = createContext();

const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const AlbumsAndPhotosProvider = ({ children }) => {
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);
  // 1. Loading state initialized
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const fetchAlbumsAndPhotos = async () => {
      setIsLoading(true); // Start loading
      
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const decodedToken = decodeToken(token);
      if (!decodedToken) {
        console.error("Invalid token");
        setIsLoading(false);
        return;
      }

      const userId = decodedToken.id || decodedToken.userId;
      console.log("Decoded User ID:", userId);

      try {
        const responseAlbums = await fetch(`http://localhost:8080/api/albums?userId=${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!responseAlbums.ok) {
          throw new Error("Network response was not ok for albums");
        }

        const dataAlbums = await responseAlbums.json();
        console.log("Fetched Albums:", dataAlbums);
        setAlbums(dataAlbums);

        const responsePhotos = await fetch(`http://localhost:8080/api/photos?userId=${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!responsePhotos.ok) {
          throw new Error("Network response was not ok for photos");
        }

        const dataPhotos = await responsePhotos.json();
        console.log("Fetched Photos:", dataPhotos);
        setPhotos(dataPhotos);
      } catch (error) {
        console.error("Error fetching albums and photos:", error);
      } finally {
        // 2. Stop loading whether it succeeds or fails
        setIsLoading(false);
      }
    };

    fetchAlbumsAndPhotos();
  }, []);

  return (
    // 3. Highlighted Fix: Passed isLoading down so your pages can use it!
    <AlbumsAndPhotosContext.Provider value={{ albums, setAlbums, photos, setPhotos, isLoading }}>
      {children}
    </AlbumsAndPhotosContext.Provider>
  );
};