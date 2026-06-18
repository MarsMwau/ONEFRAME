import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import Login from "./components/auth/Login/Login";
import SignUp from "./components/auth/SignUp/SignUp";
// --- FIX START: Import new components ---
import ForgotPassword from "./components/auth/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/auth/ForgotPassword/ResetPassword";
// --- FIX END ---
import PrivateRoute from "./components/context/PrivateRoute";
import Home from "./Pages/Home/Home";
import GalleryPhoto from "./Pages/Home/GalleryPhoto/GalleryPhoto";
import AlbumList from "./Pages/Albums/AlbumList";
import AlbumPage from "./Pages/Albums/AlbumPage/AlbumPage";
import CreateAlbum from "./Pages/New/CreateAlbum";
import UploadPhotos from "./Pages/New/UploadPhotos";
import Search from "./Pages/Search/Search";
import Profile from "./Pages/Profile/Profile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* --- FIX START: Add new public routes --- */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      {/* --- FIX END --- */}

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      {/* ... (rest of your existing private routes are fine) ... */}
      <Route
        path="/photo/:id"
        element={
          <PrivateRoute>
            <GalleryPhoto />
          </PrivateRoute>
        }
      />
      <Route
        path="/albums"
        element={
          <PrivateRoute>
            <AlbumList />
          </PrivateRoute>
        }
      />
      <Route
        path="/album/:id"
        element={
          <PrivateRoute>
            <AlbumPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/album/:id/:photoId"
        element={
          <PrivateRoute>
            <AlbumPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-album"
        element={
          <PrivateRoute>
            <CreateAlbum />
          </PrivateRoute>
        }
      />
      <Route
        path="/upload-photos/:albumId"
        element={
          <PrivateRoute>
            <UploadPhotos />
          </PrivateRoute>
        }
      />
      <Route
        path="/search"
        element={
          <PrivateRoute>
            <Search />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;