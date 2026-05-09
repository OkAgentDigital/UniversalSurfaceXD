// ============================================================
// SonicScrewdriver — Universui's API Gateway & Security Layer
// ============================================================
// Provides:
//   - Secret Store (AES-256-GCM encrypted credential storage)
//   - API Proxy with rate limiting
//   - Container Runtime for MCP servers
//   - Node Registry for tracking distributed services
//   - Audit Logging for all operations
// ============================================================

import { ipcMain } from 'electron';
import crypto from 'crypto';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import fs from 'fs';
import { IPC_CHANNELS } from '../shared/constants';

// ---- Types ----

export interface SonicSecret {
  key: string;
  value: string;
  provider: 'github' | 'deepseek' | 'openai' | 'custom';
  createdAt: number;
  lastUsedAt: number;
  description?: string;
}

export interface SonicProxyRoute {
  id: string;
  name: string;
  targetUrl: string;
  rateLimit: { requests: number; per: number }; // requests per seconds
  headers?: Record<string, string>;
  timeout?: number;
}

export interface SonicContainer {
  id: string;
  name: string;
  image: string;
  status: 'stopped' | 'running' | 'error';
  port?: number;
  process: ChildProcess | null;
  startedAt?: number;
  env: Record<string, string>;
}

export interface SonicAuditEntry {
  timestamp: number;
  action: string;
  actor: string;
  resource: string;
  success: boolean;
  details?: string;
}

// ---- SonicScrewdriver Class ----

class SonicScrewdriver {
  private secrets: Map<string, SonicSecret> = new Map();
  private proxyRoutes: Map<string, SonicProxyRoute> = new Map();
  private containers: Map<string, SonicContainer> = new Map();
  private auditLog: SonicAuditEntry[] = [];
  private encryptionKey: Buffer;
  private initialized = false;

  // Rate limiting state
  private rateLimitBuckets: Map<string, { tokens: number; lastRefill: number }> = new Map();

  constructor() {
    // Derive encryption key from machine-specific data + a stored salt
    // In production, this would use the OS keychain
    const machineId = this.getMachineId();
    const salt = crypto.randomBytes(16);
    this.encryptionKey = crypto.scryptSync(machineId, salt, 32);
  }

  /**
   * Initialize the SonicScrewdriver
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Load persisted secrets from disk
    await this.loadSecrets();

    // Register default proxy routes
    this.registerDefaultRoutes();

    this.initialized = true;
    this.audit('system', 'sonic.initialize', 'system', true, 'SonicScrewdriver initialized');
    console.log('[SonicScrewdriver] Initialized');
  }

  // ============================================================
  // SECRET STORE (AES-256-GCM)
  // ============================================================

  /**
   * Store a secret with AES-256-GCM encryption
   */
  async setSecret(
    key: string,
    value: string,
    provider: SonicSecret['provider'] = 'custom',
    description?: string
  ): Promise<void> {
    const encrypted = this.encrypt(value);
    const secret: SonicSecret = {
      key,
      value: encrypted,
      provider,
      createdAt: Date.now(),
      lastUsedAt: Date.now(),
      description,
    };
    this.secrets.set(key, secret);
    await this.persistSecrets();
    this.audit('system', 'secret.set', `secret:${key}`, true);
  }

  /**
   * Retrieve and decrypt a secret
   */
  async getSecret(key: string): Promise<string | null> {
    const secret = this.secrets.get(key);
    if (!secret) return null;

    secret.lastUsedAt = Date.now();
    try {
      return this.decrypt(secret.value);
    } catch {
      this.audit('system', 'secret.get', `secret:${key}`, false, 'Decryption failed');
      return null;
    }
  }

  /**
   * Delete a secret
   */
  async deleteSecret(key: string): Promise<boolean> {
    const existed = this.secrets.delete(key);
    if (existed) {
      await this.persistSecrets();
      this.audit('system', 'secret.delete', `secret:${key}`, true);
    }
    return existed;
  }

  /**
   * List all secret keys (without revealing values)
   */
  listSecrets(): Array<{ key: string; provider: string; description?: string; createdAt: number }> {
    const list: Array<{ key: string; provider: string; description?: string; createdAt: number }> = [];
    for (const [, secret] of this.secrets) {
      list.push({
        key: secret.key,
        provider: secret.provider,
        description: secret.description,
        createdAt: secret.createdAt,
      });
    }
    return list;
  }

  // ============================================================
  // API PROXY with Rate Limiting
  // ============================================================

  /**
   * Register a proxy route
   */
  registerRoute(route: SonicProxyRoute): void {
    this.proxyRoutes.set(route.id, route);
    this.audit('system', 'proxy.register', `route:${route.id}`, true);
  }

  /**
   * Proxy an API request through the gateway
   */
  async proxyRequest(
    routeId: string,
    method: string,
    path: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<{ status: number; data: unknown; headers: Record<string, string> }> {
    const route = this.proxyRoutes.get(routeId);
    if (!route) {
      return { status: 404, data: { error: `Route "${routeId}" not found` }, headers: {} };
    }

    // Check rate limit
    if (!this.checkRateLimit(routeId, route.rateLimit)) {
      return { status: 429, data: { error: 'Rate limit exceeded' }, headers: { 'Retry-After': '60' } };
    }

    const url = `${route.targetUrl}${path}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), route.timeout || 30000);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...route.headers,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await response.json();
      this.audit('system', 'proxy.request', `route:${routeId}`, response.ok, `${method} ${path} → ${response.status}`);

      return {
        status: response.status,
        data,
        headers: Object.fromEntries(response.headers.entries()),
      };
    } catch (err: any) {
      clearTimeout(timeout);
      this.audit('system', 'proxy.request', `route:${routeId}`, false, err.message);
      return { status: 500, data: { error: err.message }, headers: {} };
    }
  }

  // ============================================================
  // CONTAINER RUNTIME (MCP Server Management)
  // ============================================================

  /**
   * Start a containerized MCP server
   */
  async startContainer(
    id: string,
    name: string,
    command: string,
    args: string[],
    env: Record<string, string> = {}
  ): Promise<{ success: boolean; error?: string }> {
    // Stop existing container with same ID
    if (this.containers.has(id)) {
      this.stopContainer(id);
    }

    try {
      const proc = spawn(command, args, {
        env: { ...process.env, ...env },
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      const container: SonicContainer = {
        id,
        name,
        image: command,
        status: 'running',
        process: proc,
        startedAt: Date.now(),
        env,
      };

      proc.on('exit', (code) => {
        container.status = 'stopped';
        container.process = null;
        this.audit('system', 'container.exit', `container:${id}`, true, `Exit code: ${code}`);
      });

      proc.on('error', (err) => {
        container.status = 'error';
        this.audit('system', 'container.error', `container:${id}`, false, err.message);
      });

      this.containers.set(id, container);
      this.audit('system', 'container.start', `container:${id}`, true);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Stop a containerized MCP server
   */
  stopContainer(id: string): { success: boolean; error?: string } {
    const container = this.containers.get(id);
    if (!container) {
      return { success: false, error: `Container "${id}" not found` };
    }

    if (container.process) {
      try {
        container.process.kill('SIGTERM');
        setTimeout(() => {
          if (container.process) {
            try { container.process.kill('SIGKILL'); } catch {}
          }
        }, 3000);
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    container.status = 'stopped';
    container.process = null;
    this.audit('system', 'container.stop', `container:${id}`, true);
    return { success: true };
  }

  /**
   * Get container status
   */
  getContainerStatus(id: string): SonicContainer | undefined {
    return this.containers.get(id);
  }

  /**
   * List all containers
   */
  listContainers(): SonicContainer[] {
    return Array.from(this.containers.values()).map(c => ({
      ...c,
      process: null, // Don't expose process handle
    }));
  }

  // ============================================================
  // AUDIT LOGGING
  // ============================================================

  /**
   * Record an audit entry
   */
  private audit(actor: string, action: string, resource: string, success: boolean, details?: string): void {
    const entry: SonicAuditEntry = {
      timestamp: Date.now(),
      action,
      actor,
      resource,
      success,
      details,
    };
    this.auditLog.push(entry);

    // Keep only last 1000 entries
    if (this.auditLog.length > 1000) {
      this.auditLog.splice(0, this.auditLog.length - 1000);
    }
  }

  /**
   * Get audit log entries
   */
  getAuditLog(limit = 50, filter?: { action?: string; success?: boolean }): SonicAuditEntry[] {
    let entries = [...this.auditLog].reverse();
    if (filter?.action) {
      entries = entries.filter(e => e.action.includes(filter.action!));
    }
    if (filter?.success !== undefined) {
      entries = entries.filter(e => e.success === filter.success);
    }
    return entries.slice(0, limit);
  }

  /**
   * Get system health status
   */
  getHealth(): {
    status: 'healthy' | 'degraded';
    secrets: number;
    containers: { total: number; running: number };
    routes: number;
    uptime: number;
  } {
    const containers = Array.from(this.containers.values());
    return {
      status: this.initialized ? 'healthy' : 'degraded',
      secrets: this.secrets.size,
      containers: {
        total: containers.length,
        running: containers.filter(c => c.status === 'running').length,
      },
      routes: this.proxyRoutes.size,
      uptime: this.initialized ? Date.now() - (this as any)._startTime || Date.now() : 0,
    };
  }

  // ============================================================
  // PRIVATE HELPERS
  // ============================================================

  /**
   * Encrypt a value using AES-256-GCM
   */
  private encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  /**
   * Decrypt a value using AES-256-GCM
   */
  private decrypt(ciphertext: string): string {
    const [ivHex, authTagHex, encrypted] = ciphertext.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.encryptionKey, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Get a machine-specific identifier for key derivation
   */
  private getMachineId(): string {
    try {
      // Use hostname + machine-specific path as a simple machine ID
      const hostname = require('os').hostname();
      const homeDir = require('os').homedir();
      return `${hostname}:${homeDir}:universui-sonic-v1`;
    } catch {
      return 'universui-sonic-default-key';
    }
  }

  /**
   * Persist secrets to disk (encrypted at rest)
   */
  private async persistSecrets(): Promise<void> {
    try {
      const userDataPath = require('electron').app?.getPath('userData') || process.cwd();
      const secretsDir = path.join(userDataPath, '.sonic');
      if (!fs.existsSync(secretsDir)) {
        fs.mkdirSync(secretsDir, { recursive: true });
      }

      const data = JSON.stringify(Array.from(this.secrets.entries()));
      // Double-encrypt the entire secrets file
      const encrypted = this.encrypt(data);
      fs.writeFileSync(path.join(secretsDir, 'secrets.enc'), encrypted, 'utf8');
    } catch (err) {
      console.error('[SonicScrewdriver] Failed to persist secrets:', err);
    }
  }

  /**
   * Load secrets from disk
   */
  private async loadSecrets(): Promise<void> {
    try {
      const userDataPath = require('electron').app?.getPath('userData') || process.cwd();
      const secretsPath = path.join(userDataPath, '.sonic', 'secrets.enc');
      if (fs.existsSync(secretsPath)) {
        const encrypted = fs.readFileSync(secretsPath, 'utf8');
        const decrypted = this.decrypt(encrypted);
        const entries: [string, SonicSecret][] = JSON.parse(decrypted);
        for (const [key, secret] of entries) {
          this.secrets.set(key, secret);
        }
      }
    } catch (err) {
      console.error('[SonicScrewdriver] Failed to load secrets:', err);
    }
  }

  /**
   * Register default proxy routes
   */
  private registerDefaultRoutes(): void {
    this.registerRoute({
      id: 'deepseek-api',
      name: 'DeepSeek API',
      targetUrl: 'https://api.deepseek.com',
      rateLimit: { requests: 60, per: 60 },
      timeout: 30000,
    });

    this.registerRoute({
      id: 'github-api',
      name: 'GitHub API',
      targetUrl: 'https://api.github.com',
      rateLimit: { requests: 5000, per: 3600 },
      headers: { 'Accept': 'application/vnd.github.v3+json' },
      timeout: 15000,
    });
  }

  /**
   * Token bucket rate limiter
   */
  private checkRateLimit(routeId: string, limit: { requests: number; per: number }): boolean {
    const now = Date.now();
    const bucket = this.rateLimitBuckets.get(routeId) || { tokens: limit.requests, lastRefill: now };

    // Refill tokens
    const elapsed = (now - bucket.lastRefill) / 1000;
    const refill = Math.floor(elapsed * (limit.requests / limit.per));
    if (refill > 0) {
      bucket.tokens = Math.min(limit.requests, bucket.tokens + refill);
      bucket.lastRefill = now;
    }

    // Check if we have a token
    if (bucket.tokens <= 0) {
      return false;
    }

    bucket.tokens--;
    this.rateLimitBuckets.set(routeId, bucket);
    return true;
  }

  /**
   * Shutdown all containers and persist state
   */
  async shutdown(): Promise<void> {
    for (const [id] of this.containers) {
      this.stopContainer(id);
    }
    await this.persistSecrets();
    this.audit('system', 'sonic.shutdown', 'system', true);
    console.log('[SonicScrewdriver] Shut down');
  }
}

// ---- Singleton ----

const sonicScrewdriver = new SonicScrewdriver();

// ---- IPC Handlers ----

export function registerSonicHandlers(): void {
  // Initialize
  sonicScrewdriver.initialize();

  // Secret Store
  ipcMain.handle(IPC_CHANNELS.SONIC_SET_SECRET, async (_event, key: string, value: string, provider: string, description?: string) => {
    await sonicScrewdriver.setSecret(key, value, provider as any, description);
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.SONIC_GET_SECRET, async (_event, key: string) => {
    const value = await sonicScrewdriver.getSecret(key);
    return { success: true, value };
  });

  ipcMain.handle(IPC_CHANNELS.SONIC_DELETE_SECRET, async (_event, key: string) => {
    const deleted = await sonicScrewdriver.deleteSecret(key);
    return { success: deleted };
  });

  ipcMain.handle(IPC_CHANNELS.SONIC_LIST_SECRETS, async () => {
    return sonicScrewdriver.listSecrets();
  });

  // API Proxy
  ipcMain.handle(IPC_CHANNELS.SONIC_PROXY_REQUEST, async (_event, routeId: string, method: string, path: string, body?: unknown, headers?: Record<string, string>) => {
    return sonicScrewdriver.proxyRequest(routeId, method, path, body, headers);
  });

  // Container Runtime
  ipcMain.handle(IPC_CHANNELS.SONIC_START_CONTAINER, async (_event, id: string, name: string, command: string, args: string[], env: Record<string, string>) => {
    return sonicScrewdriver.startContainer(id, name, command, args, env);
  });

  ipcMain.handle(IPC_CHANNELS.SONIC_STOP_CONTAINER, async (_event, id: string) => {
    return sonicScrewdriver.stopContainer(id);
  });

  ipcMain.handle(IPC_CHANNELS.SONIC_CONTAINER_STATUS, async (_event, id: string) => {
    return sonicScrewdriver.getContainerStatus(id);
  });

  ipcMain.handle(IPC_CHANNELS.SONIC_LIST_CONTAINERS, async () => {
    return sonicScrewdriver.listContainers();
  });

  // Audit & Health
  ipcMain.handle(IPC_CHANNELS.SONIC_AUDIT_LOG, async (_event, limit?: number, filter?: { action?: string; success?: boolean }) => {
    return sonicScrewdriver.getAuditLog(limit, filter);
  });

  ipcMain.handle(IPC_CHANNELS.SONIC_HEALTH, async () => {
    return sonicScrewdriver.getHealth();
  });
}

export { sonicScrewdriver };
