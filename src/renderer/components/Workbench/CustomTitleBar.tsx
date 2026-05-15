import React, { useState, useCallback } from 'react';
import { APP_NAME, APP_VERSION } from '../../../shared/constants';

interface CustomTitleBarProps {
  showRightPanel: boolean;
  onToggleRightPanel: () => void;
  showSidebar?: boolean;
  onToggleSidebar?: () => void;
  showPanel?: boolean;
  onTogglePanel?: () => void;
  currentDocument?: string;
  onOpenCommandPalette?: () => void;
}

// Consistent 22px SVG icons — mono color scheme
const Icons = {
  sidebar: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  ),
  terminal: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  chat: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  settings: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  account: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  universui: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="9" height="9" rx="2" />
      <rect x="13" y="2" width="9" height="9" rx="2" />
      <rect x="2" y="13" width="9" height="9" rx="2" />
      <rect x="13" y="13" width="9" height="9" rx="2" />
    </svg>
  ),
};

export function CustomTitleBar({
  showRightPanel,
  onToggleRightPanel,
  showSidebar = true,
  onToggleSidebar,
  showPanel = false,
  onTogglePanel,
  currentDocument,
  onOpenCommandPalette,
}: CustomTitleBarProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleCommandPalette = useCallback(() => {
    if (onOpenCommandPalette) {
      onOpenCommandPalette();
    }
  }, [onOpenCommandPalette]);

  return (
    <div className="custom-title-bar">
      <div className="title-bar-drag">
        {/* Mac traffic light spacer — positioned at the outer level */}
        <div className="mac-traffic-light-spacer" />

        {/* Left section: App branding only */}
        <div className="title-bar-left">
          <div className="title-bar-app-brand">
            <div className="title-bar-app-icon">
              {Icons.universui}
            </div>
            <span className="title-bar-app-name">{APP_NAME}</span>
            <span className="title-bar-version">v{APP_VERSION}</span>
          </div>
        </div>

        {/* Center section: Command center */}
        <div
          className="title-bar-command-center"
          onClick={handleCommandPalette}
          title="Search commands (Cmd+P)"
        >
          {Icons.search}
          <span className="title-bar-command-text">
            {currentDocument
              ? `${APP_NAME} • ${currentDocument}`
              : `${APP_NAME} — Local-first Document Hub`}
          </span>
        </div>

        {/* Right section: Panel toggles + Settings */}
        <div className="title-bar-right">
          {/* VS Code-style panel toggle controls */}
          <div className="title-bar-controls">
            {onToggleSidebar && (
              <button
                className={`title-bar-action ${showSidebar ? 'active' : ''}`}
                onClick={onToggleSidebar}
                title="Toggle Sidebar (Cmd+B)"
              >
                {Icons.sidebar}
              </button>
            )}
            {onTogglePanel && (
              <button
                className={`title-bar-action ${showPanel ? 'active' : ''}`}
                onClick={onTogglePanel}
                title="Toggle Terminal Panel (Cmd+J)"
              >
                {Icons.terminal}
              </button>
            )}
            <button
              className={`title-bar-action ${showRightPanel ? 'active' : ''}`}
              onClick={onToggleRightPanel}
              title="Toggle OK Chat Panel"
            >
              {Icons.chat}
            </button>
          </div>

          {/* Settings */}
          <button
            className="title-bar-action"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('universui:openSettings'));
            }}
            title="Settings"
          >
            {Icons.settings}
          </button>
        </div>
      </div>
    </div>
  );
}
