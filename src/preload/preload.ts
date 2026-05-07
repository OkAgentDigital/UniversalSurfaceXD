import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/constants';

contextBridge.exposeInMainWorld('electron', {
  // Document operations
  getDocument: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.GET_DOCUMENT, id),
  saveDocument: (doc: any) => ipcRenderer.invoke(IPC_CHANNELS.SAVE_DOCUMENT, doc),
  listDocuments: () => ipcRenderer.invoke(IPC_CHANNELS.LIST_DOCUMENTS),
  deleteDocument: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.DELETE_DOCUMENT, id),

  // Task operations
  getAllTasks: () => ipcRenderer.invoke(IPC_CHANNELS.GET_ALL_TASKS),
  saveTask: (task: any) => ipcRenderer.invoke(IPC_CHANNELS.SAVE_TASK, task),
  deleteTask: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.DELETE_TASK, id),

  // View operations
  getViews: () => ipcRenderer.invoke(IPC_CHANNELS.GET_VIEWS),
  saveView: (view: any) => ipcRenderer.invoke(IPC_CHANNELS.SAVE_VIEW, view),

  // Search
  search: (query: string) => ipcRenderer.invoke(IPC_CHANNELS.SEARCH, query),

  // Git operations
  getGitBranch: () => ipcRenderer.invoke(IPC_CHANNELS.GIT_BRANCH),
  getGitStatus: () => ipcRenderer.invoke(IPC_CHANNELS.GIT_STATUS),
  gitCommit: (message: string) => ipcRenderer.invoke(IPC_CHANNELS.GIT_COMMIT, message),
  gitPush: () => ipcRenderer.invoke(IPC_CHANNELS.GIT_PUSH),
  gitPull: () => ipcRenderer.invoke(IPC_CHANNELS.GIT_PULL),
  getGitLog: () => ipcRenderer.invoke(IPC_CHANNELS.GIT_LOG),

  // Terminal operations
  terminalSpawn: (terminalId: string) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_SPAWN, terminalId),
  terminalWrite: (terminalId: string, data: string) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_WRITE, terminalId, data),
  terminalResize: (terminalId: string, cols: number, rows: number) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_RESIZE, terminalId, cols, rows),
  terminalKill: (terminalId: string) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_KILL, terminalId),
  onTerminalData: (callback: (terminalId: string, data: string) => void) => {
    const handler = (_event: any, terminalId: string, data: string) => callback(terminalId, data);
    ipcRenderer.on(IPC_CHANNELS.TERMINAL_DATA, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.TERMINAL_DATA, handler);
  },

  // Settings
  getSettings: () => ipcRenderer.invoke(IPC_CHANNELS.GET_SETTINGS),
  saveSetting: (key: string, value: string) => ipcRenderer.invoke(IPC_CHANNELS.SAVE_SETTINGS, key, value),
});
