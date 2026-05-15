import React, { useState, useEffect } from 'react';
import { DEFAULT_SETTINGS } from '../../../shared/constants';
import { useUSXTheme } from '../USX/USXThemeProvider';
import type { FontRole, FontSize } from '../../types/usx';

/** Font pack presets — 3-mode toggle (matches ThemeControls snackbar) */
const FONT_PACKS = [
  {
    id: 'modern',
    label: 'Modern',
    icon: '🔤',
    description: 'Clean, modern sans-serif (SF Pro, Source Code Pro)',
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
    description: 'Retro/teletext aesthetic (Chicago, Teletext50, Athene)',
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
    description: 'Classic serif/display (Poppins, Liverpool, PressStart2P)',
    fonts: {
      body: 'Poppins',
      desktop: 'Liverpool',
      document: 'Poppins',
      mono: 'Press Start 2P',
      ui: 'Liverpool',
    },
  },
] as const;

/** Available font options per role */
const FONT_OPTIONS: Record<FontRole, Array<{ name: string }>> = {
  body: [
    { name: 'SF Pro' },
    { name: 'Quicksand' },
    { name: 'Poppins' },
    { name: 'Athene' },
  ],
  desktop: [
    { name: 'Chicago FLF' },
    { name: 'San Frisco' },
    { name: 'Liverpool' },
    { name: 'SF Pro' },
    { name: 'Quicksand' },
    { name: 'Poppins' },
    { name: 'Athene' },
  ],
  document: [
    { name: 'SF Pro' },
    { name: 'Quicksand' },
    { name: 'Poppins' },
    { name: 'Athene' },
  ],
  mono: [
    { name: 'Source Code Pro' },
    { name: 'Teletext 50' },
    { name: 'Teletext 50 Condensed' },
    { name: 'Pet Me 128' },
    { name: 'Pet Me 128 Double' },
    { name: 'Press Start 2P' },
  ],
  ui: [
    { name: 'Chicago FLF' },
    { name: 'SF Pro' },
    { name: 'San Frisco' },
    { name: 'Liverpool' },
    { name: 'Quicksand' },
    { name: 'Poppins' },
    { name: 'Athene' },
  ],
};

const ROLE_LABELS: Record<FontRole, string> = {
  body: 'Body Text',
  desktop: 'Desktop Titles',
  document: 'Document Titles',
  mono: 'Monospace (Code)',
  ui: 'UI Elements',
};

const ROLE_DESCRIPTIONS: Record<FontRole, string> = {
  body: 'Paragraphs, lists, general text',
  desktop: 'Window titles, surface headers, H1/H2',
  document: 'Document headings, H3/H4',
  mono: 'Code blocks, inline code, terminals, teletext/grid',
  ui: 'Buttons, tabs, inputs, controls',
};

/** Font size progression for +/- controls */
const FONT_SIZES: FontSize[] = ['small', 'medium', 'large', 'xlarge', 'xxlarge'];

export function SettingsPanel() {
  const [theme, setTheme] = useState<'dark' | 'light'>((DEFAULT_SETTINGS.theme as 'dark' | 'light'));
  const [autoSaveInterval, setAutoSaveInterval] = useState(DEFAULT_SETTINGS.autoSaveInterval);
  const [fontFamily, setFontFamily] = useState(DEFAULT_SETTINGS.fontFamily);
  const [saved, setSaved] = useState(false);

  // USX theme context (may not be available outside USXViewer)
  let usxTheme: ReturnType<typeof useUSXTheme> | null = null;
  try {
    usxTheme = useUSXTheme();
  } catch {
    // Not inside USXThemeProvider — skip font role controls
  }

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await window.electron.getSettings();
      if (settings.theme) setTheme(settings.theme as 'dark' | 'light');
      if (settings.autoSaveInterval) setAutoSaveInterval(parseInt(settings.autoSaveInterval));
      if (settings.fontFamily) setFontFamily(settings.fontFamily);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const saveSetting = async (key: string, value: string) => {
    try {
      await window.electron.saveSetting(key, value);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save setting:', err);
    }
  };

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    saveSetting('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    // Sync with USXThemeProvider
    if (usxTheme && usxTheme.theme !== newTheme) {
      usxTheme.toggleTheme();
    }
  };

  /** Increase font size via USXThemeProvider */
  const increaseFontSize = () => {
    if (!usxTheme) return;
    const idx = FONT_SIZES.indexOf(usxTheme.fontSize);
    if (idx < FONT_SIZES.length - 1) {
      usxTheme.setFontSize(FONT_SIZES[idx + 1]);
    }
  };

  /** Decrease font size via USXThemeProvider */
  const decreaseFontSize = () => {
    if (!usxTheme) return;
    const idx = FONT_SIZES.indexOf(usxTheme.fontSize);
    if (idx > 0) {
      usxTheme.setFontSize(FONT_SIZES[idx - 1]);
    }
  };

  const handleAutoSaveChange = (value: number) => {
    setAutoSaveInterval(value);
    saveSetting('autoSaveInterval', value.toString());
  };

  /** Determine which font pack is active */
  const getActivePackIndex = (): number => {
    if (!usxTheme) return 0;
    return FONT_PACKS.findIndex((pack) =>
      Object.entries(pack.fonts).every(
        ([role, fontName]) => usxTheme!.fontSelection[role as keyof typeof usxTheme.fontSelection] === fontName
      )
    );
  };

  /** Apply a font pack preset */
  const applyFontPack = (packIndex: number) => {
    if (!usxTheme) return;
    const pack = FONT_PACKS[packIndex];
    (Object.entries(pack.fonts) as Array<[keyof typeof pack.fonts, string]>).forEach(
      ([role, fontName]) => usxTheme!.setFontRole(role as FontRole, fontName)
    );
  };

  return (
    <>
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <i className="codicon codicon-settings-gear"></i>
          <span>SETTINGS</span>
        </div>
      </div>
      <div className="sidebar-content" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {saved && (
          <div style={{
            fontSize: 11,
            padding: '4px 8px',
            borderRadius: 4,
            background: '#1e3a2e',
            color: '#4ec9b0',
            textAlign: 'center',
          }}>
            ✓ Settings saved
          </div>
        )}

        {/* Theme */}
        <div className="setting-group">
          <label className="setting-label">Theme</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className={`action-button ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => handleThemeChange('dark')}
              style={{ flex: 1, background: theme === 'dark' ? '#0e639c' : '#3c3c3c' }}
            >
              <i className="codicon codicon-color-mode"></i> Dark
            </button>
            <button
              className={`action-button ${theme === 'light' ? 'active' : ''}`}
              onClick={() => handleThemeChange('light')}
              style={{ flex: 1, background: theme === 'light' ? '#0e639c' : '#3c3c3c' }}
            >
              <i className="codicon codicon-light-bulb"></i> Light
            </button>
          </div>
        </div>

        {/* Font Size */}
        <div className="setting-group">
          <label className="setting-label">Font Size</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="action-button" onClick={decreaseFontSize} disabled={!usxTheme || usxTheme.fontSize === 'small'}>
              <i className="codicon codicon-remove"></i>
            </button>
            <span style={{ fontSize: 14, color: '#cccccc', minWidth: 24, textAlign: 'center' }}>
              {usxTheme ? (usxTheme.fontSize === 'small' ? 'S' : usxTheme.fontSize === 'medium' ? 'M' : usxTheme.fontSize === 'large' ? 'L' : usxTheme.fontSize === 'xlarge' ? 'XL' : 'XXL') : 'M'}
            </span>
            <button className="action-button" onClick={increaseFontSize} disabled={!usxTheme || usxTheme.fontSize === 'xxlarge'}>
              <i className="codicon codicon-add"></i>
            </button>
          </div>
        </div>

        {/* Auto-save Interval */}
        <div className="setting-group">
          <label className="setting-label">Auto-save Interval</label>
          <select
            value={autoSaveInterval}
            onChange={(e) => handleAutoSaveChange(parseInt(e.target.value))}
            style={{
              width: '100%',
              background: '#3c3c3c',
              border: '1px solid #555',
              borderRadius: 4,
              padding: '4px 8px',
              color: '#cccccc',
              fontSize: 12,
              outline: 'none',
            }}
          >
            <option value={500}>500ms (Fast)</option>
            <option value={1000}>1 second (Default)</option>
            <option value={2000}>2 seconds</option>
            <option value={5000}>5 seconds</option>
            <option value={10000}>10 seconds</option>
          </select>
        </div>

        {/* Editor Font */}
        <div className="setting-group">
          <label className="setting-label">Editor Font</label>
          <input
            type="text"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            onBlur={() => saveSetting('fontFamily', fontFamily)}
            style={{
              width: '100%',
              background: '#3c3c3c',
              border: '1px solid #555',
              borderRadius: 4,
              padding: '4px 8px',
              color: '#cccccc',
              fontSize: 12,
              outline: 'none',
              fontFamily: fontFamily,
            }}
          />
        </div>

        {/* USX Font Pack Settings (only when USXThemeProvider is active) */}
        {usxTheme && (
          <div className="setting-group" style={{ borderTop: '1px solid #3c3c3c', paddingTop: 12 }}>
            <label className="setting-label" style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
              <i className="codicon codicon-font"></i> USX Font Pack
            </label>

            {/* 3-Mode Font Pack Toggle */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: '#858585', display: 'block', marginBottom: 6 }}>
                Quick Presets
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                {FONT_PACKS.map((pack, idx) => (
                  <button
                    key={pack.id}
                    onClick={() => applyFontPack(idx)}
                    title={pack.description}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      padding: '8px 4px',
                      borderRadius: 6,
                      border: `1px solid ${getActivePackIndex() === idx ? '#0e639c' : '#555'}`,
                      background: getActivePackIndex() === idx ? '#0e639c22' : '#3c3c3c',
                      color: getActivePackIndex() === idx ? '#75beff' : '#cccccc',
                      cursor: 'pointer',
                      fontSize: 11,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{pack.icon}</span>
                    <span style={{ fontWeight: getActivePackIndex() === idx ? 600 : 400 }}>{pack.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Per-Role Font Selectors */}
            {(Object.keys(FONT_OPTIONS) as FontRole[]).map((role) => (
              <div key={role} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: '#858585', display: 'block', marginBottom: 4 }}>
                  {ROLE_LABELS[role]}
                </label>
                <select
                  value={usxTheme!.fontSelection[role]}
                  onChange={(e) => usxTheme!.setFontRole(role, e.target.value)}
                  style={{
                    width: '100%',
                    background: '#3c3c3c',
                    border: '1px solid #555',
                    borderRadius: 4,
                    padding: '4px 8px',
                    color: '#cccccc',
                    fontSize: 12,
                    outline: 'none',
                  }}
                >
                  {FONT_OPTIONS[role].map((font) => (
                    <option key={font.name} value={font.name}>
                      {font.name}
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>
                  {ROLE_DESCRIPTIONS[role]}
                </div>
              </div>
            ))}

            {/* Live Preview */}
            <div
              style={{
                marginTop: 8,
                padding: 12,
                backgroundColor: '#252526',
                borderRadius: 6,
                border: '1px solid #3c3c3c',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ fontSize: 10, color: '#666', marginBottom: 4 }}>Preview</div>
              <p style={{ fontFamily: 'var(--usx-font-family-body)', fontSize: 13, margin: 0, color: '#cccccc' }}>
                The quick brown fox jumps over the lazy dog. (Body)
              </p>
              <div style={{ fontFamily: 'var(--usx-font-family-desktop)', fontSize: 16, fontWeight: 700, color: '#cccccc' }}>
                Desktop Title Preview
              </div>
              <div style={{ fontFamily: 'var(--usx-font-family-document)', fontSize: 14, fontWeight: 600, color: '#cccccc' }}>
                Document Title Preview
              </div>
              <code style={{ fontFamily: 'var(--usx-font-family-mono)', fontSize: 12, color: '#ce9178' }}>
                console.log('Code preview');
              </code>
              <button
                style={{
                  fontFamily: 'var(--usx-font-family-ui)',
                  fontSize: 12,
                  padding: '4px 12px',
                  borderRadius: 4,
                  border: '1px solid #0e639c',
                  background: '#0e639c',
                  color: 'white',
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                }}
              >
                Button Preview
              </button>
            </div>
          </div>
        )}

        {/* About */}
        <div className="setting-group" style={{ borderTop: '1px solid #3c3c3c', paddingTop: 12 }}>
          <label className="setting-label">About Surface</label>
          <div style={{ fontSize: 11, color: '#858585', lineHeight: 1.6 }}>
            <div>Version: 1.5.0</div>
            <div>Local-first desktop editor</div>
            <div>Electron + React + Monaco + SQLite</div>
            <div style={{ marginTop: 8, fontSize: 10, color: '#666' }}>
              USX Font Pack: SourceCodePro, SF Pro, Poppins, Quicksand, ChicagoFLF, Teletext50, PetMe128, PressStart2P
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
