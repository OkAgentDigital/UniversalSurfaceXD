import React from 'react';

interface ActivityItem {
  id: string;
  icon: string;
  label: string;
}

interface ActivityBarProps {
  activeView: string;
  onViewChange: (viewId: string) => void;
  showPanel: boolean;
  onPanelToggle: () => void;
  showRightPanel?: boolean;
  onRightPanelToggle?: () => void;
}

const topItems: ActivityItem[] = [
  { id: 'files', icon: 'codicon-files', label: 'Explorer' },
  { id: 'search', icon: 'codicon-search', label: 'Search' },
  { id: 'source-control', icon: 'codicon-source-control', label: 'Source Control' },
  { id: 'extensions', icon: 'codicon-extensions', label: 'Extensions' },
  { id: 'agents', icon: 'codicon-robot', label: 'Agents' },
  { id: 'skills', icon: 'codicon-mortar-board', label: 'Skills' },
  { id: 'workflows', icon: 'codicon-play-circle', label: 'Workflows' },
];

const bottomItems: ActivityItem[] = [
  { id: 'variables', icon: 'codicon-symbol-key', label: 'Variables' },
  { id: 'checks', icon: 'codicon-pass', label: 'Checks' },
  { id: 'tasks', icon: 'codicon-list-tree', label: 'Tasks' },
  { id: 'settings', icon: 'codicon-settings-gear', label: 'Settings' },
  { id: 'account', icon: 'codicon-account', label: 'Accounts' },
];

export function ActivityBar({
  activeView,
  onViewChange,
  showPanel,
  onPanelToggle,
  showRightPanel,
  onRightPanelToggle,
}: ActivityBarProps) {
  return (
    <div className="activity-bar">
      <div className="activity-bar-top">
        {topItems.map(item => (
          <div
            key={item.id}
            className={`activity-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
            title={item.label}
          >
            <i className={`codicon ${item.icon}`}></i>
          </div>
        ))}
      </div>
      <div className="activity-bar-bottom">
        <div
          className={`activity-item ${showPanel ? 'active' : ''}`}
          onClick={onPanelToggle}
          title="Toggle Terminal Panel"
        >
          <i className="codicon codicon-terminal"></i>
        </div>
        {onRightPanelToggle && (
          <div
            className={`activity-item ${showRightPanel ? 'active' : ''}`}
            onClick={onRightPanelToggle}
            title="Toggle AI Chat Panel"
          >
            <i className="codicon codicon-comment-discussion"></i>
          </div>
        )}
        {bottomItems.map(item => (
          <div
            key={item.id}
            className={`activity-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
            title={item.label}
          >
            <i className={`codicon ${item.icon}`}></i>
          </div>
        ))}
      </div>
    </div>
  );
}
