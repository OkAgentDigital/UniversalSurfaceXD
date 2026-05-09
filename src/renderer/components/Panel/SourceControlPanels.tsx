import React, { useState, useEffect, useCallback } from 'react';
import { Agent, Skill, Check, SystemTask, Variable, Workflow } from '../../types';

// ============================================================
// Agents Panel
// ============================================================
export function AgentsPanel() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await window.electron.agentsList();
      setAgents(data);
    } catch (err) {
      console.error('Failed to load agents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAction = useCallback(async (id: string, action: 'start' | 'stop') => {
    try {
      if (action === 'start') await window.electron.agentsStart(id);
      else await window.electron.agentsStop(id);
      await load();
    } catch (err) {
      console.error(`Failed to ${action} agent:`, err);
    }
  }, [load]);

  return (
    <div className="sidebar-panel">
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <i className="codicon codicon-robot"></i>
          <span>AGENTS</span>
        </div>
      </div>
      <div className="sidebar-content">
        {loading ? (
          <div className="empty-state"><i className="codicon codicon-loading codicon-modifier-spin"></i><p>Loading...</p></div>
        ) : agents.length === 0 ? (
          <div className="empty-state"><i className="codicon codicon-robot"></i><p>No agents configured</p></div>
        ) : (
          <div className="panel-list">
            {agents.map(agent => (
              <div key={agent.id} className="panel-list-item">
                <div className="panel-list-item-header">
                  <span className={`status-dot ${agent.status}`}></span>
                  <span className="panel-list-item-title">{agent.name}</span>
                  <span className="panel-list-item-type">{agent.type}</span>
                </div>
                <div className="panel-list-item-details">
                  <span>Health: {agent.health}%</span>
                  <span>Tasks: {agent.tasksCompleted}</span>
                  <span>Rate: {agent.rateLimit.used}/{agent.rateLimit.limit}</span>
                </div>
                <div className="panel-list-item-actions">
                  {agent.status === 'running' ? (
                    <button className="button-small button-secondary" onClick={() => handleAction(agent.id, 'stop')}>Stop</button>
                  ) : (
                    <button className="button-small button-primary" onClick={() => handleAction(agent.id, 'start')}>Start</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Skills Panel
// ============================================================
export function SkillsPanel() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await window.electron.skillsList();
      setSkills(data);
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleToggle = useCallback(async (id: string, enabled: boolean) => {
    try {
      if (enabled) await window.electron.skillsEnable(id);
      else await window.electron.skillsDisable(id);
      await load();
    } catch (err) {
      console.error('Failed to toggle skill:', err);
    }
  }, [load]);

  const handleRun = useCallback(async (id: string) => {
    try {
      const result = await window.electron.skillsRun(id);
      if (result.success) {
        alert(`Skill executed: ${result.result || 'Success'}`);
      } else {
        alert(`Skill failed: ${result.error}`);
      }
    } catch (err) {
      console.error('Failed to run skill:', err);
    }
  }, []);

  return (
    <div className="sidebar-panel">
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <i className="codicon codicon-mortar-board"></i>
          <span>SKILLS</span>
        </div>
      </div>
      <div className="sidebar-content">
        {loading ? (
          <div className="empty-state"><i className="codicon codicon-loading codicon-modifier-spin"></i><p>Loading...</p></div>
        ) : skills.length === 0 ? (
          <div className="empty-state"><i className="codicon codicon-mortar-board"></i><p>No skills loaded</p></div>
        ) : (
          <div className="panel-list">
            {skills.map(skill => (
              <div key={skill.id} className="panel-list-item">
                <div className="panel-list-item-header">
                  <span className={`status-dot ${skill.enabled ? 'running' : 'stopped'}`}></span>
                  <span className="panel-list-item-title">{skill.name}</span>
                  <span className="panel-list-item-type">{skill.trigger}</span>
                </div>
                <div className="panel-list-item-description">{skill.description}</div>
                <div className="panel-list-item-actions">
                  <button className="button-small button-primary" onClick={() => handleRun(skill.id)}>Run</button>
                  <button
                    className={`button-small ${skill.enabled ? 'button-secondary' : 'button-primary'}`}
                    onClick={() => handleToggle(skill.id, !skill.enabled)}
                  >
                    {skill.enabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Checks Panel (CI)
// ============================================================
export function ChecksPanel() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await window.electron.checksList();
      setChecks(data);
    } catch (err) {
      console.error('Failed to load checks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRun = useCallback(async (id: string) => {
    try {
      await window.electron.checksRun(id);
      await load();
    } catch (err) {
      console.error('Failed to run check:', err);
    }
  }, [load]);

  return (
    <div className="sidebar-panel">
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <i className="codicon codicon-pass"></i>
          <span>CHECKS</span>
        </div>
      </div>
      <div className="sidebar-content">
        {loading ? (
          <div className="empty-state"><i className="codicon codicon-loading codicon-modifier-spin"></i><p>Loading...</p></div>
        ) : checks.length === 0 ? (
          <div className="empty-state"><i className="codicon codicon-pass"></i><p>No checks configured</p></div>
        ) : (
          <div className="panel-list">
            {checks.map(check => (
              <div key={check.id} className="panel-list-item">
                <div className="panel-list-item-header">
                  <span className={`status-dot ${check.status}`}></span>
                  <span className="panel-list-item-title">{check.name}</span>
                  <span className="panel-list-item-type">{check.repository}</span>
                </div>
                <div className="panel-list-item-details">
                  <span>Duration: {check.duration}ms</span>
                  <span>Status: {check.status}</span>
                </div>
                <div className="panel-list-item-actions">
                  <button className="button-small button-primary" onClick={() => handleRun(check.id)}>Run</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// System Tasks Panel
// ============================================================
export function SystemTasksPanel() {
  const [tasks, setTasks] = useState<SystemTask[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await window.electron.tasksList();
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCancel = useCallback(async (id: string) => {
    try {
      await window.electron.tasksCancel(id);
      await load();
    } catch (err) {
      console.error('Failed to cancel task:', err);
    }
  }, [load]);

  const handleRetry = useCallback(async (id: string) => {
    try {
      await window.electron.tasksRetry(id);
      await load();
    } catch (err) {
      console.error('Failed to retry task:', err);
    }
  }, [load]);

  return (
    <div className="sidebar-panel">
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <i className="codicon codicon-list-tree"></i>
          <span>TASKS</span>
        </div>
      </div>
      <div className="sidebar-content">
        {loading ? (
          <div className="empty-state"><i className="codicon codicon-loading codicon-modifier-spin"></i><p>Loading...</p></div>
        ) : tasks.length === 0 ? (
          <div className="empty-state"><i className="codicon codicon-list-tree"></i><p>No system tasks</p></div>
        ) : (
          <div className="panel-list">
            {tasks.map(task => (
              <div key={task.id} className="panel-list-item">
                <div className="panel-list-item-header">
                  <span className={`status-dot ${task.status}`}></span>
                  <span className="panel-list-item-title">{task.type}</span>
                  <span className="panel-list-item-type">P{task.priority}</span>
                </div>
                <div className="panel-list-item-details">
                  <span>Status: {task.status}</span>
                  <span>Created: {new Date(task.createdAt).toLocaleTimeString()}</span>
                </div>
                <div className="panel-list-item-actions">
                  {task.status === 'running' && (
                    <button className="button-small button-secondary" onClick={() => handleCancel(task.id)}>Cancel</button>
                  )}
                  {task.status === 'failed' && (
                    <button className="button-small button-primary" onClick={() => handleRetry(task.id)}>Retry</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Variables Panel
// ============================================================
export function VariablesPanel() {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newScope, setNewScope] = useState<'workspace' | 'user' | 'system'>('workspace');
  const [newEncrypted, setNewEncrypted] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await window.electron.variablesList();
      setVariables(data);
    } catch (err) {
      console.error('Failed to load variables:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = useCallback(async () => {
    if (!newKey.trim()) return;
    try {
      await window.electron.variablesSet(newKey.trim(), newValue, newScope, newEncrypted);
      setNewKey('');
      setNewValue('');
      setShowAdd(false);
      await load();
    } catch (err) {
      console.error('Failed to add variable:', err);
    }
  }, [newKey, newValue, newScope, newEncrypted, load]);

  const handleDelete = useCallback(async (key: string) => {
    try {
      await window.electron.variablesDelete(key);
      await load();
    } catch (err) {
      console.error('Failed to delete variable:', err);
    }
  }, [load]);

  return (
    <div className="sidebar-panel">
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <i className="codicon codicon-symbol-key"></i>
          <span>VARIABLES</span>
        </div>
        <button className="sidebar-header-action" onClick={() => setShowAdd(!showAdd)}>
          <i className="codicon codicon-add"></i>
        </button>
      </div>
      <div className="sidebar-content">
        {showAdd && (
          <div className="variable-add-form">
            <input type="text" placeholder="Key" value={newKey} onChange={e => setNewKey(e.target.value)} />
            <input type={newEncrypted ? 'password' : 'text'} placeholder="Value" value={newValue} onChange={e => setNewValue(e.target.value)} />
            <select value={newScope} onChange={e => setNewScope(e.target.value as any)}>
              <option value="workspace">Workspace</option>
              <option value="user">User</option>
              <option value="system">System</option>
            </select>
            <label className="checkbox-label">
              <input type="checkbox" checked={newEncrypted} onChange={e => setNewEncrypted(e.target.checked)} />
              Encrypted
            </label>
            <button className="button-primary button-small" onClick={handleAdd}>Add</button>
          </div>
        )}
        {loading ? (
          <div className="empty-state"><i className="codicon codicon-loading codicon-modifier-spin"></i><p>Loading...</p></div>
        ) : variables.length === 0 ? (
          <div className="empty-state"><i className="codicon codicon-symbol-key"></i><p>No variables</p></div>
        ) : (
          <div className="panel-list">
            {variables.map(v => (
              <div key={v.key} className="panel-list-item">
                <div className="panel-list-item-header">
                  <span className="panel-list-item-title">{v.key}</span>
                  <span className="panel-list-item-type">{v.scope}</span>
                  {v.encrypted && <i className="codicon codicon-lock" title="Encrypted"></i>}
                </div>
                <div className="panel-list-item-details">
                  <span>Value: {v.encrypted ? '••••••••' : v.value}</span>
                  <span>Used by: {v.usedBy.length} items</span>
                </div>
                <div className="panel-list-item-actions">
                  <button className="button-small button-secondary" onClick={() => handleDelete(v.key)}>
                    <i className="codicon codicon-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Workflows Panel
// ============================================================
export function WorkflowsPanel() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await window.electron.workflowsList();
      setWorkflows(data);
    } catch (err) {
      console.error('Failed to load workflows:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRun = useCallback(async (id: string) => {
    try {
      await window.electron.workflowsRun(id);
      await load();
    } catch (err) {
      console.error('Failed to run workflow:', err);
    }
  }, [load]);

  const handleDisable = useCallback(async (id: string) => {
    try {
      await window.electron.workflowsDisable(id);
      await load();
    } catch (err) {
      console.error('Failed to disable workflow:', err);
    }
  }, [load]);

  return (
    <div className="sidebar-panel">
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <i className="codicon codicon-play-circle"></i>
          <span>WORKFLOWS</span>
        </div>
      </div>
      <div className="sidebar-content">
        {loading ? (
          <div className="empty-state"><i className="codicon codicon-loading codicon-modifier-spin"></i><p>Loading...</p></div>
        ) : workflows.length === 0 ? (
          <div className="empty-state"><i className="codicon codicon-play-circle"></i><p>No workflows configured</p></div>
        ) : (
          <div className="panel-list">
            {workflows.map(wf => (
              <div key={wf.id} className="panel-list-item">
                <div className="panel-list-item-header">
                  <span className={`status-dot ${wf.status}`}></span>
                  <span className="panel-list-item-title">{wf.name}</span>
                  <span className="panel-list-item-type">{wf.type}</span>
                </div>
                <div className="panel-list-item-details">
                  <span>File: {wf.file}</span>
                  <span>Runs: {wf.runs}</span>
                  {wf.lastRun && <span>Last: {new Date(wf.lastRun).toLocaleDateString()}</span>}
                </div>
                <div className="panel-list-item-actions">
                  <button className="button-small button-primary" onClick={() => handleRun(wf.id)}>Run</button>
                  {wf.status === 'active' && (
                    <button className="button-small button-secondary" onClick={() => handleDisable(wf.id)}>Disable</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
