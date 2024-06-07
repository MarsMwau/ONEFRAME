import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import Login from "./components/auth/Login/Login";
import SignUp from "./components/auth/SignUp/SignUp";
import PrivateRoute from "./components/context/PrivateRoute";
import Home from "./Pages/Home/Home";
import GalleryPhoto from "./Pages/Home/GalleryPhoto/GalleryPhoto";
import AlbumList from "./Pages/Albums/AlbumList";
import AlbumPage from "./Pages/Albums/AlbumPage/AlbumPage";
import CreateAlbum from "./Pages/New/CreateAlbum";
import UploadPhotos from "./Pages/New/UploadPhotos";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/photo/:id" element={<PrivateRoute><GalleryPhoto /></PrivateRoute>} />
      <Route path="/albums" element={<PrivateRoute><AlbumList /></PrivateRoute>} />
      <Route path="/album/:id" element={<PrivateRoute><AlbumPage /></PrivateRoute>} />
      <Route path="/album/:id/:photoId" element={<PrivateRoute><AlbumPage /></PrivateRoute>} />
      <Route path="/create-album" element={<PrivateRoute><CreateAlbum /></PrivateRoute>} />
      <Route path="/upload-photos/:albumId" element={<PrivateRoute><UploadPhotos /></PrivateRoute>} />
    </Routes>
  );
};

export default AppRoutes;
