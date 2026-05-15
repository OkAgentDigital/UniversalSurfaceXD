/* ============================================
   USXThemeProvider — Runtime Theme, Font Zoom & Font Role Selection
   ============================================ */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ThemeMode, FontSize, FontRole, FontSelection, USXThemeContextValue } from '../../types/usx';

const DEFAULT_FONT_SELECTION: FontSelection = {
  body: 'SF Pro',
  desktop: 'Chicago FLF',
  document: 'SF Pro',
  mono: 'Source Code Pro',
  ui: 'SF Pro',
};

/** Map font role to CSS variable name */
const ROLE_TO_CSS_VAR: Record<FontRole, string> = {
  body: '--usx-font-family-body',
  desktop: '--usx-font-family-desktop',
  document: '--usx-font-family-document',
  mono: '--usx-font-family-mono',
  ui: '--usx-font-family-ui',
};

/** Map font name to its CSS font-family value */
const FONT_CSS_VALUES: Record<string, string> = {
  'SF Pro': "'SF Pro', sans-serif",
  'Quicksand': "'Quicksand', sans-serif",
  'Poppins': "'Poppins', sans-serif",
  'Athene': "'Athene', serif",
  'Chicago FLF': "'ChicagoFLF', monospace",
  'San Frisco': "'SanFrisco', sans-serif",
  'Liverpool': "'Liverpool', sans-serif",
  'Source Code Pro': "'SourceCodePro', monospace",
  'Teletext 50': "'Teletext50', monospace",
  'Teletext 50 Condensed': "'Teletext50 Condensed', monospace",
  'Pet Me 128': "'PetMe128', monospace",
  'Pet Me 128 Double': "'PetMe128 Double', monospace",
  'Press Start 2P': "'PressStart2P', monospace",
};

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

  const [fontSelection, setFontSelection] = useState<FontSelection>(() => {
    try {
      const saved = localStorage.getItem('usx-font-selection');
      return saved ? (JSON.parse(saved) as FontSelection) : DEFAULT_FONT_SELECTION;
    } catch {
      return DEFAULT_FONT_SELECTION;
    }
  });

  // Apply theme
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

  // Apply font size
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-font-size', fontSize);
    localStorage.setItem('usx-font-size', fontSize);
  }, [fontSize]);

  // Apply font role selections to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    (Object.keys(fontSelection) as FontRole[]).forEach((role) => {
      const fontName = fontSelection[role];
      const cssValue = FONT_CSS_VALUES[fontName];
      if (cssValue) {
        root.style.setProperty(ROLE_TO_CSS_VAR[role], cssValue);
      }
    });
    localStorage.setItem('usx-font-selection', JSON.stringify(fontSelection));
  }, [fontSelection]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setFontRole = useCallback((role: FontRole, fontName: string) => {
    setFontSelection(prev => ({ ...prev, [role]: fontName }));
  }, []);

  return (
    <USXThemeContext.Provider value={{ theme, fontSize, toggleTheme, setFontSize, fontSelection, setFontRole }}>
      {children}
    </USXThemeContext.Provider>
  );
};

export const useUSXTheme = (): USXThemeContextValue => {
  const context = useContext(USXThemeContext);
  if (!context) throw new Error('useUSXTheme must be used within USXThemeProvider');
  return context;
};
