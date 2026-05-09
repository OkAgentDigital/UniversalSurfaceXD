import React, { useState, useCallback, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ActivityBar } from './ActivityBar';
import { StatusBar } from './StatusBar';
import { CustomTitleBar } from './CustomTitleBar';
import { FileExplorer } from '../Sidebar/FileExplorer';
import { SearchPanel } from '../Sidebar/SearchPanel';
import { SourceControlPanel } from '../Sidebar/SourceControlPanel';
import { SettingsPanel } from '../Sidebar/SettingsPanel';
import { TerminalPanel } from '../Panel/TerminalPanel';
import { AIChatPanel } from '../Panel/AIChatPanel';
import { AccountPanel } from '../Account/AccountPanel';
import { ExtensionMarketplace } from '../Extensions/ExtensionMarketplace';
import { AgentsPanel, SkillsPanel, ChecksPanel, SystemTasksPanel, VariablesPanel, WorkflowsPanel } from '../Panel/SourceControlPanels';
import { Task } from '../../types';

export function Workbench() {
  const [activeSidebarView, setActiveSidebarView] = useState('files');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [taskCount, setTaskCount] = useState(0);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [gitBranch, setGitBranch] = useState('main');
  const [currentDocument, setCurrentDocument] = useState<string | undefined>();

  // Listen for custom events from the title bar
  useEffect(() => {
    const handleOpenSettings = () => {
      setActiveSidebarView('settings');
      setShowSidebar(true);
    };

    window.addEventListener('universui:openSettings', handleOpenSettings);
    return () => window.removeEventListener('universui:openSettings', handleOpenSettings);
  }, []);

  const handleTaskUpdate = useCallback(async (updatedTask: Task) => {
    try {
      await window.electron.saveTask(updatedTask);
      setSelectedTask(updatedTask);
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  }, []);

  const handleToggleRightPanel = useCallback(() => {
    setShowRightPanel(prev => !prev);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setShowSidebar(prev => !prev);
  }, []);

  const handleTogglePanel = useCallback(() => {
    setShowPanel(prev => !prev);
  }, []);

  const handleRightPanelResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightPanelWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = startX - moveEvent.clientX;
      const newWidth = Math.max(200, Math.min(600, startWidth + delta));
      setRightPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [rightPanelWidth]);

  const handleOpenCommandPalette = useCallback(() => {
    // Placeholder for command palette
    console.log('Command palette opened');
  }, []);

  const renderSidebarContent = () => {
    switch (activeSidebarView) {
      case 'files':
        return (
          <FileExplorer
            onTaskCountChange={setTaskCount}
            onTaskSelect={(task) => {
              setSelectedTask(task);
              if (task) setCurrentDocument(task.title);
            }}
          />
        );
      case 'search':
        return <SearchPanel />;
      case 'source-control':
        return <SourceControlPanel />;
      case 'extensions':
        return <ExtensionMarketplace />;
      case 'agents':
        return <AgentsPanel />;
      case 'skills':
        return <SkillsPanel />;
      case 'workflows':
        return <WorkflowsPanel />;
      case 'variables':
        return <VariablesPanel />;
      case 'checks':
        return <ChecksPanel />;
      case 'tasks':
        return <SystemTasksPanel />;
      case 'settings':
        return <SettingsPanel />;
      case 'account':
        return <AccountPanel />;
      default:
        return (
          <>
            <div className="sidebar-header">
              <div className="sidebar-header-left">
                <i className="codicon codicon-files"></i>
                <span>EXPLORER</span>
              </div>
            </div>
            <div className="sidebar-content">
              <div className="empty-state">
                <i className="codicon codicon-files"></i>
                <p>Select a view</p>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="workbench">
      <CustomTitleBar
        showRightPanel={showRightPanel}
        onToggleRightPanel={handleToggleRightPanel}
        showSidebar={showSidebar}
        onToggleSidebar={handleToggleSidebar}
        showPanel={showPanel}
        onTogglePanel={handleTogglePanel}
        currentDocument={currentDocument}
        onOpenCommandPalette={handleOpenCommandPalette}
      />
      <div className="workbench-body">
        <ActivityBar
          activeView={activeSidebarView}
          onViewChange={setActiveSidebarView}
          showPanel={showPanel}
          onPanelToggle={handleTogglePanel}
          showRightPanel={showRightPanel}
          onRightPanelToggle={handleToggleRightPanel}
        />
        {showSidebar && (
          <div className="sidebar">
            {renderSidebarContent()}
          </div>
        )}
        <div className="main-content">
          <div className="editor-area">
            <Outlet context={{ selectedTask, onTaskUpdate: handleTaskUpdate }} />
          </div>
          {showPanel && (
            <div className="panel">
              <TerminalPanel />
            </div>
          )}
        </div>
        {showRightPanel && (
          <>
            <div
              className="right-panel-resize-handle"
              onMouseDown={handleRightPanelResize}
            />
            <div
              className="right-panel"
              style={{ width: rightPanelWidth }}
            >
              <AIChatPanel />
            </div>
          </>
        )}
      </div>
      <StatusBar
        taskCount={taskCount}
        gitBranch={gitBranch}
        onGitBranchChange={setGitBranch}
        showPanel={showPanel}
        onPanelToggle={handleTogglePanel}
        showRightPanel={showRightPanel}
        onRightPanelToggle={handleToggleRightPanel}
      />
    </div>
  );
}
