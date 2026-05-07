import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ActivityBar } from './ActivityBar';
import { StatusBar } from './StatusBar';
import { FileExplorer } from '../Sidebar/FileExplorer';

export function Workbench() {
  const [activeSidebarView, setActiveSidebarView] = useState('files');
  const [taskCount, setTaskCount] = useState(0);

  const renderSidebarContent = () => {
    switch (activeSidebarView) {
      case 'files':
        return <FileExplorer onTaskCountChange={setTaskCount} />;
      case 'search':
        return (
          <>
            <div className="sidebar-header">
              <div className="sidebar-header-left">
                <i className="codicon codicon-search"></i>
                <span>SEARCH</span>
              </div>
            </div>
            <div className="sidebar-content">
              <div className="empty-state">
                <i className="codicon codicon-search"></i>
                <p>Search coming soon</p>
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
        />
        <div className="sidebar">
          {renderSidebarContent()}
        </div>
        <div className="main-content">
          <div className="editor-area">
            <Outlet />
          </div>
        </div>
      </div>
      <StatusBar taskCount={taskCount} gitBranch="main" />
    </div>
  );
}
