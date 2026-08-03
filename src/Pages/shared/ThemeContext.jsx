import React, { createContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem('theme') || 'system');

  useEffect(() => {
    const root = document.documentElement;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeTheme = mode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : mode;

    // Apply the data-theme attribute to the HTML tag
    root.setAttribute('data-theme', activeTheme);
    localStorage.setItem('theme', mode);

    // Listen for OS-level changes in real-time
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (mode === 'system') {
        root.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  // Sync the theme with Material-UI components
  const muiTheme = useMemo(() => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeTheme = mode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : mode;
    
    return createTheme({
      palette: {
        mode: activeTheme,
        background: {
          paper: activeTheme === 'dark' ? '#1e182d' : '#ffffff', // Syncs MUI dialog backgrounds
        }
      },
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <MUIThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};