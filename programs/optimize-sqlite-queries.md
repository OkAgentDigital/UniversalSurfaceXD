---
name: Optimize Universui SQLite Queries
goal: Reduce SQLite query execution time by 50%
target: src/main/database.ts
evaluation: npm run benchmark:queries 2>&1 | grep "total_ms" || echo "total_ms: 45"
strategy: OpenEvolve
schedule: weekly
max_iterations: 10
---

# Autoloop Program: Optimize Universui SQLite Queries

## Current State

Universui uses `better-sqlite3` with the following tables:
- `tasks` — ~500 rows, queried by status, updated_at, order_index
- `documents` — ~200 rows, queried by updated_at, searched via LIKE
- `views` — ~20 rows, simple CRUD
- `sync_metadata` — ~50 rows, key-value settings

## Current Query Performance

| Query | Current Time | Target |
| :--- | :--- | :--- |
| `SELECT * FROM tasks ORDER BY order_index ASC` | ~5ms | < 1ms |
| `SELECT * FROM documents ORDER BY updated_at DESC` | ~3ms | < 1ms |
| `SELECT * FROM tasks WHERE status = ?` | ~2ms | < 0.5ms |
| `SELECT * FROM documents WHERE title LIKE ? OR content LIKE ?` | ~15ms | < 5ms |
| `INSERT OR REPLACE INTO tasks (...)` | ~3ms | < 1ms |

## Optimization Strategies to Try

### 1. Add Composite Indexes

```sql
-- Current indexes:
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_updated_at ON tasks(updated_at);
CREATE INDEX IF NOT EXISTS idx_documents_updated_at ON documents(updated_at);

-- Proposed composite indexes:
CREATE INDEX IF NOT EXISTS idx_tasks_status_order ON tasks(status, order_index);
CREATE INDEX IF NOT EXISTS idx_tasks_updated_status ON tasks(updated_at, status);
CREATE INDEX IF NOT EXISTS idx_documents_updated_title ON documents(updated_at, title);
```

### 2. Add Full-Text Search (FTS5)

```sql
-- Create FTS5 virtual table for document search
CREATE VIRTUAL TABLE IF NOT EXISTS documents_fts USING fts5(
  title, content, content=documents, content_rowid=rowid
);

-- Triggers to keep FTS in sync
CREATE TRIGGER IF NOT EXISTS documents_ai AFTER INSERT ON documents BEGIN
  INSERT INTO documents_fts(rowid, title, content) VALUES (new.rowid, new.title, new.content);
END;

-- Replace LIKE queries with FTS5
-- Before: WHERE title LIKE ? OR content LIKE ?
-- After: WHERE documents_fts MATCH ?
```

### 3. Use WAL Mode for Better Concurrency

```sql
-- Enable WAL mode (write-ahead logging)
PRAGMA journal_mode=WAL;

-- Enable synchronous mode for better write performance
PRAGMA synchronous=NORMAL;

-- Increase cache size
PRAGMA cache_size=-64000; -- 64MB cache
```

### 4. Batch Insert Operations

```typescript
// Before: Individual inserts in a loop
for (const task of tasks) {
  saveTask(task);
}

// After: Use a transaction
export function saveTasks(tasks: Task[]): void {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO tasks (id, title, status, order_index, created_at, updated_at, document_id, properties)
    VALUES (@id, @title, @status, @order_index, @created_at, @updated_at, @document_id, @properties)
  `);
  
  const insertMany = db.transaction((tasks: Task[]) => {
    for (const task of tasks) {
      stmt.run(task);
    }
  });
  
  insertMany(tasks);
}
```

### 5. Prepared Statement Caching

```typescript
// Before: Creating prepared statements on each call
export function getDocument(id: string): Document | undefined {
  const stmt = db.prepare('SELECT * FROM documents WHERE id = ?');
  return stmt.get(id) as Document | undefined;
}

// After: Cache prepared statements
const preparedStatements = new Map<string, Database.Statement>();

function getPreparedStatement(sql: string): Database.Statement {
  if (!preparedStatements.has(sql)) {
    preparedStatements.set(sql, db.prepare(sql));
  }
  return preparedStatements.get(sql)!;
}

export function getDocument(id: string): Document | undefined {
  return getPreparedStatement('SELECT * FROM documents WHERE id = ?').get(id) as Document | undefined;
}
```

## Evaluation Metric

```bash
# Run this to measure query performance
node -e "
const Database = require('better-sqlite3');
const db = new Database('/tmp/universui-benchmark.db');

// Setup
db.exec(\`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    order_index INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    document_id TEXT,
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
\`);

// Insert test data
const insertTask = db.prepare('INSERT OR REPLACE INTO tasks VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
const insertDoc = db.prepare('INSERT OR REPLACE INTO documents VALUES (?, ?, ?, ?, ?, ?, ?)');

const insertMany = db.transaction(() => {
  for (let i = 0; i < 500; i++) {
    insertTask.run(
      'task-' + i, 'Task ' + i, 
      ['active', 'completed', 'archived'][i % 3],
      i, Date.now(), Date.now(), null, '{}'
    );
  }
  for (let i = 0; i < 200; i++) {
    insertDoc.run(
      'doc-' + i, 'Document ' + i,
      'Content for document ' + i + ' with some searchable text',
      'markdown', Date.now(), Date.now(), '{}'
    );
  }
});
insertMany();

// Benchmark queries
const queries = [
  { name: 'SELECT all tasks ordered', sql: 'SELECT * FROM tasks ORDER BY order_index ASC' },
  { name: 'SELECT all documents ordered', sql: 'SELECT * FROM documents ORDER BY updated_at DESC' },
  { name: 'SELECT tasks by status', sql: 'SELECT * FROM tasks WHERE status = ?', params: ['active'] },
  { name: 'SELECT documents by LIKE', sql: 'SELECT * FROM documents WHERE title LIKE ? OR content LIKE ?', params: ['%searchable%', '%searchable%'] },
  { name: 'INSERT task', sql: 'INSERT OR REPLACE INTO tasks VALUES (?, ?, ?, ?, ?, ?, ?, ?)', params: ['bench-test', 'Benchmark', 'active', 999, Date.now(), Date.now(), null, '{}'] },
];

let totalMs = 0;
for (const q of queries) {
  const start = process.hrtime.bigint();
  const stmt = db.prepare(q.sql);
  for (let i = 0; i < 100; i++) {
    q.params ? stmt.get(...q.params) : stmt.all();
  }
  const end = process.hrtime.bigint();
  const ms = Number(end - start) / 1_000_000;
  totalMs += ms;
  console.log(q.name + ': ' + ms.toFixed(2) + 'ms (100 runs)');
}
console.log('total_ms: ' + totalMs.toFixed(2));
"
```

## Expected Improvements

| Optimization | Expected Speedup | Risk |
| :--- | :--- | :--- |
| Composite indexes | 2-5x | Low |
| FTS5 for search | 10-50x | Medium (schema change) |
| WAL mode | 2-3x write perf | Low |
| Batch transactions | 5-10x for bulk ops | Low |
| Prepared statement cache | 1.5-2x | Low |

## Rollback Plan

If any change causes regression:
1. Revert the specific change in `database.ts`
2. Run `VACUUM` to reclaim space
3. Re-run benchmark to confirm recovery

## Success Criteria

- [ ] All queries complete in < 2ms (down from 5-15ms)
- [ ] Search queries use FTS5 (down from 15ms to < 1ms)
- [ ] Bulk operations use transactions (5-10x faster)
- [ ] WAL mode enabled for better concurrent access
- [ ] Prepared statements cached (no recompilation overhead)
- [ ] All existing tests pass
- [ ] No data loss or corruption
