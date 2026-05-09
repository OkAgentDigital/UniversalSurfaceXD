import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../shared/constants';
import { sonicScrewdriver } from './sonicScrewdriver';

export function registerContinueHandlers(): void {
  // OAuth login for Continue.dev
  ipcMain.handle(IPC_CHANNELS.CONTINUE_AUTH, async (_event, apiKey: string) => {
    try {
      await sonicScrewdriver.setSecret('continue_api_key', apiKey, 'custom', 'Continue.dev API key');

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // Sync extensions to Continue dashboard
  ipcMain.handle(IPC_CHANNELS.CONTINUE_SYNC_EXTENSIONS, async () => {
    try {
      const apiKey = await sonicScrewdriver.getSecret('continue_api_key');
      if (!apiKey) {
        return { success: false, error: 'Continue.dev not authenticated' };
      }

      // Get installed extensions
      const { execSync } = require('child_process');
      const result = execSync('npm ls --depth=0 --json 2>/dev/null', { encoding: 'utf-8' });
      const parsed = JSON.parse(result);
      const extensions = Object.keys(parsed.dependencies || {})
        .filter(name => name.startsWith('@'))
        .map(name => ({ name, version: parsed.dependencies[name]?.version || 'unknown' }));

      // In production, this would POST to Continue.dev API
      console.log('[Continue] Syncing extensions:', extensions);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // Run Continue checks on PRs
  ipcMain.handle(IPC_CHANNELS.CONTINUE_RUN_CHECKS, async () => {
    try {
      const apiKey = await sonicScrewdriver.getSecret('continue_api_key');
      if (!apiKey) {
        return { success: false, error: 'Continue.dev not authenticated' };
      }

      // In production, this would trigger Continue.dev check suite
      console.log('[Continue] Running check suite...');

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // Sync skills between Universui and Continue
  ipcMain.handle(IPC_CHANNELS.CONTINUE_SYNC_SKILLS, async () => {
    try {
      const apiKey = await sonicScrewdriver.getSecret('continue_api_key');
      if (!apiKey) {
        return { success: false, error: 'Continue.dev not authenticated' };
      }

      // In production, this would sync skills bidirectionally
      console.log('[Continue] Syncing skills...');

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });
}
