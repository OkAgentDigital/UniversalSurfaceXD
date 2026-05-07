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
}
