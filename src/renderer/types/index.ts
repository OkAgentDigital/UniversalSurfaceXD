import {
  MCPServerStatus,
  MCPServerConfig,
  MCPToolResult,
  CommandPaletteItem,
} from '../../shared/types';

export interface Document {
  id: string;
  title: string;
  content: string;
  language: string;
  created_at: number;
  updated_at: number;
  metadata: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'archived';
  order_index: number;
  created_at: number;
  updated_at: number;
  document_id: string | null;
  properties: string;
}

export interface View {
  id: string;
  name: string;
  type: 'kanban' | 'table';
  config: string;
}

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  type: 'task' | 'document';
  updated_at: number;
}

export interface GitStatusItem {
  status: string;
  file: string;
}

export interface GitLogItem {
  hash: string;
  message: string;
}

export interface SonicHealth {
  status: 'healthy' | 'degraded';
  secrets: number;
  containers: { total: number; running: number };
  routes: number;
  uptime: number;
}

export interface SonicAuditEntry {
  timestamp: number;
  action: string;
  actor: string;
  resource: string;
  success: boolean;
  details?: string;
}

export interface SonicContainerInfo {
  id: string;
  name: string;
  image: string;
  status: 'stopped' | 'running' | 'error';
  port?: number;
  startedAt?: number;
  env: Record<string, string>;
}

export interface ElectronAPI {
  // Document operations
  getDocument: (id: string) => Promise<Document | undefined>;
  saveDocument: (doc: Document) => Promise<void>;
  listDocuments: () => Promise<Document[]>;
  deleteDocument: (id: string) => Promise<void>;

  // Task operations
  getAllTasks: () => Promise<Task[]>;
  saveTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // View operations
  getViews: () => Promise<View[]>;
  saveView: (view: View) => Promise<void>;

  // Search
  search: (query: string) => Promise<SearchResult[]>;

  // Git operations
  getGitBranch: () => Promise<string>;
  getGitStatus: () => Promise<GitStatusItem[]>;
  gitCommit: (message: string) => Promise<{ success: boolean; error?: string }>;
  gitPush: () => Promise<{ success: boolean; error?: string }>;
  gitPull: () => Promise<{ success: boolean; error?: string }>;
  getGitLog: () => Promise<GitLogItem[]>;

  // Terminal operations
  terminalSpawn: (terminalId: string) => Promise<void>;
  terminalWrite: (terminalId: string, data: string) => Promise<void>;
  terminalResize: (terminalId: string, cols: number, rows: number) => Promise<void>;
  terminalKill: (terminalId: string) => Promise<void>;
  onTerminalData: (callback: (terminalId: string, data: string) => void) => () => void;

  // Settings
  getSettings: () => Promise<Record<string, string>>;
  saveSetting: (key: string, value: string) => Promise<void>;

  // AI / DeepSeek operations
  aiChat: (request: { messages: { role: string; content: string }[]; stream?: boolean }) =>
    Promise<{ success: boolean; message?: { role: string; content: string }; usage?: any; error?: string }>;
  aiExplain: (params: { text: string; context?: string }) =>
    Promise<{ success: boolean; explanation?: string; error?: string }>;

  // MCP (GitHub) operations — multi-server
  mcpStatus: () => Promise<MCPServerStatus[]>;
  mcpServerStatus: (serverId: string) => Promise<MCPServerStatus>;
  mcpStart: (serverId: string) => Promise<{ success: boolean; error?: string }>;
  mcpStop: (serverId: string) => Promise<{ success: boolean; error?: string }>;
  mcpCallTool: (serverId: string, tool: string, args: Record<string, unknown>) => Promise<MCPToolResult>;
  mcpConfigs: () => Promise<MCPServerConfig[]>;
  mcpExecute: (command: string) => Promise<{ success: boolean; result?: string; error?: string }>;

  // Extension API
  extensionList: () => Promise<Array<{ id: string; name: string; version: string; description?: string }>>;
  extensionExecuteCommand: (commandId: string, ...args: unknown[]) => Promise<{ success: boolean; error?: string }>;

  // Command Palette
  commandPaletteList: () => Promise<CommandPaletteItem[]>;
  commandPaletteExecute: (commandId: string) => Promise<{ success: boolean; error?: string }>;

  // ============================================================
  // SonicScrewdriver — Secret Store
  // ============================================================
  sonicSetSecret: (key: string, value: string, provider: string, description?: string) =>
    Promise<{ success: boolean }>;
  sonicGetSecret: (key: string) =>
    Promise<{ success: boolean; value: string | null }>;
  sonicDeleteSecret: (key: string) =>
    Promise<{ success: boolean }>;
  sonicListSecrets: () =>
    Promise<Array<{ key: string; provider: string; description?: string; createdAt: number }>>;

  // SonicScrewdriver — API Proxy
  sonicProxyRequest: (routeId: string, method: string, path: string, body?: unknown, headers?: Record<string, string>) =>
    Promise<{ status: number; data: unknown; headers: Record<string, string> }>;

  // SonicScrewdriver — Container Runtime
  sonicStartContainer: (id: string, name: string, command: string, args: string[], env: Record<string, string>) =>
    Promise<{ success: boolean; error?: string }>;
  sonicStopContainer: (id: string) =>
    Promise<{ success: boolean; error?: string }>;
  sonicContainerStatus: (id: string) =>
    Promise<SonicContainerInfo | undefined>;
  sonicListContainers: () =>
    Promise<SonicContainerInfo[]>;

  // SonicScrewdriver — Audit & Health
  sonicAuditLog: (limit?: number, filter?: { action?: string; success?: boolean }) =>
    Promise<SonicAuditEntry[]>;
  sonicHealth: () =>
    Promise<SonicHealth>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
