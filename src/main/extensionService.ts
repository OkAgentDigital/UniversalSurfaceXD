import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../shared/constants';
import {
  UniversuiExtension,
  ExtensionContext,
  SidebarPanelRegistration,
  ActivityBarIconRegistration,
  CommandRegistration,
  MCPServerConfig,
  CommandPaletteItem,
} from '../shared/types';
import { mcpManager } from './mcpService';

// ============================================================
// ExtensionAPI — Universui Extension System
// ============================================================
// Manages extensions that can register panels, commands,
// MCP servers, and more. Extensions are loaded at startup
// and can be activated/deactivated dynamically.
// ============================================================

class ExtensionAPI {
  private extensions: Map<string, UniversuiExtension> = new Map();
  private sidebarPanels: Map<string, SidebarPanelRegistration> = new Map();
  private activityBarIcons: Map<string, ActivityBarIconRegistration> = new Map();
  private commands: Map<string, CommandRegistration> = new Map();
  private commandPaletteItems: CommandPaletteItem[] = [];
  private workspaceState: Map<string, unknown> = new Map();
  private globalState: Map<string, unknown> = new Map();

  /**
   * Register and activate an extension
   */
  async registerExtension(extension: UniversuiExtension): Promise<{ success: boolean; error?: string }> {
    if (this.extensions.has(extension.id)) {
      return { success: false, error: `Extension "${extension.id}" is already registered` };
    }

    // Create the extension context
    const context = this.createContext(extension.id);

    try {
      // Activate the extension
      await extension.activate(context);
      this.extensions.set(extension.id, extension);
      console.log(`[ExtensionAPI] Activated extension: ${extension.id} v${extension.version}`);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: `Failed to activate extension "${extension.id}": ${err.message}` };
    }
  }

  /**
   * Deactivate and unregister an extension
   */
  async unregisterExtension(id: string): Promise<{ success: boolean; error?: string }> {
    const extension = this.extensions.get(id);
    if (!extension) {
      return { success: false, error: `Extension "${id}" not found` };
    }

    try {
      if (extension.deactivate) {
        await extension.deactivate();
      }

      // Clean up all registrations from this extension
      this.cleanupExtension(id);

      this.extensions.delete(id);
      console.log(`[ExtensionAPI] Deactivated extension: ${id}`);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: `Failed to deactivate extension "${id}": ${err.message}` };
    }
  }

  /**
   * Get all registered extensions
   */
  listExtensions(): Array<{ id: string; name: string; version: string; description?: string }> {
    const list: Array<{ id: string; name: string; version: string; description?: string }> = [];
    for (const [, ext] of this.extensions) {
      list.push({
        id: ext.id,
        name: ext.name,
        version: ext.version,
        description: ext.description,
      });
    }
    return list;
  }

  /**
   * Get all registered sidebar panels
   */
  getSidebarPanels(): SidebarPanelRegistration[] {
    return Array.from(this.sidebarPanels.values());
  }

  /**
   * Get all registered activity bar icons
   */
  getActivityBarIcons(): ActivityBarIconRegistration[] {
    return Array.from(this.activityBarIcons.values());
  }

  /**
   * Get all registered commands
   */
  getCommands(): CommandRegistration[] {
    return Array.from(this.commands.values());
  }

  /**
   * Get all command palette items
   */
  getCommandPaletteItems(): CommandPaletteItem[] {
    return [...this.commandPaletteItems];
  }

  /**
   * Execute a command by ID
   */
  async executeCommand(id: string, ...args: unknown[]): Promise<{ success: boolean; error?: string }> {
    const command = this.commands.get(id);
    if (!command) {
      return { success: false, error: `Command "${id}" not found` };
    }

    try {
      await command.handler(...args);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Create an extension context for a given extension ID
   */
  private createContext(extensionId: string): ExtensionContext {
    return {
      registerSidebarPanel: (panel: SidebarPanelRegistration) => {
        this.sidebarPanels.set(`${extensionId}.${panel.id}`, panel);
        console.log(`[ExtensionAPI] ${extensionId} registered sidebar panel: ${panel.id}`);
      },

      registerActivityBarIcon: (icon: ActivityBarIconRegistration) => {
        this.activityBarIcons.set(`${extensionId}.${icon.id}`, icon);
        console.log(`[ExtensionAPI] ${extensionId} registered activity bar icon: ${icon.id}`);
      },

      registerCommand: (command: CommandRegistration) => {
        const fullId = `${extensionId}.${command.id}`;
        this.commands.set(fullId, command);

        // Also add to command palette
        this.commandPaletteItems.push({
          id: fullId,
          title: command.title,
          category: command.category,
          icon: command.icon,
          keybinding: command.keybindings?.[0],
          handler: () => command.handler(),
        });

        console.log(`[ExtensionAPI] ${extensionId} registered command: ${command.id}`);
      },

      registerMCPServer: (config: MCPServerConfig) => {
        mcpManager.registerServer(config);
        console.log(`[ExtensionAPI] ${extensionId} registered MCP server: ${config.id}`);
      },

      getWorkspaceState: <T>(key: string): T | undefined => {
        return this.workspaceState.get(key) as T | undefined;
      },

      setWorkspaceState: <T>(key: string, value: T): void => {
        this.workspaceState.set(key, value);
      },

      getGlobalState: <T>(key: string): T | undefined => {
        return this.globalState.get(key) as T | undefined;
      },

      setGlobalState: <T>(key: string, value: T): void => {
        this.globalState.set(key, value);
      },

      mcp: {
        callTool: (serverId: string, tool: string, args: Record<string, unknown>) => {
          return mcpManager.callTool(serverId, tool, args);
        },
        getServerStatus: (serverId: string) => {
          return mcpManager.getServerStatus(serverId);
        },
        listServers: () => {
          return mcpManager.getAllStatuses();
        },
      },

      ai: {
        chat: async (messages) => {
          // This will be called from the renderer via IPC
          // For now, return a placeholder
          return { content: 'AI chat is available via the DeepSeek API. Configure DEEPSEEK_API_KEY in your environment.' };
        },
        explain: async (text, context) => {
          return `Explanation of: ${text.substring(0, 100)}... (DeepSeek API required)`;
        },
      },

      documents: {
        get: async (id) => {
          const { ipcMain } = await import('electron');
          return null; // Handled via IPC
        },
        save: async (doc) => {},
        list: async () => [],
        delete: async (id) => {},
      },

      tasks: {
        getAll: async () => [],
        save: async (task) => {},
        delete: async (id) => {},
      },
    };
  }

  /**
   * Clean up all registrations from a specific extension
   */
  private cleanupExtension(extensionId: string): void {
    const prefix = `${extensionId}.`;

    for (const key of this.sidebarPanels.keys()) {
      if (key.startsWith(prefix)) this.sidebarPanels.delete(key);
    }
    for (const key of this.activityBarIcons.keys()) {
      if (key.startsWith(prefix)) this.activityBarIcons.delete(key);
    }
    for (const key of this.commands.keys()) {
      if (key.startsWith(prefix)) this.commands.delete(key);
    }

    this.commandPaletteItems = this.commandPaletteItems.filter(
      item => !item.id.startsWith(prefix)
    );
  }
}

// ---- Singleton ----

const extensionAPI = new ExtensionAPI();

// ---- IPC Handlers ----

export function registerExtensionHandlers(): void {
  // List all extensions
  ipcMain.handle(IPC_CHANNELS.EXTENSION_LIST, async () => {
    return extensionAPI.listExtensions();
  });

  // Execute a command
  ipcMain.handle(IPC_CHANNELS.EXTENSION_EXECUTE_COMMAND, async (_event, commandId: string, ...args: unknown[]) => {
    return extensionAPI.executeCommand(commandId, ...args);
  });

  // Get command palette items
  ipcMain.handle(IPC_CHANNELS.COMMAND_PALETTE_LIST, async () => {
    return extensionAPI.getCommandPaletteItems();
  });

  // Execute a command palette command
  ipcMain.handle(IPC_CHANNELS.COMMAND_PALETTE_EXECUTE, async (_event, commandId: string) => {
    return extensionAPI.executeCommand(commandId);
  });
}

export { extensionAPI };
