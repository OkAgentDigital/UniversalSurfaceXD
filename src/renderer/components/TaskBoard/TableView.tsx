import React from 'react';
import { TableContainer, Table, TableHeader, TableRow, TableCell, StatusBadge } from './styles';
import { Task } from '../../types';

interface TableViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function TableView({ tasks, onTaskClick }: TableViewProps) {
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <TableHeader>Title</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Priority</TableHeader>
            <TableHeader>Created</TableHeader>
            <TableHeader>Updated</TableHeader>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => {
            const properties = JSON.parse(task.properties || '{}');
            const priority = properties.priority || '-';

            return (
              <TableRow key={task.id} onClick={() => onTaskClick(task)}>
                <TableCell>{task.title}</TableCell>
                <TableCell>
                  <StatusBadge $status={task.status}>
                    {task.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <span style={{
                    color: priority === 'high' ? '#f44336' : priority === 'medium' ? '#ff9800' : priority === 'low' ? '#4caf50' : '#888',
                  }}>
                    {priority}
                  </span>
                </TableCell>
                <TableCell>{formatDate(task.created_at)}</TableCell>
                <TableCell>{formatDate(task.updated_at)}</TableCell>
              </TableRow>
            );
          })}
        </tbody>
      </Table>
    </TableContainer>
  );
}
