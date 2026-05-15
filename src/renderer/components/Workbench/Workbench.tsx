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
import { OKChatPanel } from '../Panel/OKChatPanel';
import { AccountPanel } from '../Account/AccountPanel';
import { ExtensionMarketplace } from '../Extensions/ExtensionMarketplace';
import { WorkflowsPanel } from '../Panel/SourceControlPanels';
import { CombinedDevOpsPanel } from '../Sidebar/CombinedDevOpsPanel';
import { Task } from '../../types';

// Load saved layout sizes from localStorage
function loadLayoutSize(key: string, defaultValue: number): number {
  try {
    const saved = localStorage.getItem(key);
    return saved ? parseInt(saved, 10) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveLayoutSize(key: string, value: number) {
  try {
    localStorage.setItem(key, value.toString());
  } catch {}
}

export function Workbench() {
  const [activeSidebarView, setActiveSidebarView] = useState('files');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(() => loadLayoutSize('usxd-sidebar-width', 260));
  const [rightPanelWidth, setRightPanelWidth] = useState(() => loadLayoutSize('usxd-right-panel-width', 320));
  const [panelHeight, setPanelHeight] = useState(() => loadLayoutSize('usxd-panel-height', 200));
  const [taskCount, setTaskCount] = useState(0);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [gitBranch, setGitBranch] = useState('main');
  const [currentDocument, setCurrentDocument] = useState<string | undefined>();

  // Persist layout sizes
  useEffect(() => { saveLayoutSize('usxd-sidebar-width', sidebarWidth); }, [sidebarWidth]);
  useEffect(() => { saveLayoutSize('usxd-right-panel-width', rightPanelWidth); }, [rightPanelWidth]);
  useEffect(() => { saveLayoutSize('usxd-panel-height', panelHeight); }, [panelHeight]);

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

  // Sidebar resize
  const handleSidebarResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.max(170, Math.min(500, startWidth + delta));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [sidebarWidth]);

  // Right panel resize
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

  // Bottom panel resize
  const handlePanelResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = panelHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = startY - moveEvent.clientY;
      const newHeight = Math.max(100, Math.min(500, startHeight + delta));
      setPanelHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [panelHeight]);

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
      case 'devops':
        return <CombinedDevOpsPanel />;
      case 'workflows':
        return <WorkflowsPanel />;
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
          <>
            <div
              className="sidebar"
              style={{ width: sidebarWidth }}
            >
              {renderSidebarContent()}
            </div>
            <div
              className="sidebar-resize-handle"
              onMouseDown={handleSidebarResize}
            />
          </>
        )}
        <div className="main-content">
          <div className="editor-area">
            <Outlet context={{ selectedTask, onTaskUpdate: handleTaskUpdate }} />
          </div>
          {showPanel && (
            <>
              <div
                className="panel-resize-handle"
                onMouseDown={handlePanelResize}
              />
              <div
                className="panel"
                style={{ height: panelHeight }}
              >
                <TerminalPanel />
              </div>
            </>
          )}
        </div>
        {showRightPanel && (
          <div
            className="right-panel-overlay"
            onClick={(e) => {
              // Close if clicking the overlay background
              if (e.target === e.currentTarget) {
                handleToggleRightPanel();
              }
            }}
          >
            <div
              className="right-panel-popover"
              style={{ width: rightPanelWidth }}
            >
              <OKChatPanel onClose={handleToggleRightPanel} />
            </div>
          </div>
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
