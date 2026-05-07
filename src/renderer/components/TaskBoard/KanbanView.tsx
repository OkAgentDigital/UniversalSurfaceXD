import React from 'react';
import { useDrop } from 'react-dnd';
import { KanbanContainer, KanbanColumn, ColumnHeader } from './styles';
import { TaskCard } from './TaskCard';
import { Task } from '../../types';

interface KanbanViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskStatusChange: (taskId: string, newStatus: string) => void;
}

const COLUMNS = [
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'archived', label: 'Archived' },
];

function ColumnDropZone({ status, children, onDrop }: { status: string; children: React.ReactNode; onDrop: (id: string, status: string) => void }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK_CARD',
    drop: (item: { id: string }) => onDrop(item.id, status),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [status, onDrop]);

  return (
    <KanbanColumn
      ref={drop}
      style={{
        backgroundColor: isOver ? '#2a2d2a' : '#252526',
        transition: 'background-color 0.2s',
      }}
    >
      {children}
    </KanbanColumn>
  );
}

export function KanbanView({ tasks, onTaskClick, onTaskStatusChange }: KanbanViewProps) {
  return (
    <KanbanContainer>
      {COLUMNS.map(column => {
        const columnTasks = tasks.filter(t => t.status === column.key);
        return (
          <ColumnDropZone
            key={column.key}
            status={column.key}
            onDrop={onTaskStatusChange}
          >
            <ColumnHeader>
              <span>{column.label}</span>
              <span style={{ color: '#666', fontSize: 12 }}>{columnTasks.length}</span>
            </ColumnHeader>
            {columnTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={onTaskClick}
              />
            ))}
          </ColumnDropZone>
        );
      })}
    </KanbanContainer>
  );
}
