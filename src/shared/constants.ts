export const APP_NAME = 'Universui';
export const APP_VERSION = '1.4.0';
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

  // AI / DeepSeek
  AI_CHAT: 'ai:chat',
  AI_STREAM: 'ai:stream',
  AI_EXPLAIN: 'ai:explain',

  // MCP Server
  MCP_EXECUTE: 'mcp:execute',
  MCP_STATUS: 'mcp:status',
  MCP_SERVER_STATUS: 'mcp:serverStatus',
  MCP_START: 'mcp:start',
  MCP_STOP: 'mcp:stop',
  MCP_CALL_TOOL: 'mcp:callTool',
  MCP_CONFIGS: 'mcp:configs',

  // Extension API
  EXTENSION_REGISTER: 'extension:register',
  EXTENSION_UNREGISTER: 'extension:unregister',
  EXTENSION_LIST: 'extension:list',
  EXTENSION_EXECUTE_COMMAND: 'extension:executeCommand',

  // Extension Marketplace
  EXTENSION_MARKETPLACE_SEARCH: 'extension:marketplace:search',
  EXTENSION_MARKETPLACE_INSTALL: 'extension:marketplace:install',
  EXTENSION_MARKETPLACE_UNINSTALL: 'extension:marketplace:uninstall',
  EXTENSION_MARKETPLACE_LIST_INSTALLED: 'extension:marketplace:listInstalled',
  EXTENSION_MARKETPLACE_CHECK_UPDATES: 'extension:marketplace:checkUpdates',

  // Command Palette
  COMMAND_PALETTE_LIST: 'commandPalette:list',
  COMMAND_PALETTE_EXECUTE: 'commandPalette:execute',

  // Right Panel
  RIGHT_PANEL_TOGGLE: 'panel:right:toggle',
  RIGHT_PANEL_RESIZE: 'panel:right:resize',

  // SonicScrewdriver — Secret Store
  SONIC_SET_SECRET: 'sonic:setSecret',
  SONIC_GET_SECRET: 'sonic:getSecret',
  SONIC_DELETE_SECRET: 'sonic:deleteSecret',
  SONIC_LIST_SECRETS: 'sonic:listSecrets',

  // SonicScrewdriver — API Proxy
  SONIC_PROXY_REQUEST: 'sonic:proxyRequest',

  // SonicScrewdriver — Container Runtime
  SONIC_START_CONTAINER: 'sonic:startContainer',
  SONIC_STOP_CONTAINER: 'sonic:stopContainer',
  SONIC_CONTAINER_STATUS: 'sonic:containerStatus',
  SONIC_LIST_CONTAINERS: 'sonic:listContainers',

  // SonicScrewdriver — Audit & Health
  SONIC_AUDIT_LOG: 'sonic:auditLog',
  SONIC_HEALTH: 'sonic:health',

  // Mode Manager
  MODE_GET: 'mode:get',
  MODE_SET: 'mode:set',

  // Agents
  AGENTS_LIST: 'agents:list',
  AGENTS_START: 'agents:start',
  AGENTS_STOP: 'agents:stop',
  AGENTS_HEALTH: 'agents:health',

  // Skills
  SKILLS_LIST: 'skills:list',
  SKILLS_ENABLE: 'skills:enable',
  SKILLS_DISABLE: 'skills:disable',
  SKILLS_RUN: 'skills:run',

  // Checks (CI)
  CHECKS_LIST: 'checks:list',
  CHECKS_RUN: 'checks:run',
  CHECKS_RESULTS: 'checks:results',

  // Tasks (system)
  TASKS_LIST: 'tasks:list',
  TASKS_CANCEL: 'tasks:cancel',
  TASKS_RETRY: 'tasks:retry',

  // Variables (Secrets/Env)
  VARIABLES_LIST: 'variables:list',
  VARIABLES_SET: 'variables:set',
  VARIABLES_DELETE: 'variables:delete',

  // Workflows
  WORKFLOWS_LIST: 'workflows:list',
  WORKFLOWS_RUN: 'workflows:run',
  WORKFLOWS_DISABLE: 'workflows:disable',

  // Continue.dev Integration
  CONTINUE_AUTH: 'continue:auth',
  CONTINUE_SYNC_EXTENSIONS: 'continue:syncExtensions',
  CONTINUE_RUN_CHECKS: 'continue:runChecks',
  CONTINUE_SYNC_SKILLS: 'continue:syncSkills',

  // GitHub Next Integration
  GH_NEXT_RUN_WORKFLOW: 'ghNext:runWorkflow',
  GH_NEXT_RUN_AUTOLOOP: 'ghNext:runAutoloop',
  GH_NEXT_CONTINUOUS_AI: 'ghNext:continuousAI',
} as const;

export const DEFAULT_SETTINGS = {
  theme: 'dark' as 'dark' | 'light',
  fontSize: 14,
  autoSaveInterval: 1000,
  fontFamily: "Monaco, Menlo, 'Courier New', monospace",
  sidebarWidth: 260,
  panelHeight: 200,
};
