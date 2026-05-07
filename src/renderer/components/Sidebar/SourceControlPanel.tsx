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
      case 'M': return <i className="codicon codicon-circle-filled" style={{ color: '#ffcc00', fontSize: 12 }}></i>;
      case 'A': return <i className="codicon codicon-circle-filled" style={{ color: '#4ec9b0', fontSize: 12 }}></i>;
      case 'D': return <i className="codicon codicon-circle-filled" style={{ color: '#f14c4c', fontSize: 12 }}></i>;
      case '??': return <i className="codicon codicon-circle-outline" style={{ color: '#858585', fontSize: 12 }}></i>;
      default: return <i className="codicon codicon-circle-outline" style={{ color: '#858585', fontSize: 12 }}></i>;
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
      <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#cccccc' }}>
          <i className="codicon codicon-source-control"></i>
          <span>{branch}</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="action-button" onClick={handlePull} disabled={isPulling}>
            <i className="codicon codicon-cloud-download"></i>
            {isPulling ? '...' : 'Pull'}
          </button>
          <button className="action-button" onClick={handlePush} disabled={isPushing}>
            <i className="codicon codicon-cloud-upload"></i>
            {isPushing ? '...' : 'Push'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <input
            type="text"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Commit message..."
            onKeyDown={(e) => e.key === 'Enter' && handleCommit()}
            style={{
              flex: 1,
              background: '#3c3c3c',
              border: '1px solid #555',
              borderRadius: 4,
              padding: '4px 8px',
              color: '#cccccc',
              fontSize: 12,
              outline: 'none',
            }}
          />
          <button
            className="action-button"
            onClick={handleCommit}
            disabled={isCommitting || !commitMessage.trim()}
            style={{ background: '#0e639c' }}
          >
            {isCommitting ? '...' : 'Commit'}
          </button>
        </div>
        {commitResult && (
          <div style={{
            fontSize: 11,
            padding: '4px 8px',
            borderRadius: 4,
            background: commitResult.success ? '#1e3a2e' : '#3a1e1e',
            color: commitResult.success ? '#4ec9b0' : '#f14c4c',
          }}>
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
            <span style={{
              width: 20,
              height: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 'bold',
              borderRadius: 2,
              background: item.status === 'M' ? '#ffcc0022' : item.status === 'A' ? '#4ec9b022' : item.status === 'D' ? '#f14c4c22' : '#85858522',
              color: item.status === 'M' ? '#ffcc00' : item.status === 'A' ? '#4ec9b0' : item.status === 'D' ? '#f14c4c' : '#858585',
            }}>
              {getStatusLabel(item.status)}
            </span>
            <span className="task-title" style={{ fontSize: 12 }}>{item.file}</span>
          </div>
        ))}
      </div>
      <div className="sidebar-section-title">
        <span>RECENT COMMITS</span>
      </div>
      <div className="sidebar-content">
        {log.map((item, index) => (
          <div key={index} className="file-explorer-item" style={{ paddingLeft: 12 }}>
            <span style={{ color: '#75beff', fontSize: 11, fontFamily: 'monospace', width: 48 }}>{item.hash}</span>
            <span className="task-title" style={{ fontSize: 11 }}>{item.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}
