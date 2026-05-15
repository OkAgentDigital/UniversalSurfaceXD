/* ============================================
   ThemeControls — Compact Snackbar-Style Controls
   Font Pack Toggle (3-mode) • Light/Dark Icon • Font Size +/-
   ============================================ */
import React from 'react';
import { useUSXTheme } from './USXThemeProvider';
import type { FontSize } from '../../types/usx';

/** Font size progression for +/- controls */
const FONT_SIZES: FontSize[] = ['small', 'medium', 'large', 'xlarge', 'xxlarge'];

/** Font pack presets — 3-mode toggle */
const FONT_PACKS = [
  {
    id: 'modern',
    label: 'Modern',
    icon: '🔤',
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
    icon: '🕹️',
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
    icon: '📜',
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
          fontSize: '18px',
          lineHeight: 1,
        }}
      >
        {theme === 'light' ? '☀️' : '🌙'}
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
