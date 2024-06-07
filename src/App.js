import React from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import TopNavBar from './components/Layout/TopNavBar/TopNavBar';
import BottomNavBar from './components/Layout/BottomNavBar/BottomNavBar';
import AppRoutes from './Routes';
import { AuthProvider } from './components/context/AuthContext';

function App() {
  const location = useLocation();

  const hideNavBarRoutes = ["/", "/login", "/signup"];
  const hideTopNavBarRoutes = ["/profile"];

  const hideBottomNavBars = hideNavBarRoutes.includes(location.pathname);
  const hideTopNavBar = hideTopNavBarRoutes.includes(location.pathname) || hideNavBarRoutes.includes(location.pathname);

  return (
    <div className="App">
      <AuthProvider>
          {!hideTopNavBar && <TopNavBar />}
          <AppRoutes />
          {!hideBottomNavBars && <BottomNavBar />}
      </AuthProvider>
    </div>
  );
}

export default App;