import React, { useState, useEffect } from 'react';
import { Task } from '../../types';

interface PropertyPanelProps {
  task: Task | null;
  onTaskUpdate: (task: Task) => void;
}

export function PropertyPanel({ task, onTaskUpdate }: PropertyPanelProps) {
  if (!task) {
    return (
      <>
        <div className="sidebar-header">
          <div className="sidebar-header-left">
            <i className="codicon codicon-info"></i>
            <span>PROPERTIES</span>
          </div>
        </div>
        <div className="empty-state">
          <i className="codicon codicon-inbox"></i>
          <p>Select a task to view properties</p>
        </div>
      </>
    );
  }

  const properties = parseProperties(task.properties);

  const updateProperty = (key: string, value: string) => {
    const newProperties = { ...properties, [key]: value };
    const updatedTask = {
      ...task,
      properties: JSON.stringify(newProperties),
      updated_at: Date.now(),
    };
    onTaskUpdate(updatedTask);
  };

  const updateStatus = (status: 'active' | 'completed' | 'archived') => {
    const updatedTask = {
      ...task,
      status,
      updated_at: Date.now(),
    };
    onTaskUpdate(updatedTask);
  };

  return (
    <>
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <i className="codicon codicon-info"></i>
          <span>PROPERTIES</span>
        </div>
      </div>
      <div className="property-panel-body">
        {/* Title */}
        <div className="setting-group">
          <label className="setting-label">Title</label>
          <div className="property-value">{task.title}</div>
        </div>

        {/* Status */}
        <div className="setting-group">
          <label className="setting-label">Status</label>
          <div className="property-status-row">
            {(['active', 'completed', 'archived'] as const).map((s) => (
              <button
                key={s}
                className={`action-button ${task.status === s ? 'active' : ''}`}
                onClick={() => updateStatus(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div className="setting-group">
          <label className="setting-label">Priority</label>
          <select
            value={properties.priority || 'none'}
            onChange={(e) => updateProperty('priority', e.target.value)}
            className="property-select"
          >
            <option value="none">None</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Due Date */}
        <div className="setting-group">
          <label className="setting-label">Due Date</label>
          <input
            type="date"
            value={properties.due_date || ''}
            onChange={(e) => updateProperty('due_date', e.target.value)}
            className="property-input"
          />
        </div>

        {/* Tags */}
        <div className="setting-group">
          <label className="setting-label">Tags</label>
          <input
            type="text"
            value={properties.tags || ''}
            onChange={(e) => updateProperty('tags', e.target.value)}
            placeholder="Comma-separated tags"
            className="property-input"
          />
          {properties.tags && (
            <div className="property-tags-row">
              {properties.tags.split(',').map((tag: string, i: number) => (
                <span key={i} className="property-tag">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="setting-group">
          <label className="setting-label">Notes</label>
          <textarea
            value={properties.notes || ''}
            onChange={(e) => updateProperty('notes', e.target.value)}
            placeholder="Quick notes..."
            rows={3}
            className="property-textarea"
          />
        </div>

        {/* Metadata */}
        <div className="setting-group property-metadata-section">
          <label className="setting-label">Metadata</label>
          <div className="property-metadata">
            <div>Created: {new Date(task.created_at).toLocaleString()}</div>
            <div>Updated: {new Date(task.updated_at).toLocaleString()}</div>
            <div>Order: {task.order_index}</div>
            {task.document_id && <div>Document: {task.document_id.substring(0, 8)}...</div>}
          </div>
        </div>
      </div>
    </>
  );
}

function parseProperties(propertiesStr: string): Record<string, string> {
  try {
    return JSON.parse(propertiesStr);
  } catch {
    return {};
  }
}
