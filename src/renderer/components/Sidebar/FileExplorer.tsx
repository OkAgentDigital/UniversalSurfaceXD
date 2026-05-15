import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '../../types';

interface FileExplorerProps {
  onTaskCountChange?: (count: number) => void;
  onTaskSelect?: (task: Task | null) => void;
}

export function FileExplorer({ onTaskCountChange, onTaskSelect }: FileExplorerProps) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['inbox', 'projects']));
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; taskId: string } | null>(null);
  const [isNewItemDialogOpen, setIsNewItemDialogOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemFolder, setNewItemFolder] = useState('inbox');

  const loadTasks = useCallback(async () => {
    try {
      const allTasks = await window.electron.getAllTasks();
      allTasks.sort((a: Task, b: Task) => a.order_index - b.order_index);
      setTasks(allTasks);
      if (onTaskCountChange) onTaskCountChange(allTasks.length);
    } catch (err) {
      console.error('Error loading tasks:', err);
    }
  }, [onTaskCountChange]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const getTasksByFolder = useCallback(() => {
    const grouped: Record<string, Task[]> = {
      inbox: [],
      projects: [],
      archive: [],
      uncategorized: [],
    };

    tasks.forEach(task => {
      if (task.status === 'archived') {
        grouped.archive.push(task);
      } else if (task.status === 'active') {
        // Use properties to determine folder, default to inbox
        const props = JSON.parse(task.properties || '{}');
        const folder = props.folder || 'inbox';
        if (grouped[folder]) {
          grouped[folder].push(task);
        } else {
          grouped.uncategorized.push(task);
        }
      }
    });

    return grouped;
  }, [tasks]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const openDocument = async (task: Task) => {
    setSelectedTaskId(task.id);

    if (task.document_id) {
      navigate(`/editor/${task.document_id}`);
    } else {
      // Create a new document for this task
      const newDocId = crypto.randomUUID();
      const newDoc = {
        id: newDocId,
        title: task.title,
        content: '',
        language: 'markdown',
        created_at: Date.now(),
        updated_at: Date.now(),
        metadata: '{}',
      };
      await window.electron.saveDocument(newDoc);

      // Update task with document_id
      const updatedTask: Task = {
        ...task,
        document_id: newDocId,
        updated_at: Date.now(),
      };
      await window.electron.saveTask(updatedTask);
      await loadTasks();

      navigate(`/editor/${newDocId}`);
    }
  };

  const createNewTask = async () => {
    if (!newItemTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newItemTitle.trim(),
      status: 'active',
      order_index: tasks.length,
      created_at: Date.now(),
      updated_at: Date.now(),
      document_id: null,
      properties: JSON.stringify({ folder: newItemFolder }),
    };

    try {
      await window.electron.saveTask(newTask);
      await loadTasks();
      setNewItemTitle('');
      setIsNewItemDialogOpen(false);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, taskId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, taskId });
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await window.electron.deleteTask(taskId);
      await loadTasks();
      setContextMenu(null);
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleMoveTask = async (taskId: string, newFolder: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const props = JSON.parse(task.properties || '{}');
    props.folder = newFolder;

    const updatedTask: Task = {
      ...task,
      properties: JSON.stringify(props),
      updated_at: Date.now(),
    };

    try {
      await window.electron.saveTask(updatedTask);
      await loadTasks();
      setContextMenu(null);
    } catch (err) {
      console.error('Error moving task:', err);
    }
  };

  const groupedTasks = getTasksByFolder();

  const renderTaskItem = (task: Task) => (
    <div
      key={task.id}
      className={`file-explorer-item ${selectedTaskId === task.id ? 'selected' : ''}`}
      onClick={() => openDocument(task)}
      onContextMenu={(e) => handleContextMenu(e, task.id)}
    >
      <i className="codicon codicon-symbol-file" style={{ color: 'rgb(var(--usx-color-text-muted))' }}></i>
      <span className="task-title">{task.title}</span>
      {task.status === 'completed' && (
        <i className="codicon codicon-check" style={{ color: '#6a9955', fontSize: "var(--usx-font-size-sm)" }}></i>
      )}
      {!task.document_id && (
        <span className="task-badge">new</span>
      )}
    </div>
  );

  const renderFolder = (folderId: string, label: string, icon: string, tasks: Task[]) => (
    <div className="folder-section" key={folderId}>
      <div
        className={`folder-header ${expandedFolders.has(folderId) ? 'expanded' : ''}`}
        onClick={() => toggleFolder(folderId)}
      >
        <i className="codicon codicon-chevron-right"></i>
        <i className={`codicon ${icon}`} style={{ marginRight: 4 }}></i>
        <span className="folder-name">{label}</span>
        <span className="folder-count">{tasks.length}</span>
      </div>
      {expandedFolders.has(folderId) && tasks.map(renderTaskItem)}
    </div>
  );

  return (
    <>
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <i className="codicon codicon-files"></i>
          <span>EXPLORER</span>
        </div>
        <div className="sidebar-header-actions">
          <button onClick={() => setIsNewItemDialogOpen(true)} title="New File">
            <i className="codicon codicon-new-file"></i>
          </button>
          <button onClick={loadTasks} title="Refresh">
            <i className="codicon codicon-refresh"></i>
          </button>
          <button onClick={() => setExpandedFolders(new Set())} title="Collapse All">
            <i className="codicon codicon-collapse-all"></i>
          </button>
        </div>
      </div>

      <div className="sidebar-content">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <i className="codicon codicon-notebook"></i>
            <p>No tasks yet. Create your first document!</p>
            <button onClick={() => setIsNewItemDialogOpen(true)}>
              <i className="codicon codicon-add"></i> New Document
            </button>
          </div>
        ) : (
          <>
            {renderFolder('inbox', 'Inbox', 'codicon-inbox', groupedTasks.inbox)}
            {renderFolder('projects', 'Projects', 'codicon-project', groupedTasks.projects)}
            {groupedTasks.uncategorized.length > 0 && (
              <div className="folder-section">
                {groupedTasks.uncategorized.map(renderTaskItem)}
              </div>
            )}
            {renderFolder('archive', 'Archive', 'codicon-archive', groupedTasks.archive)}
          </>
        )}
      </div>

      {/* New Item Dialog */}
      {isNewItemDialogOpen && (
        <div className="modal-overlay" onClick={() => setIsNewItemDialogOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>New Document</h3>
            <input
              className="modal-input"
              type="text"
              placeholder="Document title..."
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createNewTask()}
              autoFocus
            />
            <select
              className="modal-select"
              value={newItemFolder}
              onChange={(e) => setNewItemFolder(e.target.value)}
            >
              <option value="inbox">Inbox</option>
              <option value="projects">Projects</option>
            </select>
            <div className="modal-button-row">
              <button className="modal-button" onClick={() => setIsNewItemDialogOpen(false)}>
                Cancel
              </button>
              <button className="modal-button primary" onClick={createNewTask}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div
            className="context-menu-item"
            onClick={() => handleMoveTask(contextMenu.taskId, 'inbox')}
          >
            <i className="codicon codicon-inbox"></i>
            Move to Inbox
          </div>
          <div
            className="context-menu-item"
            onClick={() => handleMoveTask(contextMenu.taskId, 'projects')}
          >
            <i className="codicon codicon-project"></i>
            Move to Projects
          </div>
          <div
            className="context-menu-item"
            onClick={() => handleMoveTask(contextMenu.taskId, 'archive')}
          >
            <i className="codicon codicon-archive"></i>
            Move to Archive
          </div>
          <div className="context-menu-divider"></div>
          <div
            className="context-menu-item destructive"
            onClick={() => handleDeleteTask(contextMenu.taskId)}
          >
            <i className="codicon codicon-trash"></i>
            Delete
          </div>
          {/* Click outside to close */}
          <div
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}
            onClick={() => setContextMenu(null)}
          />
        </div>
      )}
    </>
  );
}
