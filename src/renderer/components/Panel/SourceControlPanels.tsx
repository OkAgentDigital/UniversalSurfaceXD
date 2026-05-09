import React, { useState, useEffect, useCallback } from 'react';
import { Agent, Skill, Check, SystemTask, Variable, Workflow, Snack } from '../../types';

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
// Snacks Panel (GTM-style Tag/Snack system)
// ============================================================
export function SnacksPanel() {
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSnack, setSelectedSnack] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      // Placeholder: in production, this would call window.electron.snacksList()
      // For now, show demo data
      setSnacks([
        {
          id: 'snack-1',
          name: 'Auto-label GitHub Issues',
          description: 'When a new issue is created, automatically add labels based on content',
          type: 'ai-prompt',
          script: 'Use DeepSeek to classify issues as bug, enhancement, or question',
          triggers: ['on-issue-created'],
          variables: ['{{issue.title}}', '{{issue.body}}'],
          enabled: true,
          lastRun: new Date(Date.now() - 120000),
          lastSuccess: true,
          runs: 47,
        },
        {
          id: 'snack-2',
          name: 'Summarize Daily Notes',
          description: 'At end of day, summarize all notes into a daily digest',
          type: 'ai-prompt',
          script: 'Concatenate today\'s notes and ask AI for a summary',
          triggers: ['on-schedule'],
          variables: ['{{document.content}}', '{{user.name}}'],
          enabled: true,
          lastRun: new Date(Date.now() - 3600000),
          lastSuccess: true,
          runs: 23,
        },
        {
          id: 'snack-3',
          name: 'Backup to GitHub',
          description: 'Auto-commit and push changes to GitHub every hour',
          type: 'shell-command',
          script: 'git add . && git commit -m "auto-backup" && git push',
          triggers: ['on-schedule'],
          variables: [],
          enabled: false,
          lastRun: new Date(Date.now() - 86400000),
          lastSuccess: false,
          runs: 156,
        },
        {
          id: 'snack-4',
          name: 'PR Review Assistant',
          description: 'When a PR is opened, run tests and post a summary',
          type: 'mcp-tool',
          script: 'Run CI checks, analyze code changes, post review comment',
          triggers: ['on-pr-opened'],
          variables: ['{{pr.number}}', '{{pr.title}}'],
          enabled: true,
          lastRun: new Date(Date.now() - 600000),
          lastSuccess: true,
          runs: 12,
        },
      ]);
    } catch (err) {
      console.error('Failed to load snacks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleToggle = useCallback(async (id: string, enabled: boolean) => {
    setSnacks(prev => prev.map(s => s.id === id ? { ...s, enabled } : s));
  }, []);

  const snackTypeIcon = (type: string) => {
    switch (type) {
      case 'custom-script': return 'codicon-code';
      case 'ai-prompt': return 'codicon-lightbulb';
      case 'mcp-tool': return 'codicon-plug';
      case 'shell-command': return 'codicon-terminal';
      case 'http-request': return 'codicon-globe';
      default: return 'codicon-symbol-misc';
    }
  };

  const snackTypeLabel = (type: string) => {
    switch (type) {
      case 'custom-script': return 'Script';
      case 'ai-prompt': return 'AI Prompt';
      case 'mcp-tool': return 'MCP Tool';
      case 'shell-command': return 'Shell';
      case 'http-request': return 'HTTP';
      default: return type;
    }
  };

  return (
    <div className="sidebar-panel">
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <i className="codicon codicon-package"></i>
          <span>SNACKS</span>
        </div>
        <button className="sidebar-header-action" title="New Snack">
          <i className="codicon codicon-add"></i>
        </button>
      </div>
      <div className="sidebar-content">
        {loading ? (
          <div className="empty-state"><i className="codicon codicon-loading codicon-modifier-spin"></i><p>Loading...</p></div>
        ) : snacks.length === 0 ? (
          <div className="empty-state">
            <i className="codicon codicon-package"></i>
            <p>No snacks configured</p>
            <p style={{ fontSize: 11, color: '#666' }}>Snacks are GTM-style tags that fire on triggers</p>
          </div>
        ) : (
          <div className="panel-list">
            {snacks.map(snack => (
              <div
                key={snack.id}
                className={`panel-list-item ${selectedSnack === snack.id ? 'selected' : ''}`}
                onClick={() => setSelectedSnack(selectedSnack === snack.id ? null : snack.id)}
              >
                <div className="panel-list-item-header">
                  <span className={`status-dot ${snack.enabled ? 'running' : 'stopped'}`}></span>
                  <i className={`codicon ${snackTypeIcon(snack.type)}`} style={{ fontSize: 14, color: snack.enabled ? '#4ec9b0' : '#858585' }}></i>
                  <span className="panel-list-item-title">{snack.name}</span>
                  <span className="panel-list-item-type">{snackTypeLabel(snack.type)}</span>
                </div>
                <div className="panel-list-item-description">{snack.description}</div>
                <div className="panel-list-item-details">
                  <span>Runs: {snack.runs}</span>
                  {snack.lastRun && (
                    <span style={{ color: snack.lastSuccess ? '#4ec9b0' : '#f44747' }}>
                      {snack.lastSuccess ? '✓' : '✗'} {new Date(snack.lastRun).toLocaleTimeString()}
                    </span>
                  )}
                  {snack.triggers.length > 0 && (
                    <span>Triggers: {snack.triggers.length}</span>
                  )}
                </div>
                {selectedSnack === snack.id && (
                  <div className="panel-list-item-actions" style={{ marginTop: 6 }}>
                    <button className="button-small button-primary" onClick={(e) => { e.stopPropagation(); alert(`Run ${snack.name}`); }}>Run</button>
                    <button className="button-small button-secondary" onClick={(e) => { e.stopPropagation(); alert(`Edit ${snack.name}`); }}>Edit</button>
                    <button
                      className={`button-small ${snack.enabled ? 'button-secondary' : 'button-primary'}`}
                      onClick={(e) => { e.stopPropagation(); handleToggle(snack.id, !snack.enabled); }}
                    >
                      {snack.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Workflows Panel — GTM-style Visual Programming Model
// ============================================================
export function WorkflowsPanel() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWf, setSelectedWf] = useState<string | null>(null);
  const [showAutonomy, setShowAutonomy] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await window.electron.workflowsList();
      // Enhance with autonomy levels and tags for demo
      const enhanced = data.map((wf, i) => ({
        ...wf,
        autonomyLevel: (Math.min(5, Math.max(1, 5 - i)) as 1 | 2 | 3 | 4 | 5),
        tags: wf.tags || ['auto-doc', 'ci-cd', 'research', 'review', 'backup'].slice(i, i + 2),
        triggers: wf.triggers || ['on-schedule', 'on-file-save', 'on-pr', 'on-issue', 'manual'].slice(i, i + 1),
        variables: wf.variables || ['{{user.name}}', '{{document.path}}', '{{pr.number}}'],
      }));
      setWorkflows(enhanced);
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

  const autonomyLabels = ['Research', 'Plan', 'Milestones', 'Legacy', 'Autonomous'];
  const autonomyColors = ['#569cd6', '#4ec9b0', '#dcdcaa', '#ce9178', '#c586c0'];

  return (
    <div className="sidebar-panel">
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <i className="codicon codicon-play-circle"></i>
          <span>WORKFLOWS</span>
        </div>
        <button
          className={`sidebar-header-action ${showAutonomy ? 'active' : ''}`}
          onClick={() => setShowAutonomy(!showAutonomy)}
          title="Toggle Autonomy View"
        >
          <i className="codicon codicon-git-branch"></i>
        </button>
      </div>
      <div className="sidebar-content">
        {loading ? (
          <div className="empty-state"><i className="codicon codicon-loading codicon-modifier-spin"></i><p>Loading...</p></div>
        ) : workflows.length === 0 ? (
          <div className="empty-state"><i className="codicon codicon-play-circle"></i><p>No workflows configured</p></div>
        ) : (
          <div className="panel-list">
            {workflows.map(wf => (
              <div
                key={wf.id}
                className={`panel-list-item ${selectedWf === wf.id ? 'selected' : ''}`}
                onClick={() => setSelectedWf(selectedWf === wf.id ? null : wf.id)}
              >
                {/* Header */}
                <div className="panel-list-item-header">
                  <span className={`status-dot ${wf.status}`}></span>
                  <span className="panel-list-item-title">{wf.name}</span>
                  <span className="panel-list-item-type">{wf.type}</span>
                </div>

                {/* Autonomy Level Bar (GTM-style maturity indicator) */}
                {wf.autonomyLevel && (
                  <div className="wf-autonomy-bar" style={{ paddingLeft: 22, marginTop: 4 }}>
                    <div className="wf-autonomy-track">
                      {[1, 2, 3, 4, 5].map(level => (
                        <div
                          key={level}
                          className={`wf-autonomy-dot ${(wf.autonomyLevel || 0) >= level ? 'active' : ''}`}
                          style={{
                            '--dot-color': autonomyColors[level - 1],
                            backgroundColor: (wf.autonomyLevel || 0) >= level ? autonomyColors[level - 1] : '#3c3c3c',
                          } as React.CSSProperties}
                          title={`Stage ${level}: ${autonomyLabels[level - 1]}`}
                        />
                      ))}
                    </div>
                    <span className="wf-autonomy-label" style={{ color: autonomyColors[(wf.autonomyLevel || 1) - 1] }}>
                      Stage {wf.autonomyLevel}: {autonomyLabels[(wf.autonomyLevel || 1) - 1]}
                    </span>
                  </div>
                )}

                {/* Details */}
                <div className="panel-list-item-details" style={{ marginTop: 4 }}>
                  <span>File: {wf.file}</span>
                  <span>Runs: {wf.runs}</span>
                  {wf.lastRun && <span>Last: {new Date(wf.lastRun).toLocaleDateString()}</span>}
                </div>

                {/* Tags / Triggers / Variables chips */}
                <div className="wf-chips" style={{ paddingLeft: 22, marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {wf.tags?.map(tag => (
                    <span key={tag} className="wf-chip wf-chip-tag">{tag}</span>
                  ))}
                  {wf.triggers?.map(tr => (
                    <span key={tr} className="wf-chip wf-chip-trigger">
                      <i className="codicon codicon-zap" style={{ fontSize: 10 }}></i> {tr.replace('on-', '')}
                    </span>
                  ))}
                </div>

                {/* Expanded: Autonomy details + actions */}
                {selectedWf === wf.id && (
                  <div className="wf-expanded" style={{ paddingLeft: 22, marginTop: 8 }}>
                    {/* Autonomy slider */}
                    {showAutonomy && (
                      <div className="wf-autonomy-detail" style={{ marginBottom: 8 }}>
                        <div className="wf-autonomy-slider-container">
                          <span className="wf-autonomy-slider-label" style={{ fontSize: 10, color: '#858585' }}>Autonomy:</span>
                          <div className="wf-autonomy-slider">
                            {[1, 2, 3, 4, 5].map(level => (
                              <div
                                key={level}
                                className={`wf-autonomy-slider-step ${(wf.autonomyLevel || 0) >= level ? 'active' : ''}`}
                                style={{ '--step-color': autonomyColors[level - 1] } as React.CSSProperties}
                              >
                                <span className="wf-autonomy-step-num">{level}</span>
                                <span className="wf-autonomy-step-label">{autonomyLabels[level - 1]}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Variables */}
                    {wf.variables && wf.variables.length > 0 && (
                      <div style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 10, color: '#858585', textTransform: 'uppercase', letterSpacing: 0.3 }}>Variables:</span>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
                          {wf.variables.map(v => (
                            <span key={v} className="wf-chip wf-chip-variable">{v}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="panel-list-item-actions" style={{ marginTop: 4 }}>
                      <button className="button-small button-primary" onClick={(e) => { e.stopPropagation(); handleRun(wf.id); }}>Run</button>
                      <button className="button-small button-secondary" onClick={(e) => { e.stopPropagation(); alert(`Edit ${wf.name}`); }}>Edit</button>
                      {wf.status === 'active' ? (
                        <button className="button-small button-secondary" onClick={(e) => { e.stopPropagation(); handleDisable(wf.id); }}>Disable</button>
                      ) : (
                        <button className="button-small button-primary" onClick={(e) => { e.stopPropagation(); handleDisable(wf.id); }}>Enable</button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
