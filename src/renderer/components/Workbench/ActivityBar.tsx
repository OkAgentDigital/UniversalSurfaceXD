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
}

const topItems: ActivityItem[] = [
  { id: 'files', icon: 'codicon-files', label: 'Explorer' },
  { id: 'search', icon: 'codicon-search', label: 'Search' },
  { id: 'source-control', icon: 'codicon-source-control', label: 'Source Control' },
  { id: 'extensions', icon: 'codicon-extensions', label: 'Extensions' },
];

const bottomItems: ActivityItem[] = [
  { id: 'settings', icon: 'codicon-settings-gear', label: 'Settings' },
  { id: 'account', icon: 'codicon-account', label: 'Accounts' },
];

export function ActivityBar({ activeView, onViewChange, showPanel, onPanelToggle }: ActivityBarProps) {
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
