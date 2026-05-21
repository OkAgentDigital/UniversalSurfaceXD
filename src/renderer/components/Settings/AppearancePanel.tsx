import React, { useState } from 'react';
import { Button, ToggleSwitch, Card, Label, Badge } from 'flowbite-react';
import { useUSXTheme } from '../USX/USXThemeProvider';
import { Icon } from '../UI/Icon';
import type { FontSize } from '../../types/usx';

type IconSize = 'small' | 'medium' | 'large';
type CornerRadius = '4px' | '8px' | '12px' | '16px';

interface AppearanceSettings {
  iconSize: IconSize;
  cornerRadius: CornerRadius;
  sidebarWidth: number;
  showActivityLabels: boolean;
  compactMode: boolean;
}

const DEFAULT_SETTINGS: AppearanceSettings = {
  iconSize: 'medium',
  cornerRadius: '8px',
  sidebarWidth: 280,
  showActivityLabels: false,
  compactMode: false,
};

/** Font size progression for +/- controls */
const FONT_SIZES: FontSize[] = ['small', 'medium', 'large', 'xlarge', 'xxlarge'];

const FONT_SIZE_LABELS: Record<FontSize, string> = {
  small: 'S',
  medium: 'M',
  large: 'L',
  xlarge: 'XL',
  xxlarge: 'XXL',
};

export function AppearancePanel() {
  const [settings, setSettings] = useState<AppearanceSettings>(DEFAULT_SETTINGS);
  const usxTheme = useUSXTheme();

  const updateSetting = <K extends keyof AppearanceSettings>(
    key: K,
    value: AppearanceSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  /** Increase font size via USXThemeProvider */
  const increaseFontSize = () => {
    const idx = FONT_SIZES.indexOf(usxTheme.fontSize);
    if (idx < FONT_SIZES.length - 1) {
      usxTheme.setFontSize(FONT_SIZES[idx + 1]);
    }
  };

  /** Decrease font size via USXThemeProvider */
  const decreaseFontSize = () => {
    const idx = FONT_SIZES.indexOf(usxTheme.fontSize);
    if (idx > 0) {
      usxTheme.setFontSize(FONT_SIZES[idx - 1]);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Section: Icon Size */}
      <div className="p-4 border-b border-usxd-border">
        <Label value="Icon Size" className="text-usxd-secondary text-xs uppercase tracking-wider font-semibold mb-3 block" />
        <div className="flex gap-2">
          {[
            { id: 'small' as IconSize, label: 'Small', preview: 16 },
            { id: 'medium' as IconSize, label: 'Medium', preview: 20 },
            { id: 'large' as IconSize, label: 'Large', preview: 24 },
          ].map(size => (
            <button
              key={size.id}
              onClick={() => updateSetting('iconSize', size.id)}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-150 cursor-pointer ${
                settings.iconSize === size.id
                  ? 'bg-usxd-highlight/10 border-usxd-highlight text-usxd-highlight'
                  : 'bg-transparent border-usxd-border text-usxd-text hover:bg-[var(--vscode-sidebar-hover)] hover:border-[#4c4c4c]'
              }`}
            >
              <i
                className={`codicon codicon-symbol-misc ${
                  settings.iconSize === size.id ? 'text-usxd-highlight' : 'text-usxd-secondary'
                }`}
                style={{ fontSize: size.preview }}
              />
              <span className="text-xs">{size.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section: Corner Rounding */}
      <div className="p-4 border-b border-usxd-border">
        <Label value="Corner Rounding" className="text-usxd-secondary text-xs uppercase tracking-wider font-semibold mb-3 block" />
        <div className="flex gap-2">
          {(['4px', '8px', '12px', '16px'] as CornerRadius[]).map(radius => (
            <button
              key={radius}
              onClick={() => updateSetting('cornerRadius', radius)}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-150 cursor-pointer ${
                settings.cornerRadius === radius
                  ? 'bg-usxd-highlight/10 border-usxd-highlight text-usxd-highlight'
                  : 'bg-transparent border-usxd-border text-usxd-text hover:bg-[var(--vscode-sidebar-hover)] hover:border-[#4c4c4c]'
              }`}
            >
              <div
                className="w-6 h-6 bg-[#4c4c4c] border border-[#6c6c6c]"
                style={{ borderRadius: radius }}
              />
              <span className="text-xs">{radius}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section: Layout */}
      <div className="p-4 border-b border-usxd-border">
        <Label value="Layout" className="text-usxd-secondary text-xs uppercase tracking-wider font-semibold mb-3 block" />
        <div className="flex flex-col gap-4">
          {/* Font Size */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-usxd-text min-w-[100px]">Font Size</span>
            <div className="flex items-center gap-2">
              <Button
                size="xs"
                color="gray"
                onClick={decreaseFontSize}
                disabled={usxTheme.fontSize === 'small'}
                className="!p-1.5 !min-w-[28px] !h-[28px]"
              >
                <i className="codicon codicon-remove text-sm" />
              </Button>
              <Badge
                color="info"
                size="sm"
                className="!min-w-[36px] !text-center !font-medium"
              >
                {FONT_SIZE_LABELS[usxTheme.fontSize]}
              </Badge>
              <Button
                size="xs"
                color="gray"
                onClick={increaseFontSize}
                disabled={usxTheme.fontSize === 'xxlarge'}
                className="!p-1.5 !min-w-[28px] !h-[28px]"
              >
                <i className="codicon codicon-add text-sm" />
              </Button>
            </div>
          </div>

          {/* Sidebar Width */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-usxd-text min-w-[100px]">Sidebar Width</span>
            <div className="flex items-center gap-3 flex-1 max-w-[200px]">
              <input
                type="range"
                min={200}
                max={400}
                value={settings.sidebarWidth}
                onChange={e => updateSetting('sidebarWidth', parseInt(e.target.value))}
                className="flex-1 h-1 appearance-none bg-usxd-border rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-usxd-highlight [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-none"
              />
              <span className="text-xs text-usxd-secondary min-w-[36px] text-right">{settings.sidebarWidth}px</span>
            </div>
          </div>

          {/* Show Activity Labels */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-usxd-text min-w-[100px]">Activity Labels</span>
            <ToggleSwitch
              checked={settings.showActivityLabels}
              onChange={(checked: boolean) => updateSetting('showActivityLabels', checked)}
              label=""
            />
          </div>

          {/* Compact Mode */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-usxd-text min-w-[100px]">Compact Mode</span>
            <ToggleSwitch
              checked={settings.compactMode}
              onChange={(checked: boolean) => updateSetting('compactMode', checked)}
              label=""
            />
          </div>
        </div>
      </div>

      {/* Section: Preview */}
      <div className="p-4">
        <Label value="Preview" className="text-usxd-secondary text-xs uppercase tracking-wider font-semibold mb-3 block" />
        <Card className="!bg-usxd-surface !border-usxd-border">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Button size="xs" color="primary">Primary</Button>
              <Button size="xs" color="gray">Secondary</Button>
              <Button size="xs" color="light">Ghost</Button>
            </div>
            <input
              type="text"
              className="w-full p-2 text-sm bg-usxd-background border border-usxd-border rounded-usxd text-usxd-text placeholder:text-usxd-secondary focus:outline-none focus:border-usxd-highlight"
              placeholder="Sample input field..."
              readOnly
            />
            <div
              className="p-3 bg-[#2f2f2f] border border-usxd-border"
              style={{ borderRadius: settings.cornerRadius }}
            >
              <p className="text-sm text-usxd-secondary m-0">
                This is how cards, buttons, and inputs will look with your current settings.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
