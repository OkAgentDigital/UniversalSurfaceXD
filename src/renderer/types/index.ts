export interface Task {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'archived';
  order_index: number;
  created_at: number;
  updated_at: number;
  document_id: string | null;
  properties: string; // JSON string
}

export interface Document {
  id: string;
  title: string;
  content: string;
  language: string;
  created_at: number;
  updated_at: number;
  metadata: string; // JSON string
}

export interface View {
  id: string;
  name: string;
  type: 'kanban' | 'table';
  config: string; // JSON string
}

export interface SyncMetadata {
  key: string;
  last_sync_time: number | null;
  sync_provider: string | null;
  sync_state: 'idle' | 'syncing' | 'conflict';
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
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
