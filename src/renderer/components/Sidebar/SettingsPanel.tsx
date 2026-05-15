import React, { useState, useEffect } from 'react';
import { DEFAULT_SETTINGS } from '../../../shared/constants';

export function SettingsPanel() {
  const [theme, setTheme] = useState<'dark' | 'light'>((DEFAULT_SETTINGS.theme as 'dark' | 'light'));
  const [fontSize, setFontSize] = useState(DEFAULT_SETTINGS.fontSize);
  const [autoSaveInterval, setAutoSaveInterval] = useState(DEFAULT_SETTINGS.autoSaveInterval);
  const [fontFamily, setFontFamily] = useState(DEFAULT_SETTINGS.fontFamily);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await window.electron.getSettings();
      if (settings.theme) setTheme(settings.theme as 'dark' | 'light');
      if (settings.fontSize) setFontSize(parseInt(settings.fontSize));
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
  };

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(10, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    saveSetting('fontSize', newSize.toString());
  };

  const handleAutoSaveChange = (value: number) => {
    setAutoSaveInterval(value);
    saveSetting('autoSaveInterval', value.toString());
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
            <button className="action-button" onClick={() => handleFontSizeChange(-1)}>
              <i className="codicon codicon-remove"></i>
            </button>
            <span style={{ fontSize: 14, color: '#cccccc', minWidth: 24, textAlign: 'center' }}>
              {fontSize}
            </span>
            <button className="action-button" onClick={() => handleFontSizeChange(1)}>
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

        {/* Font Family */}
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

        {/* About */}
        <div className="setting-group" style={{ borderTop: '1px solid #3c3c3c', paddingTop: 12 }}>
          <label className="setting-label">About UniversalSurfaceXD</label>
          <div style={{ fontSize: 11, color: '#858585', lineHeight: 1.6 }}>
            <div>Version: 1.4.0</div>
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
