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
    ipcRenderer.invoke(IPC_CHANNELS.OK_CHAT, request),
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

  // Extension Marketplace
  extensionMarketplaceSearch: (query?: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.EXTENSION_MARKETPLACE_SEARCH, query),
  extensionMarketplaceInstall: (packageName: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.EXTENSION_MARKETPLACE_INSTALL, packageName),
  extensionMarketplaceUninstall: (packageName: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.EXTENSION_MARKETPLACE_UNINSTALL, packageName),
  extensionMarketplaceListInstalled: () =>
    ipcRenderer.invoke(IPC_CHANNELS.EXTENSION_MARKETPLACE_LIST_INSTALLED),
  extensionMarketplaceCheckUpdates: () =>
    ipcRenderer.invoke(IPC_CHANNELS.EXTENSION_MARKETPLACE_CHECK_UPDATES),

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

  // ============================================================
  // Mode Manager
  // ============================================================
  modeGet: () => ipcRenderer.invoke(IPC_CHANNELS.MODE_GET),
  modeSet: (mode: 'dev' | 'docs') => ipcRenderer.invoke(IPC_CHANNELS.MODE_SET, mode),

  // ============================================================
  // Agents
  // ============================================================
  agentsList: () => ipcRenderer.invoke(IPC_CHANNELS.AGENTS_LIST),
  agentsStart: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.AGENTS_START, id),
  agentsStop: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.AGENTS_STOP, id),
  agentsHealth: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.AGENTS_HEALTH, id),

  // ============================================================
  // Skills
  // ============================================================
  skillsList: () => ipcRenderer.invoke(IPC_CHANNELS.SKILLS_LIST),
  skillsEnable: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.SKILLS_ENABLE, id),
  skillsDisable: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.SKILLS_DISABLE, id),
  skillsRun: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.SKILLS_RUN, id),

  // ============================================================
  // Checks (CI)
  // ============================================================
  checksList: () => ipcRenderer.invoke(IPC_CHANNELS.CHECKS_LIST),
  checksRun: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.CHECKS_RUN, id),
  checksResults: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.CHECKS_RESULTS, id),

  // ============================================================
  // System Tasks
  // ============================================================
  tasksList: () => ipcRenderer.invoke(IPC_CHANNELS.TASKS_LIST),
  tasksCancel: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.TASKS_CANCEL, id),
  tasksRetry: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.TASKS_RETRY, id),

  // ============================================================
  // Variables
  // ============================================================
  variablesList: () => ipcRenderer.invoke(IPC_CHANNELS.VARIABLES_LIST),
  variablesSet: (key: string, value: string, scope: string, encrypted: boolean) =>
    ipcRenderer.invoke(IPC_CHANNELS.VARIABLES_SET, key, value, scope, encrypted),
  variablesDelete: (key: string) => ipcRenderer.invoke(IPC_CHANNELS.VARIABLES_DELETE, key),

  // ============================================================
  // Workflows
  // ============================================================
  workflowsList: () => ipcRenderer.invoke(IPC_CHANNELS.WORKFLOWS_LIST),
  workflowsRun: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.WORKFLOWS_RUN, id),
  workflowsDisable: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.WORKFLOWS_DISABLE, id),

  // ============================================================
  // Continue.dev Integration
  // ============================================================
  continueAuth: (apiKey: string) => ipcRenderer.invoke(IPC_CHANNELS.CONTINUE_AUTH, apiKey),
  continueSyncExtensions: () => ipcRenderer.invoke(IPC_CHANNELS.CONTINUE_SYNC_EXTENSIONS),
  continueRunChecks: () => ipcRenderer.invoke(IPC_CHANNELS.CONTINUE_RUN_CHECKS),
  continueSyncSkills: () => ipcRenderer.invoke(IPC_CHANNELS.CONTINUE_SYNC_SKILLS),

  // ============================================================
  // GitHub Next Integration
  // ============================================================
  ghNextRunWorkflow: (workflowFile: string) => ipcRenderer.invoke(IPC_CHANNELS.GH_NEXT_RUN_WORKFLOW, workflowFile),
  ghNextRunAutoloop: (programFile: string) => ipcRenderer.invoke(IPC_CHANNELS.GH_NEXT_RUN_AUTOLOOP, programFile),
  ghNextContinuousAI: (config: { enabled: boolean; triggers: any[] }) =>
    ipcRenderer.invoke(IPC_CHANNELS.GH_NEXT_CONTINUOUS_AI, config),

  // ============================================================
  // Auto-Updater
  // ============================================================
  updateCheck: () => ipcRenderer.invoke('update:check'),
  updateDownload: () => ipcRenderer.invoke('update:download'),
  updateInstall: () => ipcRenderer.invoke('update:install'),
  onUpdateChecking: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('update:checking', handler);
    return () => ipcRenderer.removeListener('update:checking', handler);
  },
  onUpdateAvailable: (callback: (info: { version: string; releaseDate: string; releaseNotes: string }) => void) => {
    const handler = (_event: any, info: any) => callback(info);
    ipcRenderer.on('update:available', handler);
    return () => ipcRenderer.removeListener('update:available', handler);
  },
  onUpdateNotAvailable: (callback: (info: { version: string }) => void) => {
    const handler = (_event: any, info: any) => callback(info);
    ipcRenderer.on('update:not-available', handler);
    return () => ipcRenderer.removeListener('update:not-available', handler);
  },
  onUpdateDownloadProgress: (callback: (progress: { percent: number; bytesPerSecond: number; transferred: number; total: number }) => void) => {
    const handler = (_event: any, progress: any) => callback(progress);
    ipcRenderer.on('update:download-progress', handler);
    return () => ipcRenderer.removeListener('update:download-progress', handler);
  },
  onUpdateDownloaded: (callback: (info: { version: string; releaseNotes: string }) => void) => {
    const handler = (_event: any, info: any) => callback(info);
    ipcRenderer.on('update:downloaded', handler);
    return () => ipcRenderer.removeListener('update:downloaded', handler);
  },
  onUpdateError: (callback: (error: { message: string }) => void) => {
    const handler = (_event: any, error: any) => callback(error);
    ipcRenderer.on('update:error', handler);
    return () => ipcRenderer.removeListener('update:error', handler);
  },
});
