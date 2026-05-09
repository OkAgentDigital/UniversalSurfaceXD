// ============================================================
// Universui Shared Types
// Shared between main process and renderer
// ============================================================

// ---- MCP Server Types ----

export interface MCPServerConfig {
  /** Unique identifier for this server */
  id: string;
  /** Human-readable name */
  name: string;
  /** Command to spawn (e.g., 'npx', 'node', 'docker') */
  command: string;
  /** Arguments to pass to the command */
  args: string[];
  /** Environment variables to set */
  env?: Record<string, string>;
  /** Auto-start this server when Universui launches */
  autoStart?: boolean;
  /** Server description for the UI */
  description?: string;
  /** Icon identifier for the UI */
  icon?: string;
}

export interface MCPServerStatus {
  id: string;
  name: string;
  running: boolean;
  output: string[];
  error?: string;
  startedAt?: number;
}

export interface MCPToolCall {
  jsonrpc: '2.0';
  id: string;
  method: 'tools/call';
  params: {
    name: string;
    arguments: Record<string, unknown>;
  };
}

export interface MCPToolResult {
  jsonrpc: '2.0';
  id: string;
  result?: {
    content: Array<{
      type: 'text' | 'image' | 'resource';
      text?: string;
      uri?: string;
      mimeType?: string;
    }>;
    isError?: boolean;
  };
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

// ---- Extension API Types ----

export interface UniversuiExtension {
  /** Unique extension ID (e.g., 'universui.panel-chat') */
  id: string;
  /** Human-readable name */
  name: string;
  /** Extension version */
  version: string;
  /** Description of what this extension does */
  description?: string;
  /** Called when the extension is activated */
  activate: (context: ExtensionContext) => void | Promise<void>;
  /** Called when the extension is deactivated */
  deactivate?: () => void | Promise<void>;
}

export interface ExtensionContext {
  /** Register a sidebar panel */
  registerSidebarPanel: (panel: SidebarPanelRegistration) => void;
  /** Register an activity bar icon */
  registerActivityBarIcon: (icon: ActivityBarIconRegistration) => void;
  /** Register a command that can be invoked */
  registerCommand: (command: CommandRegistration) => void;
  /** Register an MCP server to be managed */
  registerMCPServer: (config: MCPServerConfig) => void;
  /** Get workspace-level persistent state */
  getWorkspaceState: <T>(key: string) => T | undefined;
  /** Set workspace-level persistent state */
  setWorkspaceState: <T>(key: string, value: T) => void;
  /** Get global extension state */
  getGlobalState: <T>(key: string) => T | undefined;
  /** Set global extension state */
  setGlobalState: <T>(key: string, value: T) => void;
  /** Access the MCP manager to call tools */
  mcp: {
    callTool: (serverId: string, tool: string, args: Record<string, unknown>) => Promise<MCPToolResult>;
    getServerStatus: (serverId: string) => MCPServerStatus | undefined;
    listServers: () => MCPServerStatus[];
  };
  /** Access the AI service */
  ai: {
    chat: (messages: Array<{ role: string; content: string }>) => Promise<{ content: string }>;
    explain: (text: string, context?: string) => Promise<string>;
  };
  /** Access the document database */
  documents: {
    get: (id: string) => Promise<unknown>;
    save: (doc: unknown) => Promise<void>;
    list: () => Promise<unknown[]>;
    delete: (id: string) => Promise<void>;
  };
  /** Access tasks */
  tasks: {
    getAll: () => Promise<unknown[]>;
    save: (task: unknown) => Promise<void>;
    delete: (id: string) => Promise<void>;
  };
}

export interface SidebarPanelRegistration {
  id: string;
  title: string;
  icon: string;
  component: string; // Lazy-loaded module path
}

export interface ActivityBarIconRegistration {
  id: string;
  icon: string;
  label: string;
  position: 'top' | 'bottom';
  onClick: () => void;
}

export interface CommandRegistration {
  id: string;
  title: string;
  category?: string;
  icon?: string;
  handler: (...args: unknown[]) => void | Promise<void>;
  keybindings?: string[];
}

// ---- Extension Manifest (for package.json) ----

export interface ExtensionManifest {
  name: string;
  version: string;
  description: string;
  universui: {
    extension: true;
    version: string; // Universui version compatibility
    contributes?: {
      panels?: Array<{
        id: string;
        title: string;
        icon: string;
        location: 'sidebar' | 'right' | 'bottom';
      }>;
      commands?: Array<{
        id: string;
        title: string;
        category?: string;
      }>;
      mcpServers?: string[];
      themes?: string[];
    };
  };
  main?: string; // Entry point
  publishConfig?: {
    registry?: string;
  };
}

// ---- Command Palette Types ----

export interface CommandPaletteItem {
  id: string;
  title: string;
  category?: string;
  icon?: string;
  keybinding?: string;
  handler: () => void | Promise<void>;
}
