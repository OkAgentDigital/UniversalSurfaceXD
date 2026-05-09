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
        {/* Left section: App icon + name + version */}
        <div className="title-bar-left">
          <div className="title-bar-app-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1" fill="#007acc" />
              <rect x="9" y="1" width="6" height="6" rx="1" fill="#4ec9b0" />
              <rect x="1" y="9" width="6" height="6" rx="1" fill="#ce9178" />
              <rect x="9" y="9" width="6" height="6" rx="1" fill="#c586c0" />
            </svg>
          </div>
          <span className="title-bar-app-name">{APP_NAME}</span>
          <span className="title-bar-version">v{APP_VERSION}</span>
        </div>

        {/* Center section: Command center */}
        <div
          className="title-bar-command-center"
          onClick={handleCommandPalette}
          title="Search commands (Cmd+P)"
        >
          <i className="codicon codicon-search"></i>
          <span className="title-bar-command-text">
            {currentDocument
              ? `${APP_NAME} • ${currentDocument}`
              : `${APP_NAME} — Local-first Document Hub`}
          </span>
        </div>

        {/* Right section: Layout controls + settings */}
        <div className="title-bar-right">
          {/* Sidebar toggle */}
          {onToggleSidebar && (
            <button
              className={`title-bar-action ${showSidebar ? 'active' : ''}`}
              onClick={onToggleSidebar}
              title="Toggle Sidebar"
            >
              <i className="codicon codicon-symbol-file"></i>
            </button>
          )}

          {/* Bottom panel toggle */}
          {onTogglePanel && (
            <button
              className={`title-bar-action ${showPanel ? 'active' : ''}`}
              onClick={onTogglePanel}
              title="Toggle Terminal Panel"
            >
              <i className="codicon codicon-terminal"></i>
            </button>
          )}

          {/* Right panel (AI Chat) toggle */}
          <button
            className={`title-bar-action ${showRightPanel ? 'active' : ''}`}
            onClick={onToggleRightPanel}
            title="Toggle AI Chat Panel"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2h12v10H6l-3 2V2z" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <circle cx="5.5" cy="7" r="0.8" fill="currentColor" />
              <circle cx="8" cy="7" r="0.8" fill="currentColor" />
              <circle cx="10.5" cy="7" r="0.8" fill="currentColor" />
            </svg>
          </button>

          {/* Separator */}
          <div className="title-bar-separator"></div>

          {/* Settings */}
          <button
            className="title-bar-action"
            onClick={() => {
              // Dispatch a custom event that the Workbench can listen for
              window.dispatchEvent(new CustomEvent('universui:openSettings'));
            }}
            title="Settings"
          >
            <i className="codicon codicon-settings-gear"></i>
          </button>

          {/* Account / User menu */}
          <button
            className="title-bar-action"
            onClick={() => setShowMenu(!showMenu)}
            title="Account"
          >
            <i className="codicon codicon-account"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
