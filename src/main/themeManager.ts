/**
 * Theme Manager — Handles theme loading, switching, and persistence
 * Supports VS Code Dark, Chunky, Material, and Fluent themes
 */

import { ipcMain } from 'electron';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';


export type Theme = 'vscode-dark' | 'vscode-light' | 'chunky' | 'material' | 'fluent';
export type IconSize = 'small' | 'medium' | 'large';
export type CornerRadius = '4px' | '8px' | '12px' | '16px';

interface ThemeSettings {
  theme: Theme;
  iconSize: IconSize;
  cornerRadius: CornerRadius;
  fontSize: number;
  sidebarWidth: number;
  showActivityLabels: boolean;
  compactMode: boolean;
}

const DEFAULT_SETTINGS: ThemeSettings = {
  theme: 'chunky',
  iconSize: 'medium',
  cornerRadius: '8px',
  fontSize: 14,
  sidebarWidth: 280,
  showActivityLabels: false,
  compactMode: false,
};

export class ThemeManager {
  private settingsPath: string;
  private settings: ThemeSettings;

  constructor() {
    const configDir = join(homedir(), '.config', 'universui');
    if (!existsSync(configDir)) {
      mkdirSync(configDir, { recursive: true });
    }
    this.settingsPath = join(configDir, 'theme-settings.json');
    this.settings = this.loadSettings();
  }

  private loadSettings(): ThemeSettings {
    try {
      if (existsSync(this.settingsPath)) {
        const data = JSON.parse(readFileSync(this.settingsPath, 'utf-8'));
        return { ...DEFAULT_SETTINGS, ...data };
      }
    } catch (err) {
      console.error('Failed to load theme settings:', err);
    }
    return { ...DEFAULT_SETTINGS };
  }

  private saveSettings(): void {
    try {
      writeFileSync(this.settingsPath, JSON.stringify(this.settings, null, 2));
    } catch (err) {
      console.error('Failed to save theme settings:', err);
    }
  }

  getSettings(): ThemeSettings {
    return { ...this.settings };
  }

  getTheme(): Theme {
    return this.settings.theme;
  }

  setTheme(theme: Theme): void {
    this.settings.theme = theme;
    this.saveSettings();
  }

  updateSettings(partial: Partial<ThemeSettings>): ThemeSettings {
    this.settings = { ...this.settings, ...partial };
    this.saveSettings();
    return this.getSettings();
  }

  /**
   * Get the CSS file path for the current theme
   */
  getThemeStylesheet(): string {
    const themeFiles: Record<Theme, string> = {
      'vscode-dark': '',
      'vscode-light': '',
      'chunky': '../renderer/styles/themes/chunky.css',
      'material': '../renderer/styles/themes/chunky.css', // Fallback to chunky
      'fluent': '../renderer/styles/themes/chunky.css',   // Fallback to chunky
    };
    return themeFiles[this.settings.theme] || '';
  }

  /**
   * Register IPC handlers for theme operations
   */
  registerIpcHandlers(): void {
    ipcMain.handle('theme:get-settings', () => {
      return this.getSettings();
    });

    ipcMain.handle('theme:set-theme', (_event, theme: Theme) => {
      this.setTheme(theme);
      return this.getSettings();
    });

    ipcMain.handle('theme:update-settings', (_event, partial: Partial<ThemeSettings>) => {
      return this.updateSettings(partial);
    });

    ipcMain.handle('theme:reset', () => {
      this.settings = { ...DEFAULT_SETTINGS };
      this.saveSettings();
      return this.getSettings();
    });
  }
}

export const themeManager = new ThemeManager();
