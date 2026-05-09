import React, { useEffect, useState } from 'react';
import { UniversuiMode } from '../../types';

interface StatusBarProps {
  taskCount: number;
  gitBranch: string;
  onGitBranchChange: (branch: string) => void;
  showPanel: boolean;
  onPanelToggle: () => void;
  showRightPanel?: boolean;
  onRightPanelToggle?: () => void;
}

export function StatusBar({
  taskCount,
  gitBranch,
  onGitBranchChange,
  showPanel,
  onPanelToggle,
  showRightPanel,
  onRightPanelToggle,
}: StatusBarProps) {
  const [mode, setMode] = useState<UniversuiMode>('docs');
  const [sonicHealth, setSonicHealth] = useState<'healthy' | 'degraded'>('healthy');

  useEffect(() => {
    const loadBranch = async () => {
      try {
        const branch = await window.electron.getGitBranch();
        onGitBranchChange(branch);
      } catch {
        onGitBranchChange('main');
      }
    };
    loadBranch();
  }, [onGitBranchChange]);

  useEffect(() => {
    const loadMode = async () => {
      try {
        const m = await window.electron.modeGet();
        setMode(m);
      } catch {}
    };
    loadMode();
  }, []);

  useEffect(() => {
    const loadHealth = async () => {
      try {
        const h = await window.electron.sonicHealth();
        setSonicHealth(h.status);
      } catch {}
    };
    loadHealth();
  }, []);

  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <div className="status-item" title="Git Branch">
          <i className="codicon codicon-source-control"></i>
          <span>{gitBranch}</span>
        </div>
        <div className="status-item" title="Task Count">
          <i className="codicon codicon-checklist"></i>
          <span>{taskCount} tasks</span>
        </div>
        <div className={`status-item ${mode === 'dev' ? 'dev-mode' : 'docs-mode'}`} title="Universui Mode">
          <i className={`codicon ${mode === 'dev' ? 'codicon-code' : 'codicon-book'}`}></i>
          <span>{mode === 'dev' ? 'DEV' : 'DOCS'}</span>
        </div>
        <div className="status-item" title="SonicScrewdriver Health">
          <i className={`codicon ${sonicHealth === 'healthy' ? 'codicon-pass' : 'codicon-warning'}`}
             style={{ color: sonicHealth === 'healthy' ? '#4ec9b0' : '#ce9178' }}></i>
          <span>Sonic</span>
        </div>
      </div>
      <div className="status-bar-right">
        <div
          className={`status-item ${showPanel ? 'active' : ''}`}
          onClick={onPanelToggle}
          title="Toggle Terminal"
        >
          <i className="codicon codicon-terminal"></i>
          <span>Terminal</span>
        </div>
        {onRightPanelToggle && (
          <div
            className={`status-item ${showRightPanel ? 'active' : ''}`}
            onClick={onRightPanelToggle}
            title="Toggle AI Chat"
          >
            <i className="codicon codicon-comment-discussion"></i>
            <span>AI Chat</span>
          </div>
        )}
        <div className="status-item" title="Language Mode">
          <i className="codicon codicon-code"></i>
          <span>TypeScript</span>
        </div>
        <div className="status-item" title="Line Ending">
          <i className="codicon codicon-type-hierarchy"></i>
          <span>UTF-8</span>
        </div>
        <div className="status-item" title="Indentation">
          <i className="codicon codicon-indent"></i>
          <span>Spaces: 2</span>
        </div>
        <div className="status-item" title="Encoding">
          <i className="codicon codicon-library"></i>
          <span>LF</span>
        </div>
      </div>
    </div>
  );
}
