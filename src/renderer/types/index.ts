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
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
