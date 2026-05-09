import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { UniversuiMode } from '../renderer/types';

interface ModeConfig {
  homeDir: string;
  databases: {
    tasks: string;
    documents: string;
    views: string;
  };
  mcpServers: string[];
  defaultExtensions: string[];
  features: {
    git: boolean;
    terminal: boolean;
    autoloop: boolean;
    skills: boolean;
  };
}

const MODE_CONFIGS: Record<UniversuiMode, ModeConfig> = {
  dev: {
    homeDir: path.join(app.getPath('home'), 'Code'),
    databases: {
      tasks: path.join(app.getPath('home'), 'Code', '.universui', 'tasks.db'),
      documents: path.join(app.getPath('home'), 'Code', '.universui', 'documents.db'),
      views: path.join(app.getPath('home'), 'Code', '.universui', 'views.db'),
    },
    mcpServers: ['github', 'deepseek'],
    defaultExtensions: ['@devstudio/extension-github', '@devstudio/extension-autoloop'],
    features: { git: true, terminal: true, autoloop: true, skills: true },
  },
  docs: {
    homeDir: path.join(app.getPath('home'), 'Vault'),
    databases: {
      tasks: path.join(app.getPath('home'), 'Vault', '.universui', 'tasks.db'),
      documents: path.join(app.getPath('home'), 'Vault', '.universui', 'documents.db'),
      views: path.join(app.getPath('home'), 'Vault', '.universui', 'views.db'),
    },
    mcpServers: ['deepseek'],
    defaultExtensions: ['@devstudio/extension-deepseek', '@devstudio/extension-skills'],
    features: { git: false, terminal: false, autoloop: false, skills: true },
  },
};

class ModeManager {
  private currentMode: UniversuiMode = 'docs';
  private configPath: string;

  constructor() {
    this.configPath = path.join(app.getPath('userData'), 'mode.json');
    this.loadMode();
  }

  private loadMode(): void {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
        if (data.mode === 'dev' || data.mode === 'docs') {
          this.currentMode = data.mode;
        }
      }
    } catch {
      this.currentMode = 'docs';
    }
  }

  private saveMode(): void {
    try {
      const dir = path.dirname(this.configPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.configPath, JSON.stringify({ mode: this.currentMode }, null, 2));
    } catch (err) {
      console.error('Failed to save mode:', err);
    }
  }

  getMode(): UniversuiMode {
    return this.currentMode;
  }

  setMode(mode: UniversuiMode): void {
    this.currentMode = mode;
    this.saveMode();
  }

  getConfig(): ModeConfig {
    return MODE_CONFIGS[this.currentMode];
  }

  getHomeDir(): string {
    return this.getConfig().homeDir;
  }

  getDatabasePaths() {
    return this.getConfig().databases;
  }

  getMcpServers(): string[] {
    return this.getConfig().mcpServers;
  }

  getDefaultExtensions(): string[] {
    return this.getConfig().defaultExtensions;
  }

  getFeatures() {
    return this.getConfig().features;
  }

  // Parse CLI args for mode
  static detectModeFromArgs(): UniversuiMode {
    const args = process.argv.slice(2);
    if (args.includes('--dev') || args.includes('--devonly')) {
      return 'dev';
    }
    return 'docs';
  }
}

export const modeManager = new ModeManager();
export type { UniversuiMode, ModeConfig };
