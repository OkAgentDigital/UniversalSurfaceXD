export const APP_NAME = 'Universui';
export const APP_VERSION = '1.2.0';
export const DB_FILENAME = 'universui.db';

export const TASK_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

export const VIEW_TYPES = {
  KANBAN: 'kanban',
  TABLE: 'table',
} as const;

export const DEFAULT_LANGUAGES = [
  { value: 'markdown', label: 'Markdown' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'plaintext', label: 'Plain Text' },
] as const;

export const IPC_CHANNELS = {
  // Document operations
  GET_DOCUMENT: 'db:getDocument',
  SAVE_DOCUMENT: 'db:saveDocument',
  LIST_DOCUMENTS: 'db:listDocuments',
  DELETE_DOCUMENT: 'db:deleteDocument',
  // Task operations
  GET_ALL_TASKS: 'db:getAllTasks',
  SAVE_TASK: 'db:saveTask',
  DELETE_TASK: 'db:deleteTask',
  // View operations
  GET_VIEWS: 'db:getViews',
  SAVE_VIEW: 'db:saveView',
  // Search
  SEARCH: 'db:search',
  // Git operations
  GIT_BRANCH: 'git:branch',
  GIT_STATUS: 'git:status',
  GIT_COMMIT: 'git:commit',
  GIT_PUSH: 'git:push',
  GIT_PULL: 'git:pull',
  GIT_LOG: 'git:log',
  // Terminal
  TERMINAL_SPAWN: 'terminal:spawn',
  TERMINAL_WRITE: 'terminal:write',
  TERMINAL_RESIZE: 'terminal:resize',
  TERMINAL_KILL: 'terminal:kill',
  TERMINAL_DATA: 'terminal:data',
  // Settings
  GET_SETTINGS: 'settings:get',
  SAVE_SETTINGS: 'settings:save',
} as const;

export const DEFAULT_SETTINGS = {
  theme: 'dark' as 'dark' | 'light',
  fontSize: 14,
  autoSaveInterval: 1000,
  fontFamily: "Monaco, Menlo, 'Courier New', monospace",
  sidebarWidth: 260,
  panelHeight: 200,
};
