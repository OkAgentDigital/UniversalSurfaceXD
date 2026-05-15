import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BoardContainer,
  BoardHeader,
  BoardTitle,
  ViewToggle,
  ViewButton,
  AddButton,
  ContentArea,
  EmptyState,
  LoadingState,
} from './styles';
import { KanbanView } from './KanbanView';
import { TableView } from './TableView';
import { Sidebar } from './Sidebar';
import { Task } from '../../types';

type ViewType = 'kanban' | 'table';

export function TaskBoard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<ViewType>('kanban');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const allTasks = await window.electron.getAllTasks();
      setTasks(allTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async () => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: 'New Task',
      status: 'active',
      order_index: tasks.length,
      created_at: Date.now(),
      updated_at: Date.now(),
      document_id: null,
      properties: '{}',
    };

    try {
      await window.electron.saveTask(newTask);
      setTasks(prev => [...prev, newTask]);
      setSelectedTask(newTask);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleTaskSave = async (updatedTask: Task) => {
    try {
      await window.electron.saveTask(updatedTask);
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
      setSelectedTask(updatedTask);
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  const handleTaskDelete = async (id: string) => {
    try {
      await window.electron.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      setSelectedTask(null);
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask: Task = {
      ...task,
      status: newStatus as 'active' | 'completed' | 'archived',
      updated_at: Date.now(),
    };

    try {
      await window.electron.saveTask(updatedTask);
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  if (loading) {
    return (
      <BoardContainer>
        <LoadingState>Loading tasks...</LoadingState>
      </BoardContainer>
    );
  }

  return (
    <BoardContainer>
      <BoardHeader>
        <ViewToggle>
          <ViewButton $active={viewType === 'kanban'} onClick={() => setViewType('kanban')}>
            Kanban
          </ViewButton>
          <ViewButton $active={viewType === 'table'} onClick={() => setViewType('table')}>
            Table
          </ViewButton>
        </ViewToggle>
        <AddButton onClick={handleAddTask}>+ New Task</AddButton>
      </BoardHeader>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <ContentArea style={{ flex: 1 }}>
          {tasks.length === 0 ? (
            <EmptyState>
              <span>No tasks yet</span>
              <span style={{ fontSize: 14 }}>Click "+ New Task" to get started</span>
            </EmptyState>
          ) : viewType === 'kanban' ? (
            <KanbanView
              tasks={tasks}
              onTaskClick={handleTaskClick}
              onTaskStatusChange={handleTaskStatusChange}
            />
          ) : (
            <TableView
              tasks={tasks}
              onTaskClick={handleTaskClick}
            />
          )}
        </ContentArea>

        <Sidebar
          task={selectedTask}
          onSave={handleTaskSave}
          onDelete={handleTaskDelete}
          onClose={() => setSelectedTask(null)}
        />
      </div>
    </BoardContainer>
  );
}
