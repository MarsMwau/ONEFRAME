import React from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import TopNavBar from './components/Layout/TopNavBar/TopNavBar';
import BottomNavBar from './components/Layout/BottomNavBar/BottomNavBar';
import AppRoutes from './Routes';
import { AuthProvider } from './components/context/AuthContext';
import { AlbumsAndPhotosProvider } from './Pages/shared/AlbumsAndPhotosContext';

function App() {
  const location = useLocation();

  // --- FIX START: Add new routes here ---
  // Pages where we DO NOT want to load user data (Albums/Photos)
  const publicRoutes = [
      "/", 
      "/login", 
      "/signup", 
      "/forgot-password" // <--- Added
  ];
  
  // Note: reset-password has a dynamic ID (/reset-password/xyz), so we check it specially
  const isResetPage = location.pathname.startsWith("/reset-password");
  const isPublicPage = publicRoutes.includes(location.pathname) || isResetPage;
  // --- FIX END ---
  
  const hideTopNavBarRoutes = ["/profile"];

  const hideBottomNavBars = isPublicPage;
  const hideTopNavBar = hideTopNavBarRoutes.includes(location.pathname) || isPublicPage;

  return (
    <div className="App">
      <AuthProvider>
        {isPublicPage ? (
           // Case 1: Public Pages (Landing, Login, Signup, Forgot Pass)
           <>
             <AppRoutes />
           </>
        ) : (
           // Case 2: Private Pages (Home, Profile, Albums)
           <AlbumsAndPhotosProvider>
             {!hideTopNavBar && <TopNavBar />}
             <AppRoutes />
             {!hideBottomNavBars && <BottomNavBar />}
           </AlbumsAndPhotosProvider>
        )}
      </AuthProvider>
    </div>
  );
}

export default App;