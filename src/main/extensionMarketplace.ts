import { ipcMain } from 'electron';
import { execSync } from 'child_process';
import { IPC_CHANNELS } from '../shared/constants';
import { sonicScrewdriver } from './sonicScrewdriver';

const MARKETPLACE_ORGS = ['@okagentdigital', '@udosgo', '@devstudio'];

// Sample extensions for demo when npm registry is not available
const SAMPLE_EXTENSIONS = [
  {
    name: '@devstudio/extension-github',
    version: '1.0.0',
    publisher: 'devstudio' as const,
    description: 'Official GitHub integration with MCP server, issue tracking, and PR management',
    categories: ['Git/GitHub', 'AI/ML'],
    repository: 'https://github.com/devstudio/extension-github',
    license: 'MIT',
    downloads: 1200,
    rating: 4.5,
    publishedAt: '2026-01-15',
    universui: { minVersion: '1.3.0', panels: ['github'], commands: ['github:createIssue', 'github:listPRs'], mcpServers: ['github'] },
  },
  {
    name: '@devstudio/extension-deepseek',
    version: '1.0.0',
    publisher: 'devstudio' as const,
    description: 'DeepSeek AI integration with chat, code generation, and skill execution',
    categories: ['AI/ML'],
    repository: 'https://github.com/devstudio/extension-deepseek',
    license: 'MIT',
    downloads: 980,
    rating: 4.7,
    publishedAt: '2026-01-20',
    universui: { minVersion: '1.3.0', panels: ['ai-chat'], commands: ['deepseek:chat', 'deepseek:explain'], mcpServers: ['deepseek'] },
  },
  {
    name: '@devstudio/extension-autoloop',
    version: '1.0.0',
    publisher: 'devstudio' as const,
    description: 'Self-optimization UI and program runner for evolutionary SQLite optimization',
    categories: ['Workflows', 'AI/ML'],
    repository: 'https://github.com/devstudio/extension-autoloop',
    license: 'MIT',
    downloads: 650,
    rating: 4.3,
    publishedAt: '2026-02-01',
    universui: { minVersion: '1.3.0', panels: ['autoloop'], commands: ['autoloop:run', 'autoloop:status'] },
  },
  {
    name: '@devstudio/extension-skills',
    version: '1.0.0',
    publisher: 'devstudio' as const,
    description: 'Markdown skill loader for agent instructions and automated workflows',
    categories: ['Skills', 'Workflows'],
    repository: 'https://github.com/devstudio/extension-skills',
    license: 'MIT',
    downloads: 430,
    rating: 4.1,
    publishedAt: '2026-02-10',
    universui: { minVersion: '1.3.0', panels: ['skills'], commands: ['skills:load', 'skills:run'], skills: ['skill-loader'] },
  },
  {
    name: '@udosgo/extension-retro-gaming',
    version: '0.5.0',
    publisher: 'udosgo' as const,
    description: 'Retro gaming CHASIS skin and lens engine for emulator integration',
    categories: ['Gaming'],
    repository: 'https://github.com/udosgo/extension-retro-gaming',
    license: 'MIT',
    downloads: 456,
    rating: 4.8,
    publishedAt: '2026-03-01',
    universui: { minVersion: '1.4.0', panels: ['retro'], commands: ['retro:launch', 'retro:config'] },
  },
  {
    name: '@okagentdigital/extension-enterprise-audit',
    version: '1.0.0',
    publisher: 'okagentdigital' as const,
    description: 'Enterprise compliance logging, audit trails, and reporting for regulated environments',
    categories: ['Enterprise', 'Security'],
    repository: 'https://github.com/okagentdigital/extension-enterprise-audit',
    license: 'MIT',
    downloads: 89,
    rating: 4.2,
    publishedAt: '2026-03-15',
    universui: { minVersion: '1.4.0', panels: ['audit'], commands: ['audit:report', 'audit:export'] },
  },
];

export function registerMarketplaceHandlers(): void {
  // Search extensions across all three orgs
  ipcMain.handle(IPC_CHANNELS.EXTENSION_MARKETPLACE_SEARCH, async (_event, query?: string) => {
    try {
      // Try npm search first
      const token = await sonicScrewdriver.getSecret('github_token');
      const registry = 'https://npm.pkg.github.com/';
      const results: any[] = [];

      for (const org of MARKETPLACE_ORGS) {
        try {
          const searchQuery = query ? `${org} ${query}` : org;
          const result = execSync(
            `npm search ${searchQuery} --registry=${registry} --json 2>/dev/null`,
            { encoding: 'utf-8', timeout: 5000 }
          );
          const parsed = JSON.parse(result);
          if (Array.isArray(parsed)) {
            results.push(...parsed.map((pkg: any) => ({
              name: pkg.name,
              version: pkg.version,
              publisher: org.replace('@', '') as any,
              description: pkg.description,
              categories: pkg.keywords || [],
              repository: pkg.repository?.url || '',
              license: pkg.license || 'MIT',
              downloads: pkg.downloads || 0,
              publishedAt: pkg.date || '',
              universui: { minVersion: '1.3.0' },
            })));
          }
        } catch {
          // npm search failed, skip this org
        }
      }

      if (results.length > 0) {
        return results;
      }
    } catch {
      // Fallback to sample data
    }

    // Return sample data filtered by query
    if (query) {
      const q = query.toLowerCase();
      return SAMPLE_EXTENSIONS.filter(ext =>
        ext.name.toLowerCase().includes(q) ||
        ext.description.toLowerCase().includes(q) ||
        ext.categories.some(c => c.toLowerCase().includes(q))
      );
    }
    return SAMPLE_EXTENSIONS;
  });

  // Install extension from registry
  ipcMain.handle(IPC_CHANNELS.EXTENSION_MARKETPLACE_INSTALL, async (_event, packageName: string) => {
    try {
      const token = await sonicScrewdriver.getSecret('github_token');
      const env = { ...process.env };
      if (token) {
        env['GITHUB_TOKEN'] = token;
      }

      execSync(`npm install ${packageName} --registry=https://npm.pkg.github.com/`, {
        cwd: process.cwd(),
        env,
        stdio: 'pipe',
        timeout: 60000,
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // Uninstall extension
  ipcMain.handle(IPC_CHANNELS.EXTENSION_MARKETPLACE_UNINSTALL, async (_event, packageName: string) => {
    try {
      execSync(`npm uninstall ${packageName}`, {
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 30000,
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // List installed extensions
  ipcMain.handle(IPC_CHANNELS.EXTENSION_MARKETPLACE_LIST_INSTALLED, async () => {
    try {
      const result = execSync('npm ls --depth=0 --json 2>/dev/null', {
        cwd: process.cwd(),
        encoding: 'utf-8',
      });
      const parsed = JSON.parse(result);
      const dependencies = parsed.dependencies || {};
      return Object.entries(dependencies)
        .filter(([name]) => name.startsWith('@'))
        .map(([name, info]: [string, any]) => ({
          name,
          version: info.version || 'unknown',
          publisher: name.split('/')[0].replace('@', '') as any,
          description: '',
          categories: [],
          repository: '',
          license: 'MIT',
          downloads: 0,
          publishedAt: '',
          universui: { minVersion: '1.3.0' },
        }));
    } catch {
      return [];
    }
  });

  // Check for updates
  ipcMain.handle(IPC_CHANNELS.EXTENSION_MARKETPLACE_CHECK_UPDATES, async () => {
    try {
      const result = execSync('npm outdated --json 2>/dev/null', {
        cwd: process.cwd(),
        encoding: 'utf-8',
      });
      const parsed = JSON.parse(result);
      return Object.entries(parsed).map(([name, info]: [string, any]) => ({
        name,
        current: info.current || 'unknown',
        latest: info.latest || 'unknown',
      }));
    } catch {
      return [];
    }
  });
}
