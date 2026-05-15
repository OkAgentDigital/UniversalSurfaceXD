import React, { useState, useEffect, useCallback } from 'react';
import { GitStatusItem, GitLogItem } from '../../types';

export function SourceControlPanel() {
  const [branch, setBranch] = useState('main');
  const [status, setStatus] = useState<GitStatusItem[]>([]);
  const [log, setLog] = useState<GitLogItem[]>([]);
  const [commitMessage, setCommitMessage] = useState('');
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitResult, setCommitResult] = useState<{ success: boolean; error?: string } | null>(null);
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [currentBranch, currentStatus, currentLog] = await Promise.all([
        window.electron.getGitBranch(),
        window.electron.getGitStatus(),
        window.electron.getGitLog(),
      ]);
      setBranch(currentBranch);
      setStatus(currentStatus);
      setLog(currentLog);
    } catch (err) {
      console.error('Git refresh error:', err);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleCommit = async () => {
    if (!commitMessage.trim()) return;
    setIsCommitting(true);
    setCommitResult(null);
    const result = await window.electron.gitCommit(commitMessage);
    setCommitResult(result);
    if (result.success) {
      setCommitMessage('');
      refresh();
    }
    setIsCommitting(false);
  };

  const handlePush = async () => {
    setIsPushing(true);
    const result = await window.electron.gitPush();
    setCommitResult(result);
    setIsPushing(false);
  };

  const handlePull = async () => {
    setIsPulling(true);
    const result = await window.electron.gitPull();
    setCommitResult(result);
    setIsPulling(false);
  };

  const getStatusIcon = (statusChar: string) => {
    switch (statusChar) {
      case 'M': return <i className="codicon codicon-circle-filled" style={{ color: 'rgb(var(--usx-color-warning))', fontSize: 12 }}></i>;
      case 'A': return <i className="codicon codicon-circle-filled" style={{ color: 'rgb(var(--usx-color-success))', fontSize: 12 }}></i>;
      case 'D': return <i className="codicon codicon-circle-filled" style={{ color: 'rgb(var(--usx-color-danger))', fontSize: 12 }}></i>;
      case '??': return <i className="codicon codicon-circle-outline" style={{ color: 'rgb(var(--usx-color-text-muted))', fontSize: 12 }}></i>;
      default: return <i className="codicon codicon-circle-outline" style={{ color: 'rgb(var(--usx-color-text-muted))', fontSize: 12 }}></i>;
    }
  };

  const getStatusLabel = (statusChar: string) => {
    switch (statusChar) {
      case 'M': return 'M';
      case 'A': return 'A';
      case 'D': return 'D';
      case '??': return 'U';
      default: return '?';
    }
  };

  return (
    <>
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <i className="codicon codicon-source-control"></i>
          <span>SOURCE CONTROL</span>
        </div>
        <div className="sidebar-header-right">
          <i className="codicon codicon-refresh" onClick={refresh} title="Refresh"></i>
        </div>
      </div>
      <div className="source-control-body">
        <div className="source-control-branch">
          <i className="codicon codicon-source-control"></i>
          <span>{branch}</span>
        </div>
        <div className="source-control-actions">
          <button className="action-button" onClick={handlePull} disabled={isPulling}>
            <i className="codicon codicon-cloud-download"></i>
            {isPulling ? '...' : 'Pull'}
          </button>
          <button className="action-button" onClick={handlePush} disabled={isPushing}>
            <i className="codicon codicon-cloud-upload"></i>
            {isPushing ? '...' : 'Push'}
          </button>
        </div>
        <div className="source-control-commit-row">
          <input
            type="text"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Commit message..."
            onKeyDown={(e) => e.key === 'Enter' && handleCommit()}
            className="source-control-commit-input"
          />
          <button
            className="action-button source-control-commit-btn"
            onClick={handleCommit}
            disabled={isCommitting || !commitMessage.trim()}
          >
            {isCommitting ? '...' : 'Commit'}
          </button>
        </div>
        {commitResult && (
          <div className={`source-control-result ${commitResult.success ? 'success' : 'error'}`}>
            {commitResult.success ? '✓ Commit successful' : `✗ ${commitResult.error}`}
          </div>
        )}
      </div>
      <div className="sidebar-section-title">
        <span>CHANGES ({status.length})</span>
      </div>
      <div className="sidebar-content">
        {status.length === 0 && (
          <div className="empty-state">
            <i className="codicon codicon-check"></i>
            <p>No changes yet</p>
          </div>
        )}
        {status.map((item, index) => (
          <div key={index} className="file-explorer-item" style={{ paddingLeft: 12 }}>
            <span className={`git-status-badge git-status-${item.status === '??' ? 'untracked' : item.status.toLowerCase()}`}>
              {getStatusLabel(item.status)}
            </span>
            <span className="task-title">{item.file}</span>
          </div>
        ))}
      </div>
      <div className="sidebar-section-title">
        <span>RECENT COMMITS</span>
      </div>
      <div className="sidebar-content">
        {log.map((item, index) => (
          <div key={index} className="file-explorer-item" style={{ paddingLeft: 12 }}>
            <span className="git-commit-hash">{item.hash}</span>
            <span className="task-title">{item.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}
