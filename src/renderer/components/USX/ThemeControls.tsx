/* ============================================
   ThemeControls — Runtime Theme & Font Zoom Controls
   ============================================ */
import React from 'react';
import { useUSXTheme } from './USXThemeProvider';

export const ThemeControls: React.FC = () => {
  const { theme, fontSize, toggleTheme, setFontSize } = useUSXTheme();

  return (
    <div
      className="usx-controls"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: 'rgb(var(--usx-color-surface))',
        border: 'var(--usx-border-width) var(--usx-border-style) var(--usx-border-color)',
        borderRadius: 'var(--usx-radius-xl)',
        zIndex: 1000,
      }}
    >
      <button onClick={toggleTheme} className="usx-btn usx-btn--outline usx-btn--sm">
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>

      <select
        value={fontSize}
        onChange={(e) => setFontSize(e.target.value as any)}
        className="usx-select"
        style={{
          padding: 'var(--usx-spacing-2) var(--usx-spacing-4)',
          borderRadius: 'var(--usx-radius-lg)',
          fontFamily: 'var(--usx-font-family-body)',
          fontSize: 'var(--usx-font-size-sm)',
          backgroundColor: 'rgb(var(--usx-color-surface))',
          border: 'var(--usx-border-width) var(--usx-border-style) var(--usx-border-color)',
          color: 'rgb(var(--usx-color-text))',
        }}
      >
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
        <option value="xlarge">X-Large</option>
        <option value="xxlarge">XX-Large</option>
      </select>

      <button
        onClick={() => setFontSize('medium')}
        className="usx-btn usx-btn--outline usx-btn--sm"
      >
        Reset
      </button>
    </div>
  );
};
