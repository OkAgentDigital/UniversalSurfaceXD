import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { ActivityBar } from './ActivityBar';
import { StatusBar } from './StatusBar';
import { FileExplorer } from '../Sidebar/FileExplorer';
import { SearchPanel } from '../Sidebar/SearchPanel';
import { SourceControlPanel } from '../Sidebar/SourceControlPanel';
import { SettingsPanel } from '../Sidebar/SettingsPanel';
import { PropertyPanel } from '../Sidebar/PropertyPanel';
import { TerminalPanel } from '../Panel/TerminalPanel';
import { Task } from '../../types';

export function Workbench() {
  const [activeSidebarView, setActiveSidebarView] = useState('files');
  const [showPanel, setShowPanel] = useState(false);
  const [taskCount, setTaskCount] = useState(0);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [gitBranch, setGitBranch] = useState('main');

  const handleTaskUpdate = useCallback(async (updatedTask: Task) => {
    try {
      await window.electron.saveTask(updatedTask);
      setSelectedTask(updatedTask);
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  }, []);

  const renderSidebarContent = () => {
    switch (activeSidebarView) {
      case 'files':
        return (
          <FileExplorer
            onTaskCountChange={setTaskCount}
            onTaskSelect={setSelectedTask}
          />
        );
      case 'search':
        return <SearchPanel />;
      case 'source-control':
        return <SourceControlPanel />;
      case 'extensions':
        return (
          <>
            <div className="sidebar-header">
              <div className="sidebar-header-left">
                <i className="codicon codicon-extensions"></i>
                <span>EXTENSIONS</span>
              </div>
            </div>
            <div className="sidebar-content">
              <div className="empty-state">
                <i className="codicon codicon-extensions"></i>
                <p>Extensions marketplace coming soon</p>
              </div>
            </div>
          </>
        );
      case 'settings':
        return <SettingsPanel />;
      case 'account':
        return (
          <>
            <div className="sidebar-header">
              <div className="sidebar-header-left">
                <i className="codicon codicon-account"></i>
                <span>ACCOUNT</span>
              </div>
            </div>
            <div className="sidebar-content">
              <div className="empty-state">
                <i className="codicon codicon-account"></i>
                <p>Cloud sync coming in a future release</p>
              </div>
            </div>
          </>
        );
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
      <div className="workbench-body">
        <ActivityBar
          activeView={activeSidebarView}
          onViewChange={setActiveSidebarView}
          showPanel={showPanel}
          onPanelToggle={() => setShowPanel(!showPanel)}
        />
        <div className="sidebar">
          {renderSidebarContent()}
        </div>
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
      </div>
      <StatusBar
        taskCount={taskCount}
        gitBranch={gitBranch}
        onGitBranchChange={setGitBranch}
        showPanel={showPanel}
        onPanelToggle={() => setShowPanel(!showPanel)}
      />
    </div>
  );
}
