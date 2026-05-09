import { ipcMain, BrowserWindow } from 'electron';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import {
  getDocument,
  saveDocument,
  listDocuments,
  deleteDocument,
  getAllTasks,
  saveTask,
  deleteTask,
  getViews,
  saveView,
  search,
  getSetting,
  saveSetting,
  getAllSettings,
} from './database';
import { IPC_CHANNELS } from '../shared/constants';
import { modeManager } from './modeManager';

// Track terminal processes
const terminals = new Map<string, ChildProcess>();

export function registerIpcHandlers(): void {
  // Document handlers
  ipcMain.handle(IPC_CHANNELS.GET_DOCUMENT, async (_event, id: string) => {
    return getDocument(id);
  });

  ipcMain.handle(IPC_CHANNELS.SAVE_DOCUMENT, async (_event, doc) => {
    saveDocument(doc);
  });

  ipcMain.handle(IPC_CHANNELS.LIST_DOCUMENTS, async () => {
    return listDocuments();
  });

  ipcMain.handle(IPC_CHANNELS.DELETE_DOCUMENT, async (_event, id: string) => {
    deleteDocument(id);
  });

  // Task handlers
  ipcMain.handle(IPC_CHANNELS.GET_ALL_TASKS, async () => {
    return getAllTasks();
  });

  ipcMain.handle(IPC_CHANNELS.SAVE_TASK, async (_event, task) => {
    saveTask(task);
  });

  ipcMain.handle(IPC_CHANNELS.DELETE_TASK, async (_event, id: string) => {
    deleteTask(id);
  });

  // View handlers
  ipcMain.handle(IPC_CHANNELS.GET_VIEWS, async () => {
    return getViews();
  });

  ipcMain.handle(IPC_CHANNELS.SAVE_VIEW, async (_event, view) => {
    saveView(view);
  });

  // Search handler
  ipcMain.handle(IPC_CHANNELS.SEARCH, async (_event, query: string) => {
    if (!query || query.trim().length === 0) return [];
    return search(query.trim());
  });

  // Git handlers
  ipcMain.handle(IPC_CHANNELS.GIT_BRANCH, async () => {
    try {
      const { execSync } = require('child_process');
      const branch = execSync('git branch --show-current', { cwd: process.cwd() }).toString().trim();
      return branch || 'main';
    } catch {
      return 'main';
    }
  });

  ipcMain.handle(IPC_CHANNELS.GIT_STATUS, async () => {
    try {
      const { execSync } = require('child_process');
      const status = execSync('git status --porcelain', { cwd: process.cwd() }).toString().trim();
      if (!status) return [];
      return status.split('\n').map((line: string) => {
        const statusChar = line.substring(0, 2).trim();
        const filePath = line.substring(3);
        return { status: statusChar, file: filePath };
      });
    } catch {
      return [];
    }
  });

  ipcMain.handle(IPC_CHANNELS.GIT_COMMIT, async (_event, message: string) => {
    try {
      const { execSync } = require('child_process');
      execSync('git add -A', { cwd: process.cwd() });
      execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { cwd: process.cwd() });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.GIT_PUSH, async () => {
    try {
      const { execSync } = require('child_process');
      execSync('git push', { cwd: process.cwd() });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.GIT_PULL, async () => {
    try {
      const { execSync } = require('child_process');
      execSync('git pull', { cwd: process.cwd() });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.GIT_LOG, async () => {
    try {
      const { execSync } = require('child_process');
      const log = execSync('git log --oneline -10', { cwd: process.cwd() }).toString().trim();
      if (!log) return [];
      return log.split('\n').map((line: string) => {
        const [hash, ...msgParts] = line.split(' ');
        return { hash, message: msgParts.join(' ') };
      });
    } catch {
      return [];
    }
  });

  // Terminal handlers
  ipcMain.handle(IPC_CHANNELS.TERMINAL_SPAWN, async (event, terminalId: string) => {
    const shell = process.platform === 'win32' ? 'cmd.exe' : '/bin/zsh';
    const term = spawn(shell, [], {
      cwd: process.cwd(),
      env: { ...process.env, TERM: 'xterm-256color' },
    });

    const win = BrowserWindow.fromWebContents(event.sender);
    
    term.stdout?.on('data', (data: Buffer) => {
      win?.webContents.send(IPC_CHANNELS.TERMINAL_DATA, terminalId, data.toString('utf-8'));
    });

    term.stderr?.on('data', (data: Buffer) => {
      win?.webContents.send(IPC_CHANNELS.TERMINAL_DATA, terminalId, data.toString('utf-8'));
    });

    term.on('exit', () => {
      terminals.delete(terminalId);
    });

    terminals.set(terminalId, term);
  });

  ipcMain.handle(IPC_CHANNELS.TERMINAL_WRITE, async (_event, terminalId: string, data: string) => {
    const term = terminals.get(terminalId);
    if (term && term.stdin) {
      term.stdin.write(data);
    }
  });

  ipcMain.handle(IPC_CHANNELS.TERMINAL_RESIZE, async (_event, terminalId: string, cols: number, rows: number) => {
    // node-pty handles resize, but for basic child_process we can't resize
  });

  ipcMain.handle(IPC_CHANNELS.TERMINAL_KILL, async (_event, terminalId: string) => {
    const term = terminals.get(terminalId);
    if (term) {
      term.kill();
      terminals.delete(terminalId);
    }
  });

  // Settings handlers
  ipcMain.handle(IPC_CHANNELS.GET_SETTINGS, async () => {
    return getAllSettings();
  });

  ipcMain.handle(IPC_CHANNELS.SAVE_SETTINGS, async (_event, key: string, value: string) => {
    saveSetting(key, value);
  });

  // ============================================================
  // Mode Manager Handlers
  // ============================================================
  ipcMain.handle(IPC_CHANNELS.MODE_GET, async () => {
    return modeManager.getMode();
  });

  ipcMain.handle(IPC_CHANNELS.MODE_SET, async (_event, mode: 'dev' | 'docs') => {
    modeManager.setMode(mode);
  });

  // ============================================================
  // Agents Handlers (stub — returns sample data)
  // ============================================================
  ipcMain.handle(IPC_CHANNELS.AGENTS_LIST, async () => {
    return [
      {
        id: 'deepseek-coder',
        name: 'DeepSeek Coder',
        type: 'deepseek',
        status: 'idle',
        health: 98,
        creditBalance: 500,
        rateLimit: { used: 12, limit: 60, resetsAt: Date.now() + 3600000 },
        tasksCompleted: 47,
      },
      {
        id: 'github-assistant',
        name: 'GitHub Assistant',
        type: 'github',
        status: 'running',
        health: 100,
        rateLimit: { used: 234, limit: 5000, resetsAt: Date.now() + 3600000 },
        tasksCompleted: 128,
      },
    ];
  });

  ipcMain.handle(IPC_CHANNELS.AGENTS_START, async (_event, id: string) => {
    console.log(`Starting agent: ${id}`);
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.AGENTS_STOP, async (_event, id: string) => {
    console.log(`Stopping agent: ${id}`);
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.AGENTS_HEALTH, async (_event, id: string) => {
    return { health: 95, status: 'running' };
  });

  // ============================================================
  // Skills Handlers (stub)
  // ============================================================
  ipcMain.handle(IPC_CHANNELS.SKILLS_LIST, async () => {
    return [
      { id: 'triage-issues', name: 'Triage Issues', description: 'Auto-triage new GitHub issues', trigger: 'event', eventType: 'issue.created', action: 'triage', enabled: true },
      { id: 'review-prs', name: 'Review PRs', description: 'AI-powered PR review', trigger: 'event', eventType: 'pr.opened', action: 'review', enabled: true },
      { id: 'daily-docs', name: 'Update Docs', description: 'Daily documentation refresh', trigger: 'schedule', eventType: 'schedule.daily', action: 'docs-update', enabled: false },
      { id: 'optimize-queries', name: 'Optimize Queries', description: 'Run Autoloop on SQLite queries', trigger: 'manual', action: 'autoloop', enabled: true },
    ];
  });

  ipcMain.handle(IPC_CHANNELS.SKILLS_ENABLE, async (_event, id: string) => {
    console.log(`Enabling skill: ${id}`);
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.SKILLS_DISABLE, async (_event, id: string) => {
    console.log(`Disabling skill: ${id}`);
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.SKILLS_RUN, async (_event, id: string) => {
    console.log(`Running skill: ${id}`);
    return { success: true, result: `Skill ${id} executed successfully` };
  });

  // ============================================================
  // Checks Handlers (stub)
  // ============================================================
  ipcMain.handle(IPC_CHANNELS.CHECKS_LIST, async () => {
    return [
      { id: 'lint', name: 'ESLint', status: 'pass', duration: 1200, timestamp: new Date(), output: 'No errors', repository: 'universui' },
      { id: 'typecheck', name: 'TypeScript', status: 'pass', duration: 3400, timestamp: new Date(), output: 'No type errors', repository: 'universui' },
      { id: 'test', name: 'Unit Tests', status: 'running', duration: 0, timestamp: new Date(), output: 'Running...', repository: 'universui' },
    ];
  });

  ipcMain.handle(IPC_CHANNELS.CHECKS_RUN, async (_event, id: string) => {
    console.log(`Running check: ${id}`);
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.CHECKS_RESULTS, async (_event, id: string) => {
    return { id, name: 'Check', status: 'pass', duration: 1000, timestamp: new Date(), output: 'All passed', repository: 'universui' };
  });

  // ============================================================
  // System Tasks Handlers (stub)
  // ============================================================
  ipcMain.handle(IPC_CHANNELS.TASKS_LIST, async () => {
    return [
      { id: 't1', type: 'agent', status: 'running', priority: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 't2', type: 'workflow', status: 'completed', priority: 2, createdAt: new Date(Date.now() - 60000), updatedAt: new Date() },
      { id: 't3', type: 'autoloop', status: 'failed', priority: 3, createdAt: new Date(Date.now() - 120000), updatedAt: new Date() },
    ];
  });

  ipcMain.handle(IPC_CHANNELS.TASKS_CANCEL, async (_event, id: string) => {
    console.log(`Cancelling task: ${id}`);
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.TASKS_RETRY, async (_event, id: string) => {
    console.log(`Retrying task: ${id}`);
    return { success: true };
  });

  // ============================================================
  // Variables Handlers (stub)
  // ============================================================
  ipcMain.handle(IPC_CHANNELS.VARIABLES_LIST, async () => {
    return [
      { key: 'GITHUB_TOKEN', value: 'ghp_****', scope: 'user', encrypted: true, usedBy: ['github-mcp', 'git-operations'] },
      { key: 'DEEPSEEK_API_KEY', value: 'sk-****', scope: 'user', encrypted: true, usedBy: ['deepseek-agent'] },
      { key: 'NODE_ENV', value: 'development', scope: 'workspace', encrypted: false, usedBy: ['build-scripts'] },
    ];
  });

  ipcMain.handle(IPC_CHANNELS.VARIABLES_SET, async (_event, key: string, value: string, scope: string, encrypted: boolean) => {
    console.log(`Setting variable: ${key} (scope: ${scope}, encrypted: ${encrypted})`);
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.VARIABLES_DELETE, async (_event, key: string) => {
    console.log(`Deleting variable: ${key}`);
    return { success: true };
  });

  // ============================================================
  // Workflows Handlers (stub)
  // ============================================================
  ipcMain.handle(IPC_CHANNELS.WORKFLOWS_LIST, async () => {
    return [
      { id: 'ci', name: 'CI Pipeline', file: '.github/workflows/ci.yml', type: 'github-actions', status: 'active', runs: 142, lastRun: new Date() },
      { id: 'release', name: 'Release', file: '.github/workflows/release.md', type: 'gh-aw', status: 'active', runs: 12, lastRun: new Date(Date.now() - 86400000) },
      { id: 'optimize', name: 'Optimize SQLite', file: 'programs/optimize-sqlite-queries.md', type: 'autoloop', status: 'disabled', runs: 8 },
    ];
  });

  ipcMain.handle(IPC_CHANNELS.WORKFLOWS_RUN, async (_event, id: string) => {
    console.log(`Running workflow: ${id}`);
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.WORKFLOWS_DISABLE, async (_event, id: string) => {
    console.log(`Disabling workflow: ${id}`);
    return { success: true };
  });
}
