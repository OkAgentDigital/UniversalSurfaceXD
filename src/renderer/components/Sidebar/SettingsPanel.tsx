import React, { useState, useEffect } from 'react';
import { Button, Select, Label, Badge } from 'flowbite-react';
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

const FONT_SIZE_LABELS: Record<FontSize, string> = {
  small: 'S',
  medium: 'M',
  large: 'L',
  xlarge: 'XL',
  xxlarge: 'XXL',
};

export function SettingsPanel() {
  const [theme, setTheme] = useState<'dark' | 'light'>((DEFAULT_SETTINGS.theme as 'dark' | 'light'));
  const [autoSaveInterval, setAutoSaveInterval] = useState(DEFAULT_SETTINGS.autoSaveInterval);
  const [fontFamily, setFontFamily] = useState(DEFAULT_SETTINGS.fontFamily);
  const [saved, setSaved] = useState(false);

  // USXThemeProvider wraps the entire app (in App.tsx), so this is always available
  const usxTheme = useUSXTheme();

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
    if (usxTheme.theme !== newTheme) {
      usxTheme.toggleTheme();
    }
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

  const handleAutoSaveChange = (value: number) => {
    setAutoSaveInterval(value);
    saveSetting('autoSaveInterval', value.toString());
  };

  /** Determine which font pack is active */
  const getActivePackIndex = (): number => {
    return FONT_PACKS.findIndex((pack) =>
      Object.entries(pack.fonts).every(
        ([role, fontName]) => usxTheme.fontSelection[role as keyof typeof usxTheme.fontSelection] === fontName
      )
    );
  };

  /** Apply a font pack preset */
  const applyFontPack = (packIndex: number) => {
    const pack = FONT_PACKS[packIndex];
    (Object.entries(pack.fonts) as Array<[keyof typeof pack.fonts, string]>).forEach(
      ([role, fontName]) => usxTheme.setFontRole(role as FontRole, fontName)
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
      <div className="sidebar-content px-3 py-4 flex flex-col gap-5">
        {saved && (
          <div className="text-xs px-2 py-1 rounded bg-green-900/30 text-green-400 text-center">
            ✓ Settings saved
          </div>
        )}

        {/* Theme */}
        <div className="flex flex-col gap-1.5">
          <Label value="Theme" className="text-usxd-secondary text-xs uppercase tracking-wider font-semibold" />
          <div className="flex gap-2">
            <Button
              size="xs"
              color={theme === 'dark' ? 'primary' : 'gray'}
              onClick={() => handleThemeChange('dark')}
              className="flex-1"
            >
              <i className="codicon codicon-color-mode mr-1"></i> Dark
            </Button>
            <Button
              size="xs"
              color={theme === 'light' ? 'primary' : 'gray'}
              onClick={() => handleThemeChange('light')}
              className="flex-1"
            >
              <i className="codicon codicon-light-bulb mr-1"></i> Light
            </Button>
          </div>
        </div>

        {/* Font Size */}
        <div className="flex flex-col gap-1.5">
          <Label value="Font Size" className="text-usxd-secondary text-xs uppercase tracking-wider font-semibold" />
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

        {/* Auto-save Interval */}
        <div className="flex flex-col gap-1.5">
          <Label value="Auto-save Interval" className="text-usxd-secondary text-xs uppercase tracking-wider font-semibold" />
          <Select
            value={autoSaveInterval}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleAutoSaveChange(parseInt(e.target.value))}
            sizing="sm"
          >
            <option value={500}>500ms (Fast)</option>
            <option value={1000}>1 second (Default)</option>
            <option value={2000}>2 seconds</option>
            <option value={5000}>5 seconds</option>
            <option value={10000}>10 seconds</option>
          </Select>
        </div>

        {/* Editor Font */}
        <div className="flex flex-col gap-1.5">
          <Label value="Editor Font" className="text-usxd-secondary text-xs uppercase tracking-wider font-semibold" />
          <input
            type="text"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            onBlur={() => saveSetting('fontFamily', fontFamily)}
            className="w-full p-2 text-sm bg-usxd-background border border-usxd-border rounded-usxd text-usxd-text placeholder:text-usxd-secondary focus:outline-none focus:border-usxd-highlight"
            style={{ fontFamily: fontFamily }}
          />
        </div>

        {/* USX Font Pack Settings */}
        <div className="flex flex-col gap-3 pt-3 border-t border-usxd-border">
          <Label value="USX Font Pack" className="text-usxd-text text-sm font-semibold flex items-center gap-1.5">
            <i className="codicon codicon-font"></i> USX Font Pack
          </Label>

          {/* 3-Mode Font Pack Toggle */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-usxd-secondary">Quick Presets</span>
            <div className="flex gap-1.5">
              {FONT_PACKS.map((pack, idx) => (
                <button
                  key={pack.id}
                  onClick={() => applyFontPack(idx)}
                  title={pack.description}
                  className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg border transition-all duration-150 cursor-pointer ${
                    getActivePackIndex() === idx
                      ? 'bg-usxd-highlight/10 border-usxd-highlight text-usxd-highlight'
                      : 'bg-usxd-background border-usxd-border text-usxd-text hover:bg-[var(--vscode-sidebar-hover)]'
                  }`}
                >
                  <span className="text-lg">{pack.icon}</span>
                  <span className={`text-xs ${getActivePackIndex() === idx ? 'font-semibold' : ''}`}>{pack.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Per-Role Font Selectors */}
          {(Object.keys(FONT_OPTIONS) as FontRole[]).map((role) => (
            <div key={role} className="flex flex-col gap-1">
              <span className="text-xs text-usxd-secondary">{ROLE_LABELS[role]}</span>
              <Select
                value={usxTheme.fontSelection[role]}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => usxTheme.setFontRole(role, e.target.value)}
                sizing="sm"
              >
                {FONT_OPTIONS[role].map((font) => (
                  <option key={font.name} value={font.name}>
                    {font.name}
                  </option>
                ))}
              </Select>
              <span className="text-[10px] text-usxd-secondary/60">{ROLE_DESCRIPTIONS[role]}</span>
            </div>
          ))}

          {/* Live Preview */}
          <div className="mt-2 p-3 bg-usxd-background rounded-lg border border-usxd-border flex flex-col gap-2">
            <span className="text-[10px] text-usxd-secondary/60 mb-1">Preview</span>
            <p className="text-sm text-usxd-text m-0" style={{ fontFamily: 'var(--usx-font-family-body)' }}>
              The quick brown fox jumps over the lazy dog. (Body)
            </p>
            <div className="text-sm font-bold text-usxd-text" style={{ fontFamily: 'var(--usx-font-family-desktop)' }}>
              Desktop Title Preview
            </div>
            <div className="text-sm font-semibold text-usxd-text" style={{ fontFamily: 'var(--usx-font-family-document)' }}>
              Document Title Preview
            </div>
            <code className="text-xs text-[#ce9178]" style={{ fontFamily: 'var(--usx-font-family-mono)' }}>
              console.log('Code preview');
            </code>
            <button
              className="self-start text-xs px-3 py-1 rounded border border-usxd-highlight bg-usxd-highlight text-usxd-highlight-text cursor-pointer"
              style={{ fontFamily: 'var(--usx-font-family-ui)' }}
            >
              Button Preview
            </button>
          </div>
        </div>

        {/* About */}
        <div className="flex flex-col gap-1.5 pt-3 border-t border-usxd-border">
          <Label value="About Surface" className="text-usxd-secondary text-xs uppercase tracking-wider font-semibold" />
          <div className="text-xs text-usxd-secondary leading-relaxed">
            <div>Version: 1.5.0</div>
            <div>Local-first desktop editor</div>
            <div>Electron + React + Monaco + SQLite</div>
            <div className="mt-2 text-[10px] text-usxd-secondary/60">
              USX Font Pack: SourceCodePro, SF Pro, Poppins, Quicksand, ChicagoFLF, Teletext50, PetMe128, PressStart2P
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
