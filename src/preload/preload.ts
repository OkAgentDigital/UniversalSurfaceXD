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

  // AI / DeepSeek operations
  aiChat: (request: { messages: { role: string; content: string }[]; stream?: boolean }) =>
    ipcRenderer.invoke(IPC_CHANNELS.AI_CHAT, request),
  aiExplain: (params: { text: string; context?: string }) =>
    ipcRenderer.invoke(IPC_CHANNELS.AI_EXPLAIN, params),

  // MCP (GitHub) operations — multi-server
  mcpStatus: () => ipcRenderer.invoke(IPC_CHANNELS.MCP_STATUS),
  mcpServerStatus: (serverId: string) => ipcRenderer.invoke(IPC_CHANNELS.MCP_SERVER_STATUS, serverId),
  mcpStart: (serverId: string) => ipcRenderer.invoke(IPC_CHANNELS.MCP_START, serverId),
  mcpStop: (serverId: string) => ipcRenderer.invoke(IPC_CHANNELS.MCP_STOP, serverId),
  mcpCallTool: (serverId: string, tool: string, args: Record<string, unknown>) =>
    ipcRenderer.invoke(IPC_CHANNELS.MCP_CALL_TOOL, serverId, tool, args),
  mcpConfigs: () => ipcRenderer.invoke(IPC_CHANNELS.MCP_CONFIGS),
  mcpExecute: (command: string) => ipcRenderer.invoke(IPC_CHANNELS.MCP_EXECUTE, command),

  // Extension API
  extensionList: () => ipcRenderer.invoke(IPC_CHANNELS.EXTENSION_LIST),
  extensionExecuteCommand: (commandId: string, ...args: unknown[]) =>
    ipcRenderer.invoke(IPC_CHANNELS.EXTENSION_EXECUTE_COMMAND, commandId, ...args),

  // Command Palette
  commandPaletteList: () => ipcRenderer.invoke(IPC_CHANNELS.COMMAND_PALETTE_LIST),
  commandPaletteExecute: (commandId: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.COMMAND_PALETTE_EXECUTE, commandId),

  // ============================================================
  // SonicScrewdriver — Secret Store
  // ============================================================
  sonicSetSecret: (key: string, value: string, provider: string, description?: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.SONIC_SET_SECRET, key, value, provider, description),
  sonicGetSecret: (key: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.SONIC_GET_SECRET, key),
  sonicDeleteSecret: (key: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.SONIC_DELETE_SECRET, key),
  sonicListSecrets: () =>
    ipcRenderer.invoke(IPC_CHANNELS.SONIC_LIST_SECRETS),

  // SonicScrewdriver — API Proxy
  sonicProxyRequest: (routeId: string, method: string, path: string, body?: unknown, headers?: Record<string, string>) =>
    ipcRenderer.invoke(IPC_CHANNELS.SONIC_PROXY_REQUEST, routeId, method, path, body, headers),

  // SonicScrewdriver — Container Runtime
  sonicStartContainer: (id: string, name: string, command: string, args: string[], env: Record<string, string>) =>
    ipcRenderer.invoke(IPC_CHANNELS.SONIC_START_CONTAINER, id, name, command, args, env),
  sonicStopContainer: (id: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.SONIC_STOP_CONTAINER, id),
  sonicContainerStatus: (id: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.SONIC_CONTAINER_STATUS, id),
  sonicListContainers: () =>
    ipcRenderer.invoke(IPC_CHANNELS.SONIC_LIST_CONTAINERS),

  // SonicScrewdriver — Audit & Health
  sonicAuditLog: (limit?: number, filter?: { action?: string; success?: boolean }) =>
    ipcRenderer.invoke(IPC_CHANNELS.SONIC_AUDIT_LOG, limit, filter),
  sonicHealth: () =>
    ipcRenderer.invoke(IPC_CHANNELS.SONIC_HEALTH),
});
