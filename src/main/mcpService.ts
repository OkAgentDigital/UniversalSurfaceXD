import { ipcMain } from 'electron';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { IPC_CHANNELS } from '../shared/constants';
import {
  MCPServerConfig,
  MCPServerStatus,
  MCPToolCall,
  MCPToolResult,
} from '../shared/types';

// ============================================================
// MCPManager — Multi-Server Model Context Protocol Manager
// ============================================================
// Manages multiple MCP server processes (GitHub, DeepSeek, etc.)
// as child processes, communicating via JSON-RPC over stdio.
// ============================================================

class MCPManager {
  private servers: Map<string, MCPServerInstance> = new Map();
  private defaultConfigs: MCPServerConfig[] = [
    {
      id: 'github',
      name: 'GitHub MCP Server',
      command: process.platform === 'win32' ? 'npx.cmd' : 'npx',
      args: ['-y', '@github/github-mcp-server'],
      env: {
        GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
      },
      autoStart: false,
      description: 'Connect to GitHub repositories, issues, PRs, and search code',
      icon: 'mark-github',
    },
    {
      id: 'deepseek',
      name: 'DeepSeek MCP Server',
      command: process.platform === 'win32' ? 'npx.cmd' : 'npx',
      args: ['-y', '@deepseek-ai/deepseek-mcp-server'],
      env: {
        DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || '',
      },
      autoStart: false,
      description: 'AI-powered code generation, explanation, and chat via DeepSeek',
      icon: 'hubot',
    },
  ];

  /**
   * Initialize the MCP Manager with default servers
   */
  async initialize(): Promise<void> {
    // Register default MCP servers
    for (const config of this.defaultConfigs) {
      this.registerServer(config);
    }

    // Auto-start servers that have autoStart enabled
    for (const [id, instance] of this.servers) {
      if (instance.config.autoStart) {
        await this.startServer(id);
      }
    }
  }

  /**
   * Register a new MCP server configuration
   */
  registerServer(config: MCPServerConfig): void {
    if (this.servers.has(config.id)) {
      console.warn(`[MCPManager] Server "${config.id}" already registered, skipping`);
      return;
    }

    const instance: MCPServerInstance = {
      config,
      process: null,
      running: false,
      output: [],
      error: undefined,
      startedAt: undefined,
      pendingRequests: new Map(),
      requestIdCounter: 0,
      buffer: '',
    };

    this.servers.set(config.id, instance);
    console.log(`[MCPManager] Registered server: ${config.id} (${config.name})`);
  }

  /**
   * Unregister and stop an MCP server
   */
  unregisterServer(id: string): void {
    this.stopServer(id);
    this.servers.delete(id);
    console.log(`[MCPManager] Unregistered server: ${id}`);
  }

  /**
   * Start an MCP server process
   */
  async startServer(id: string): Promise<{ success: boolean; error?: string }> {
    const instance = this.servers.get(id);
    if (!instance) {
      return { success: false, error: `Server "${id}" not found` };
    }

    if (instance.running) {
      return { success: true };
    }

    const { config } = instance;

    try {
      const env = {
        ...process.env,
        ...config.env,
      };

      // Filter out empty env vars
      for (const [key, value] of Object.entries(env)) {
        if (!value) delete env[key];
      }

      instance.process = spawn(config.command, config.args, {
        env,
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: path.dirname(process.execPath),
      });

      instance.running = true;
      instance.startedAt = Date.now();
      instance.error = undefined;
      instance.buffer = '';

      // Handle stdout — parse JSON-RPC messages
      instance.process.stdout?.on('data', (data: Buffer) => {
        const chunk = data.toString('utf-8');
        instance.buffer += chunk;

        // Process complete JSON-RPC messages (newline-delimited)
        const lines = instance.buffer.split('\n');
        instance.buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          try {
            const message = JSON.parse(trimmed);
            this.handleMessage(id, message);
          } catch {
            // Not JSON — treat as log output
            this.addOutput(id, trimmed);
          }
        }
      });

      // Handle stderr — log it
      instance.process.stderr?.on('data', (data: Buffer) => {
        const output = data.toString('utf-8');
        this.addOutput(id, `[stderr] ${output}`);
      });

      // Handle exit
      instance.process.on('exit', (code, signal) => {
        instance.running = false;
        instance.process = null;
        this.addOutput(id, `Server exited (code: ${code}, signal: ${signal})`);

        // Reject all pending requests
        for (const [reqId, pending] of instance.pendingRequests) {
          pending.reject(new Error(`Server exited before responding to request ${reqId}`));
          instance.pendingRequests.delete(reqId);
        }
      });

      // Handle error
      instance.process.on('error', (err) => {
        instance.running = false;
        instance.process = null;
        instance.error = err.message;
        this.addOutput(id, `Server error: ${err.message}`);

        // Reject all pending requests
        for (const [reqId, pending] of instance.pendingRequests) {
          pending.reject(new Error(`Server error: ${err.message}`));
          instance.pendingRequests.delete(reqId);
        }
      });

      console.log(`[MCPManager] Started server: ${id}`);
      return { success: true };
    } catch (err: any) {
      instance.error = err.message;
      return { success: false, error: err.message };
    }
  }

  /**
   * Stop an MCP server process
   */
  stopServer(id: string): { success: boolean; error?: string } {
    const instance = this.servers.get(id);
    if (!instance) {
      return { success: false, error: `Server "${id}" not found` };
    }

    if (!instance.running || !instance.process) {
      instance.running = false;
      return { success: true };
    }

    try {
      // Send SIGTERM first, then SIGKILL after timeout
      instance.process.kill('SIGTERM');

      // Force kill after 3 seconds if still running
      setTimeout(() => {
        if (instance.process) {
          try {
            instance.process.kill('SIGKILL');
          } catch {
            // Process may already be dead
          }
        }
      }, 3000);

      instance.running = false;
      console.log(`[MCPManager] Stopped server: ${id}`);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Call a tool on an MCP server
   */
  async callTool(
    serverId: string,
    tool: string,
    args: Record<string, unknown> = {}
  ): Promise<MCPToolResult> {
    const instance = this.servers.get(serverId);
    if (!instance) {
      return {
        jsonrpc: '2.0',
        id: '0',
        error: { code: -32000, message: `Server "${serverId}" not found` },
      };
    }

    // Auto-start if not running
    if (!instance.running) {
      const startResult = await this.startServer(serverId);
      if (!startResult.success) {
        return {
          jsonrpc: '2.0',
          id: '0',
          error: { code: -32001, message: `Failed to start server: ${startResult.error}` },
        };
      }
      // Give it a moment to initialize
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    if (!instance.process?.stdin) {
      return {
        jsonrpc: '2.0',
        id: '0',
        error: { code: -32002, message: 'Server stdin not available' },
      };
    }

    const requestId = `${serverId}-${++instance.requestIdCounter}`;

    const request: MCPToolCall = {
      jsonrpc: '2.0',
      id: requestId,
      method: 'tools/call',
      params: {
        name: tool,
        arguments: args,
      },
    };

    return new Promise<MCPToolResult>((resolve, reject) => {
      // Store the pending request
      instance.pendingRequests.set(requestId, { resolve, reject });

      // Set a timeout
      const timeout = setTimeout(() => {
        instance.pendingRequests.delete(requestId);
        resolve({
          jsonrpc: '2.0',
          id: requestId,
          error: { code: -32003, message: 'Request timed out after 30 seconds' },
        });
      }, 30000);

      // Send the request
      try {
        instance.process!.stdin!.write(JSON.stringify(request) + '\n');
      } catch (err: any) {
        clearTimeout(timeout);
        instance.pendingRequests.delete(requestId);
        resolve({
          jsonrpc: '2.0',
          id: requestId,
          error: { code: -32004, message: `Failed to send request: ${err.message}` },
        });
      }
    });
  }

  /**
   * Get the status of all servers
   */
  getAllStatuses(): MCPServerStatus[] {
    const statuses: MCPServerStatus[] = [];
    for (const [id, instance] of this.servers) {
      statuses.push(this.getServerStatus(id));
    }
    return statuses;
  }

  /**
   * Get the status of a single server
   */
  getServerStatus(id: string): MCPServerStatus {
    const instance = this.servers.get(id);
    if (!instance) {
      return {
        id,
        name: id,
        running: false,
        output: [],
        error: 'Server not registered',
      };
    }

    return {
      id: instance.config.id,
      name: instance.config.name,
      running: instance.running,
      output: [...instance.output],
      error: instance.error,
      startedAt: instance.startedAt,
    };
  }

  /**
   * Get all registered server configs
   */
  getServerConfigs(): MCPServerConfig[] {
    const configs: MCPServerConfig[] = [];
    for (const [, instance] of this.servers) {
      configs.push({ ...instance.config });
    }
    return configs;
  }

  /**
   * Handle an incoming JSON-RPC message from a server
   */
  private handleMessage(serverId: string, message: any): void {
    const instance = this.servers.get(serverId);
    if (!instance) return;

    // Check if this is a response to a pending request
    if (message.id && instance.pendingRequests.has(message.id)) {
      const pending = instance.pendingRequests.get(message.id)!;
      instance.pendingRequests.delete(message.id);

      const result: MCPToolResult = {
        jsonrpc: '2.0',
        id: message.id,
      };

      if (message.error) {
        result.error = message.error;
      } else {
        result.result = message.result;
      }

      pending.resolve(result);
      return;
    }

    // Otherwise, treat as log output
    this.addOutput(serverId, JSON.stringify(message));
  }

  /**
   * Add output to a server's buffer
   */
  private addOutput(id: string, line: string): void {
    const instance = this.servers.get(id);
    if (!instance) return;

    instance.output.push(line);
    // Keep only the last 200 lines
    if (instance.output.length > 200) {
      instance.output.splice(0, instance.output.length - 200);
    }
  }

  /**
   * Clean up all servers
   */
  async shutdown(): Promise<void> {
    for (const [id] of this.servers) {
      this.stopServer(id);
    }
    this.servers.clear();
    console.log('[MCPManager] All servers shut down');
  }
}

// ---- Internal Types ----

interface MCPServerInstance {
  config: MCPServerConfig;
  process: ChildProcess | null;
  running: boolean;
  output: string[];
  error?: string;
  startedAt?: number;
  pendingRequests: Map<string, { resolve: (result: MCPToolResult) => void; reject: (err: Error) => void }>;
  requestIdCounter: number;
  buffer: string;
}

// ---- Singleton ----

const mcpManager = new MCPManager();

// ---- IPC Handlers ----

export function registerMCPHandlers(): void {
  // Initialize the MCP Manager
  mcpManager.initialize();

  // Get all server statuses
  ipcMain.handle(IPC_CHANNELS.MCP_STATUS, async () => {
    return mcpManager.getAllStatuses();
  });

  // Get status of a specific server
  ipcMain.handle(IPC_CHANNELS.MCP_SERVER_STATUS, async (_event, serverId: string) => {
    return mcpManager.getServerStatus(serverId);
  });

  // Start a server
  ipcMain.handle(IPC_CHANNELS.MCP_START, async (_event, serverId: string) => {
    return mcpManager.startServer(serverId);
  });

  // Stop a server
  ipcMain.handle(IPC_CHANNELS.MCP_STOP, async (_event, serverId: string) => {
    return mcpManager.stopServer(serverId);
  });

  // Call a tool on a server
  ipcMain.handle(IPC_CHANNELS.MCP_CALL_TOOL, async (_event, serverId: string, tool: string, args: Record<string, unknown>) => {
    return mcpManager.callTool(serverId, tool, args);
  });

  // Get server configs
  ipcMain.handle(IPC_CHANNELS.MCP_CONFIGS, async () => {
    return mcpManager.getServerConfigs();
  });

  // Legacy: execute command on default GitHub server
  ipcMain.handle(IPC_CHANNELS.MCP_EXECUTE, async (_event, command: string) => {
    return mcpManager.callTool('github', command, {});
  });
}

export { mcpManager };
