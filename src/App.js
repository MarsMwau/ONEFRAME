import React from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import TopNavBar from './components/Layout/TopNavBar/TopNavBar';
import BottomNavBar from './components/Layout/BottomNavBar/BottomNavBar';
import AppRoutes from './Routes';
import { AuthProvider } from './components/context/AuthContext';
import { AlbumsAndPhotosProvider } from './Pages/shared/AlbumsAndPhotosContext';
import { ThemeProvider } from './Pages/shared/ThemeContext'; 
import signatureFlowers from './assets/flowers-image.svg';
import { Toaster } from 'react-hot-toast'

function App() {
  const location = useLocation();

  const publicRoutes = [
      "/", 
      "/login", 
      "/signup", 
      "/forgot-password" 
  ];
  const isResetPage = location.pathname.startsWith("/reset-password");
  const isPublicPage = publicRoutes.includes(location.pathname) || isResetPage;
  const hideTopNavBarRoutes = ["/profile"];
  const hideBottomNavBars = isPublicPage;
  const hideTopNavBar = hideTopNavBarRoutes.includes(location.pathname) || isPublicPage;

  return (
    <div className="App">
      <ThemeProvider>
        <AuthProvider>
          {isPublicPage ? (
             <AppRoutes />
          ) : (
             <AlbumsAndPhotosProvider>
               {!hideTopNavBar && <TopNavBar />}
               <AppRoutes />
               {!hideBottomNavBars && <BottomNavBar />}
             </AlbumsAndPhotosProvider>
          )}
        </AuthProvider>
      </ThemeProvider>

      <img 
        src={signatureFlowers} 
        alt="Floral Signature" 
        className="global-signature" 
      />

      <Toaster 
      position="bottom-center"
      toastOptions={{
        style: {
          borderRadius: '30px',
          background: 'var(--surface-color)',
          color: 'var(--text-color)',
          boxShadow: '0 4px 15px var(--shadow-color)',
          padding: '12px 24px',
          fontWeight: 600,
        },
        success: {
          iconTheme: {
            primary: '#b09ce8',
            secondary: '#ffffff',
          },
        },
      }}
    />
      
    </div>
  );
}

export default App;