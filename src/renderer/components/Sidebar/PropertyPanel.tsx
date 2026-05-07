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
      <div className="sidebar-content" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Title */}
        <div className="setting-group">
          <label className="setting-label">Title</label>
          <div style={{ fontSize: 13, color: '#cccccc', fontWeight: 500 }}>{task.title}</div>
        </div>

        {/* Status */}
        <div className="setting-group">
          <label className="setting-label">Status</label>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['active', 'completed', 'archived'] as const).map((s) => (
              <button
                key={s}
                className={`action-button ${task.status === s ? 'active' : ''}`}
                onClick={() => updateStatus(s)}
                style={{
                  flex: 1,
                  fontSize: 11,
                  background: task.status === s
                    ? s === 'active' ? '#0e639c' : s === 'completed' ? '#1e3a2e' : '#3a1e1e'
                    : '#3c3c3c',
                  color: task.status === s
                    ? s === 'active' ? '#75beff' : s === 'completed' ? '#4ec9b0' : '#f14c4c'
                    : '#858585',
                }}
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
            style={{
              width: '100%',
              background: '#3c3c3c',
              border: '1px solid #555',
              borderRadius: 4,
              padding: '4px 8px',
              color: '#cccccc',
              fontSize: 12,
              outline: 'none',
            }}
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
            style={{
              width: '100%',
              background: '#3c3c3c',
              border: '1px solid #555',
              borderRadius: 4,
              padding: '4px 8px',
              color: '#cccccc',
              fontSize: 12,
              outline: 'none',
              colorScheme: 'dark',
            }}
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
            style={{
              width: '100%',
              background: '#3c3c3c',
              border: '1px solid #555',
              borderRadius: 4,
              padding: '4px 8px',
              color: '#cccccc',
              fontSize: 12,
              outline: 'none',
            }}
          />
          {properties.tags && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
              {properties.tags.split(',').map((tag: string, i: number) => (
                <span key={i} style={{
                  fontSize: 10,
                  padding: '2px 6px',
                  borderRadius: 8,
                  background: '#264f78',
                  color: '#75beff',
                }}>
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
            style={{
              width: '100%',
              background: '#3c3c3c',
              border: '1px solid #555',
              borderRadius: 4,
              padding: '4px 8px',
              color: '#cccccc',
              fontSize: 12,
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Metadata */}
        <div className="setting-group" style={{ borderTop: '1px solid #3c3c3c', paddingTop: 12 }}>
          <label className="setting-label">Metadata</label>
          <div style={{ fontSize: 10, color: '#858585', lineHeight: 1.8 }}>
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
