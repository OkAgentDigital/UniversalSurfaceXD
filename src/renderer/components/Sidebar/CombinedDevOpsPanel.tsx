import React, { useState } from 'react';
import { AgentsPanel, SkillsPanel, ChecksPanel, SystemTasksPanel, VariablesPanel, SnacksPanel } from '../Panel/SourceControlPanels';

type DevOpsTab = 'agents' | 'skills' | 'variables' | 'tasks' | 'checks' | 'snacks';

interface TabConfig {
  id: DevOpsTab;
  label: string;
  icon: string;
}

const tabs: TabConfig[] = [
  { id: 'agents', label: 'Agents', icon: 'codicon-robot' },
  { id: 'skills', label: 'Skills', icon: 'codicon-mortar-board' },
  { id: 'snacks', label: 'Snacks', icon: 'codicon-package' },
  { id: 'variables', label: 'Variables', icon: 'codicon-symbol-key' },
  { id: 'tasks', label: 'Tasks', icon: 'codicon-list-tree' },
  { id: 'checks', label: 'Checks', icon: 'codicon-pass' },
];

export function CombinedDevOpsPanel() {
  const [activeTab, setActiveTab] = useState<DevOpsTab>('agents');

  const renderContent = () => {
    switch (activeTab) {
      case 'agents':
        return <AgentsPanel />;
      case 'skills':
        return <SkillsPanel />;
      case 'snacks':
        return <SnacksPanel />;
      case 'variables':
        return <VariablesPanel />;
      case 'tasks':
        return <SystemTasksPanel />;
      case 'checks':
        return <ChecksPanel />;
      default:
        return <AgentsPanel />;
    }
  };

  return (
    <div className="devops-panel">
      <div className="devops-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`devops-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
          >
            <i className={`codicon ${tab.icon}`}></i>
            <span className="devops-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="devops-content">
        {renderContent()}
      </div>
    </div>
  );
}
