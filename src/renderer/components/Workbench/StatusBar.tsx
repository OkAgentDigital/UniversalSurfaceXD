import React from 'react';

interface StatusBarProps {
  language?: string;
  lineCount?: number;
  taskCount?: number;
  gitBranch?: string;
}

export function StatusBar({ language, lineCount, taskCount, gitBranch }: StatusBarProps) {
  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <span className="status-item" title="Git Branch">
          <i className="codicon codicon-source-control"></i>
          {gitBranch || 'main'}
        </span>
      </div>
      <div className="status-bar-right">
        {taskCount !== undefined && (
          <span className="status-item" title="Total Tasks">
            <i className="codicon codicon-checklist"></i>
            {taskCount} tasks
          </span>
        )}
        {language && (
          <span className="status-item" title="Language Mode">
            <i className="codicon codicon-symbol-namespace"></i>
            {language}
          </span>
        )}
        {lineCount !== undefined && (
          <span className="status-item" title="Line Count">
            <i className="codicon codicon-symbol-key"></i>
            Ln {lineCount}
          </span>
        )}
        <span className="status-item" title="Encoding">
          UTF-8
        </span>
        <span className="status-item" title="Indentation">
          Spaces: 2
        </span>
      </div>
    </div>
  );
}
