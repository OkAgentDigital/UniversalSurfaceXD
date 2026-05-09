import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../UI/Card';
import { Button } from '../UI/Button';
import { Select } from '../UI/Input';

type Theme = 'vscode-dark' | 'chunky' | 'material' | 'fluent';
type IconSize = 'small' | 'medium' | 'large';
type CornerRadius = '4px' | '8px' | '12px' | '16px';

interface AppearanceSettings {
  theme: Theme;
  iconSize: IconSize;
  cornerRadius: CornerRadius;
  fontSize: number;
  sidebarWidth: number;
  showActivityLabels: boolean;
  compactMode: boolean;
}

const DEFAULT_SETTINGS: AppearanceSettings = {
  theme: 'chunky',
  iconSize: 'medium',
  cornerRadius: '8px',
  fontSize: 14,
  sidebarWidth: 280,
  showActivityLabels: false,
  compactMode: false,
};

export function AppearancePanel() {
  const [settings, setSettings] = useState<AppearanceSettings>(DEFAULT_SETTINGS);

  const updateSetting = <K extends keyof AppearanceSettings>(
    key: K,
    value: AppearanceSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // Apply theme change
    if (key === 'theme') {
      applyTheme(value as Theme);
    }
  };

  return (
    <div className="appearance-panel">
      <h3 className="sidebar-section-title">Appearance</h3>

      <div className="appearance-section">
        <h4 className="appearance-section-title">Theme</h4>
        <div className="theme-options">
          {[
            { id: 'vscode-dark' as Theme, label: 'VS Code Dark', icon: 'symbol-color' },
            { id: 'chunky' as Theme, label: 'Chunky (Modern)', icon: 'symbol-ruler' },
            { id: 'material' as Theme, label: 'Material Design', icon: 'symbol-misc' },
            { id: 'fluent' as Theme, label: 'Fluent/Notion', icon: 'symbol-namespace' },
          ].map(theme => (
            <button
              key={theme.id}
              className={`theme-option ${settings.theme === theme.id ? 'active' : ''}`}
              onClick={() => updateSetting('theme', theme.id)}
            >
              <i className={`codicon codicon-${theme.icon}`}></i>
              <span>{theme.label}</span>
              {settings.theme === theme.id && (
                <i className="codicon codicon-check theme-check"></i>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="appearance-section">
        <h4 className="appearance-section-title">Icon Size</h4>
        <div className="icon-size-options">
          {[
            { id: 'small' as IconSize, label: 'Small', preview: 16 },
            { id: 'medium' as IconSize, label: 'Medium', preview: 20 },
            { id: 'large' as IconSize, label: 'Large', preview: 24 },
          ].map(size => (
            <button
              key={size.id}
              className={`icon-size-option ${settings.iconSize === size.id ? 'active' : ''}`}
              onClick={() => updateSetting('iconSize', size.id)}
            >
              <i
                className="codicon codicon-symbol-misc"
                style={{ fontSize: size.preview }}
              ></i>
              <span>{size.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="appearance-section">
        <h4 className="appearance-section-title">Corner Rounding</h4>
        <div className="corner-radius-options">
          {(['4px', '8px', '12px', '16px'] as CornerRadius[]).map(radius => (
            <button
              key={radius}
              className={`corner-radius-option ${settings.cornerRadius === radius ? 'active' : ''}`}
              onClick={() => updateSetting('cornerRadius', radius)}
            >
              <div
                className="corner-radius-preview"
                style={{ borderRadius: radius }}
              ></div>
              <span>{radius}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="appearance-section">
        <h4 className="appearance-section-title">Layout</h4>
        <div className="layout-settings">
          <div className="layout-setting-row">
            <label>Font Size</label>
            <div className="font-size-control">
              <button
                className="size-btn"
                onClick={() => updateSetting('fontSize', Math.max(12, settings.fontSize - 1))}
              >
                <i className="codicon codicon-remove"></i>
              </button>
              <span className="font-size-value">{settings.fontSize}px</span>
              <button
                className="size-btn"
                onClick={() => updateSetting('fontSize', Math.min(24, settings.fontSize + 1))}
              >
                <i className="codicon codicon-add"></i>
              </button>
            </div>
          </div>

          <div className="layout-setting-row">
            <label>Sidebar Width</label>
            <input
              type="range"
              min={200}
              max={400}
              value={settings.sidebarWidth}
              onChange={e => updateSetting('sidebarWidth', parseInt(e.target.value))}
              className="sidebar-width-slider"
            />
            <span className="sidebar-width-value">{settings.sidebarWidth}px</span>
          </div>

          <div className="layout-setting-row">
            <label>Show Activity Labels</label>
            <button
              className={`toggle-switch ${settings.showActivityLabels ? 'active' : ''}`}
              onClick={() => updateSetting('showActivityLabels', !settings.showActivityLabels)}
            >
              <div className="toggle-knob"></div>
            </button>
          </div>

          <div className="layout-setting-row">
            <label>Compact Mode</label>
            <button
              className={`toggle-switch ${settings.compactMode ? 'active' : ''}`}
              onClick={() => updateSetting('compactMode', !settings.compactMode)}
            >
              <div className="toggle-knob"></div>
            </button>
          </div>
        </div>
      </div>

      <div className="appearance-section">
        <h4 className="appearance-section-title">Preview</h4>
        <Card variant="elevated" padding="md">
          <CardBody>
            <div className="preview-content">
              <div className="preview-button-row">
                <Button variant="primary" size="small">Primary</Button>
                <Button variant="secondary" size="small">Secondary</Button>
                <Button variant="ghost" size="small">Ghost</Button>
              </div>
              <div className="preview-input-row">
                <input
                  type="text"
                  className="ui-input ui-input-medium"
                  placeholder="Sample input field..."
                  readOnly
                />
              </div>
              <div className="preview-card-row">
                <div className="card" style={{ padding: '12px', borderRadius: settings.cornerRadius }}>
                  <p style={{ fontSize: '13px', color: '#b0b0b0' }}>
                    This is how cards, buttons, and inputs will look with your current settings.
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  // Remove all theme classes
  root.classList.remove('theme-vscode-dark', 'theme-chunky', 'theme-material', 'theme-fluent');

  // Add selected theme class
  root.classList.add(`theme-${theme}`);

  // Store preference
  localStorage.setItem('universui-theme', theme);
}
