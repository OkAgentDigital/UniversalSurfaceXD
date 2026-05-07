import React from 'react';
import { useDrag } from 'react-dnd';
import { TaskCardContainer, TaskTitle, TaskMeta, StatusBadge } from './styles';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

const ItemType = 'TASK_CARD';

export function TaskCard({ task, onClick }: TaskCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [task.id, task.status]);

  const properties = JSON.parse(task.properties || '{}');
  const priority = properties.priority;

  return (
    <TaskCardContainer
      ref={drag}
      onClick={() => onClick(task)}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
    >
      <TaskTitle>{task.title}</TaskTitle>
      <TaskMeta>
        <StatusBadge $status={task.status}>
          {task.status}
        </StatusBadge>
        {priority && (
          <span style={{ color: priority === 'high' ? '#f44336' : priority === 'medium' ? '#ff9800' : '#4caf50' }}>
            {priority}
          </span>
        )}
      </TaskMeta>
    </TaskCardContainer>
  );
}
