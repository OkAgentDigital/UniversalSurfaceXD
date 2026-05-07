import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import { DB_FILENAME } from '../shared/constants';

let db: Database.Database;

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

export function initDatabase(): Database.Database {
  const dbPath = path.join(app.getPath('userData'), DB_FILENAME);
  db = new Database(dbPath);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      order_index INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      document_id TEXT REFERENCES documents(id) ON DELETE SET NULL,
      properties TEXT DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT DEFAULT '',
      language TEXT DEFAULT 'markdown',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      metadata TEXT DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS views (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      config TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sync_metadata (
      key TEXT PRIMARY KEY,
      last_sync_time INTEGER,
      sync_provider TEXT,
      sync_state TEXT DEFAULT 'idle'
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    CREATE INDEX IF NOT EXISTS idx_tasks_updated_at ON tasks(updated_at);
    CREATE INDEX IF NOT EXISTS idx_documents_updated_at ON documents(updated_at);
  `);

  return db;
}

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

// Document CRUD operations
export function getDocument(id: string): Document | undefined {
  const stmt = db.prepare('SELECT * FROM documents WHERE id = ?');
  return stmt.get(id) as Document | undefined;
}

export function saveDocument(doc: Document): void {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO documents (id, title, content, language, created_at, updated_at, metadata)
    VALUES (@id, @title, @content, @language, @created_at, @updated_at, @metadata)
  `);
  stmt.run(doc);
}

export function listDocuments(): Document[] {
  const stmt = db.prepare('SELECT * FROM documents ORDER BY updated_at DESC');
  return stmt.all() as Document[];
}

export function deleteDocument(id: string): void {
  const stmt = db.prepare('DELETE FROM documents WHERE id = ?');
  stmt.run(id);
}

// Task CRUD operations
export function getAllTasks(): Task[] {
  const stmt = db.prepare('SELECT * FROM tasks ORDER BY order_index ASC');
  return stmt.all() as Task[];
}

export function saveTask(task: Task): void {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO tasks (id, title, status, order_index, created_at, updated_at, document_id, properties)
    VALUES (@id, @title, @status, @order_index, @created_at, @updated_at, @document_id, @properties)
  `);
  stmt.run(task);
}

export function deleteTask(id: string): void {
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  stmt.run(id);
}

// View CRUD operations
export function getViews(): View[] {
  const stmt = db.prepare('SELECT * FROM views');
  return stmt.all() as View[];
}

export function saveView(view: View): void {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO views (id, name, type, config)
    VALUES (@id, @name, @type, @config)
  `);
  stmt.run(view);
}

// Search across tasks and documents
export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  type: 'task' | 'document';
  updated_at: number;
}

export function search(query: string): SearchResult[] {
  const searchTerm = `%${query}%`;
  const results: SearchResult[] = [];

  // Search tasks
  const taskStmt = db.prepare(`
    SELECT id, title, status as snippet, updated_at
    FROM tasks
    WHERE title LIKE ? OR properties LIKE ?
    ORDER BY updated_at DESC
    LIMIT 20
  `);
  const taskResults = taskStmt.all(searchTerm, searchTerm) as any[];
  taskResults.forEach((r: any) => {
    results.push({
      id: r.id,
      title: r.title,
      snippet: `Task - ${r.snippet}`,
      type: 'task',
      updated_at: r.updated_at,
    });
  });

  // Search documents
  const docStmt = db.prepare(`
    SELECT id, title, substr(content, 1, 100) as snippet, updated_at
    FROM documents
    WHERE title LIKE ? OR content LIKE ?
    ORDER BY updated_at DESC
    LIMIT 20
  `);
  const docResults = docStmt.all(searchTerm, searchTerm) as any[];
  docResults.forEach((r: any) => {
    results.push({
      id: r.id,
      title: r.title,
      snippet: r.snippet,
      type: 'document',
      updated_at: r.updated_at,
    });
  });

  // Sort by updated_at descending
  results.sort((a, b) => b.updated_at - a.updated_at);
  return results.slice(0, 30);
}

// Settings storage (using sync_metadata table)
export function getSetting(key: string): string | undefined {
  const stmt = db.prepare('SELECT key FROM sync_metadata WHERE key = ?');
  const row = stmt.get(key) as any;
  return row?.key;
}

export function saveSetting(key: string, value: string): void {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO sync_metadata (key, last_sync_time, sync_provider, sync_state)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(key, Date.now(), value, 'settings');
}

export function getAllSettings(): Record<string, string> {
  const stmt = db.prepare("SELECT key, sync_provider FROM sync_metadata WHERE sync_state = 'settings'");
  const rows = stmt.all() as any[];
  const settings: Record<string, string> = {};
  rows.forEach((r: any) => {
    settings[r.key] = r.sync_provider;
  });
  return settings;
}
