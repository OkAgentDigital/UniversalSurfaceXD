import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SidebarContainer,
  SidebarTitle,
  SidebarSection,
  SidebarLabel,
  SidebarInput,
  SidebarSelect,
  OpenEditorButton,
  DeleteButton,
} from './styles';
import { Task } from '../../types';

interface SidebarProps {
  task: Task | null;
  onSave: (task: Task) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function Sidebar({ task, onSave, onDelete, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'active' | 'completed' | 'archived'>('active');
  const [priority, setPriority] = useState('none');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setStatus(task.status);
      const properties = JSON.parse(task.properties || '{}');
      setPriority(properties.priority || 'none');
    }
  }, [task]);

  if (!task) {
    return (
      <SidebarContainer>
        <SidebarTitle>Task Details</SidebarTitle>
        <p style={{ color: '#666', fontSize: 14 }}>Select a task to view details</p>
      </SidebarContainer>
    );
  }

  const handleSave = () => {
    const properties = JSON.parse(task.properties || '{}');
    properties.priority = priority === 'none' ? undefined : priority;

    const updatedTask: Task = {
      ...task,
      title,
      status,
      properties: JSON.stringify(properties),
      updated_at: Date.now(),
    };
    onSave(updatedTask);
  };

  const handleOpenInEditor = () => {
    if (task.document_id) {
      navigate(`/editor/${task.document_id}`);
    } else {
      // Create a new document for this task
      const newDocId = crypto.randomUUID();
      const updatedTask: Task = {
        ...task,
        document_id: newDocId,
        updated_at: Date.now(),
      };
      onSave(updatedTask);
      navigate(`/editor/${newDocId}`);
    }
  };

  return (
    <SidebarContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <SidebarTitle>Task Details</SidebarTitle>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#888',
            cursor: 'pointer',
            fontSize: 18,
          }}
        >
          ✕
        </button>
      </div>

      <SidebarSection>
        <SidebarLabel>Title</SidebarLabel>
        <SidebarInput
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          placeholder="Task title"
        />
      </SidebarSection>

      <SidebarSection>
        <SidebarLabel>Status</SidebarLabel>
        <SidebarSelect
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as 'active' | 'completed' | 'archived');
            const updatedTask: Task = {
              ...task,
              status: e.target.value as 'active' | 'completed' | 'archived',
              updated_at: Date.now(),
            };
            onSave(updatedTask);
          }}
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </SidebarSelect>
      </SidebarSection>

      <SidebarSection>
        <SidebarLabel>Priority</SidebarLabel>
        <SidebarSelect
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value);
            const properties = JSON.parse(task.properties || '{}');
            properties.priority = e.target.value === 'none' ? undefined : e.target.value;
            const updatedTask: Task = {
              ...task,
              properties: JSON.stringify(properties),
              updated_at: Date.now(),
            };
            onSave(updatedTask);
          }}
        >
          <option value="none">None</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </SidebarSelect>
      </SidebarSection>

      <OpenEditorButton onClick={handleOpenInEditor}>
        Open in Editor
      </OpenEditorButton>

      <DeleteButton onClick={() => onDelete(task.id)}>
        Delete Task
      </DeleteButton>
    </SidebarContainer>
  );
}
