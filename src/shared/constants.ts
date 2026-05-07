export const APP_NAME = 'Universui';
export const APP_VERSION = '0.1.0';
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
  GET_DOCUMENT: 'db:getDocument',
  SAVE_DOCUMENT: 'db:saveDocument',
  LIST_DOCUMENTS: 'db:listDocuments',
  DELETE_DOCUMENT: 'db:deleteDocument',
  GET_ALL_TASKS: 'db:getAllTasks',
  SAVE_TASK: 'db:saveTask',
  DELETE_TASK: 'db:deleteTask',
  GET_VIEWS: 'db:getViews',
  SAVE_VIEW: 'db:saveView',
} as const;
