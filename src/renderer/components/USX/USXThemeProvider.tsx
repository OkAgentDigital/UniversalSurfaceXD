/* ============================================
   USXThemeProvider — Runtime Theme & Font Zoom
   ============================================ */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ThemeMode, FontSize, USXThemeContextValue } from '../../types/usx';

const USXThemeContext = createContext<USXThemeContextValue | undefined>(undefined);

export const USXThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('usx-theme');
    return (saved as ThemeMode) || 'light';
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem('usx-font-size');
    return (saved as FontSize) || 'medium';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('usx-theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-font-size', fontSize);
    localStorage.setItem('usx-font-size', fontSize);
  }, [fontSize]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <USXThemeContext.Provider value={{ theme, fontSize, toggleTheme, setFontSize }}>
      {children}
    </USXThemeContext.Provider>
  );
};

export const useUSXTheme = (): USXThemeContextValue => {
  const context = useContext(USXThemeContext);
  if (!context) throw new Error('useUSXTheme must be used within USXThemeProvider');
  return context;
};
