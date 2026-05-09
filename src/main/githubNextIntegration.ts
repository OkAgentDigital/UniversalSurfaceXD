import { ipcMain } from 'electron';
import { spawn } from 'child_process';
import { IPC_CHANNELS } from '../shared/constants';
import { sonicScrewdriver } from './sonicScrewdriver';

export function registerGithubNextHandlers(): void {
  // Run Agentic Workflow (gh-aw)
  ipcMain.handle(IPC_CHANNELS.GH_NEXT_RUN_WORKFLOW, async (_event, workflowFile: string) => {
    try {
      const token = await sonicScrewdriver.getSecret('github_token');
      if (!token) {
        return { success: false, error: 'GitHub token not configured' };
      }

      const proc = spawn('gh', ['aw', 'run', workflowFile], {
        cwd: process.cwd(),
        env: { ...process.env, GITHUB_TOKEN: token },
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      return new Promise((resolve) => {
        let output = '';
        proc.stdout?.on('data', (data: Buffer) => { output += data.toString(); });
        proc.stderr?.on('data', (data: Buffer) => { output += data.toString(); });
        proc.on('close', (code) => {
          if (code === 0) {
            resolve({ success: true, result: output });
          } else {
            resolve({ success: false, error: output || `Process exited with code ${code}` });
          }
        });
        proc.on('error', (err) => {
          resolve({ success: false, error: err.message });
        });
      });
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // Run Autoloop program
  ipcMain.handle(IPC_CHANNELS.GH_NEXT_RUN_AUTOLOOP, async (_event, programFile: string) => {
    try {
      const autoloopPath = './tools/autoloop/autoloop';
      const proc = spawn(autoloopPath, ['run', programFile], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      return new Promise((resolve) => {
        let output = '';
        proc.stdout?.on('data', (data: Buffer) => { output += data.toString(); });
        proc.stderr?.on('data', (data: Buffer) => { output += data.toString(); });
        proc.on('close', (code) => {
          if (code === 0) {
            resolve({ success: true, result: output });
          } else {
            resolve({ success: false, error: output || `Process exited with code ${code}` });
          }
        });
        proc.on('error', (err) => {
          resolve({ success: false, error: err.message });
        });
      });
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // Configure Continuous AI
  ipcMain.handle(IPC_CHANNELS.GH_NEXT_CONTINUOUS_AI, async (_event, config: { enabled: boolean; triggers: any[] }) => {
    try {
      const token = await sonicScrewdriver.getSecret('github_token');
      if (!token) {
        return { success: false, error: 'GitHub token not configured' };
      }

      // In production, this would configure GitHub webhooks and Actions
      console.log('[GitHub Next] Configuring Continuous AI:', config);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });
}
