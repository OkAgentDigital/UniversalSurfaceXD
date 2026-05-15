/* ============================================
   ThemeControls — Compact Snackbar-Style Controls
   Font Pack Toggle (3-mode) • Light/Dark Icon • Font Size +/-
   ============================================ */
import React from 'react';
import { useUSXTheme } from './USXThemeProvider';
import type { FontSize } from '../../types/usx';

/** SVG icon components for mono theme */
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const FontIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7V4h16v3" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);

const RetroIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const ClassicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

/** Font size progression for +/- controls */
const FONT_SIZES: FontSize[] = ['small', 'medium', 'large', 'xlarge', 'xxlarge'];

/** Font pack presets — 3-mode toggle */
const FONT_PACKS = [
  {
    id: 'modern',
    label: 'Modern',
    icon: <FontIcon />,
    fonts: {
      body: 'SF Pro',
      desktop: 'SF Pro',
      document: 'SF Pro',
      mono: 'Source Code Pro',
      ui: 'SF Pro',
    },
  },
  {
    id: 'retro',
    label: 'Retro',
    icon: <RetroIcon />,
    fonts: {
      body: 'Athene',
      desktop: 'Chicago FLF',
      document: 'Athene',
      mono: 'Teletext 50',
      ui: 'Chicago FLF',
    },
  },
  {
    id: 'classic',
    label: 'Classic',
    icon: <ClassicIcon />,
    fonts: {
      body: 'Poppins',
      desktop: 'Liverpool',
      document: 'Poppins',
      mono: 'Press Start 2P',
      ui: 'Liverpool',
    },
  },
] as const;

export const ThemeControls: React.FC = () => {
  const { theme, fontSize, toggleTheme, setFontSize, fontSelection, setFontRole } = useUSXTheme();

  /** Determine which font pack is active based on current selections */
  const activePack = FONT_PACKS.findIndex((pack) =>
    Object.entries(pack.fonts).every(
      ([role, fontName]) => fontSelection[role as keyof typeof fontSelection] === fontName
    )
  );

  /** Cycle to next font pack */
  const cycleFontPack = () => {
    const nextIndex = (activePack + 1) % FONT_PACKS.length;
    const pack = FONT_PACKS[nextIndex];
    (Object.entries(pack.fonts) as Array<[keyof typeof fontSelection, string]>).forEach(
      ([role, fontName]) => setFontRole(role, fontName)
    );
  };

  /** Increase font size */
  const increaseFontSize = () => {
    const idx = FONT_SIZES.indexOf(fontSize);
    if (idx < FONT_SIZES.length - 1) {
      setFontSize(FONT_SIZES[idx + 1]);
    }
  };

  /** Decrease font size */
  const decreaseFontSize = () => {
    const idx = FONT_SIZES.indexOf(fontSize);
    if (idx > 0) {
      setFontSize(FONT_SIZES[idx - 1]);
    }
  };

  return (
    <div
      className="usx-controls"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        gap: '6px',
        padding: '8px 12px',
        backgroundColor: 'rgb(var(--usx-color-surface))',
        border: 'var(--usx-border-width) var(--usx-border-style) var(--usx-border-color)',
        borderRadius: 'var(--usx-radius-xl)',
        alignItems: 'center',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      {/* 1. Light/Dark Icon Toggle */}
      <button
        onClick={toggleTheme}
        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        className="usx-btn usx-btn--outline usx-btn--sm"
        style={{
          minWidth: '36px',
          minHeight: '36px',
          padding: '6px',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {theme === 'light' ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* Divider */}
      <div style={{ width: '1px', height: '24px', backgroundColor: 'rgb(var(--usx-color-border))' }} />

      {/* 2. Font Size +/- */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          onClick={decreaseFontSize}
          disabled={fontSize === 'small'}
          title="Decrease Font Size"
          className="usx-btn usx-btn--outline usx-btn--sm"
          style={{
            minWidth: '36px',
            minHeight: '36px',
            padding: '6px',
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          −
        </button>
        <span
          style={{
            fontFamily: 'var(--usx-font-family-ui)',
            fontSize: 'var(--usx-font-size-xs)',
            color: 'rgb(var(--usx-color-text))',
            minWidth: '48px',
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          {fontSize === 'small' ? 'S' : fontSize === 'medium' ? 'M' : fontSize === 'large' ? 'L' : fontSize === 'xlarge' ? 'XL' : 'XXL'}
        </span>
        <button
          onClick={increaseFontSize}
          disabled={fontSize === 'xxlarge'}
          title="Increase Font Size"
          className="usx-btn usx-btn--outline usx-btn--sm"
          style={{
            minWidth: '36px',
            minHeight: '36px',
            padding: '6px',
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          +
        </button>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '24px', backgroundColor: 'rgb(var(--usx-color-border))' }} />

      {/* 3. Font Pack 3-Mode Toggle */}
      <button
        onClick={cycleFontPack}
        title={`Font Pack: ${FONT_PACKS[activePack >= 0 ? activePack : 0].label}`}
        className="usx-btn usx-btn--outline usx-btn--sm"
        style={{
          minWidth: '36px',
          minHeight: '36px',
          padding: '6px 10px',
          fontSize: '13px',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <span style={{ fontSize: '16px' }}>{FONT_PACKS[activePack >= 0 ? activePack : 0].icon}</span>
        <span style={{ fontFamily: 'var(--usx-font-family-ui)', fontSize: 'var(--usx-font-size-xs)', fontWeight: 600 }}>
          {FONT_PACKS[activePack >= 0 ? activePack : 0].label}
        </span>
      </button>
    </div>
  );
};
