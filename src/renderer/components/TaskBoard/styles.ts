import styled from 'styled-components';

export const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #1e1e1e;
  color: #d4d4d4;
`;

export const BoardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #333;
  background-color: #252526;
`;

export const BoardTitle = styled.h1`
  font-size: var(--usx-font-size-xl);
  font-weight: 600;
  color: #e0e0e0;
  margin: 0;
`;

export const ViewToggle = styled.div`
  display: flex;
  gap: 8px;
`;

export const ViewButton = styled.button<{ $active: boolean }>`
  padding: 6px 16px;
  border: 1px solid ${props => props.$active ? '#0078d4' : '#555'};
  border-radius: 4px;
  background-color: ${props => props.$active ? '#0078d4' : 'transparent'};
  color: ${props => props.$active ? '#fff' : '#ccc'};
  cursor: pointer;
  font-size: var(--usx-font-size-sm);
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.$active ? '#0078d4' : '#333'};
  }
`;

export const AddButton = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  background-color: #0078d4;
  color: white;
  cursor: pointer;
  font-size: var(--usx-font-size-base);
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1a8ad4;
  }
`;

export const ContentArea = styled.div`
  flex: 1;
  overflow: auto;
  padding: 24px;
`;

// Kanban styles
export const KanbanContainer = styled.div`
  display: flex;
  gap: 16px;
  height: 100%;
  overflow-x: auto;
`;

export const KanbanColumn = styled.div`
  min-width: 280px;
  max-width: 320px;
  flex: 1;
  background-color: #252526;
  border-radius: 8px;
  padding: 12px;
`;

export const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin-bottom: 12px;
  font-weight: 600;
  font-size: var(--usx-font-size-base);
  color: #ccc;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const TaskCardContainer = styled.div`
  background-color: #2d2d2d;
  border: 1px solid #3c3c3c;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #0078d4;
    background-color: #333;
  }
`;

export const TaskTitle = styled.div`
  font-size: var(--usx-font-size-base);
  color: #e0e0e0;
  margin-bottom: 8px;
  word-break: break-word;
`;

export const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--usx-font-size-sm);
  color: #888;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  padding: 2px 8px;
  border-radius: 10px;
  font-size: var(--usx-font-size-xs);
  font-weight: 500;
  background-color: ${props => 
    props.$status === 'active' ? '#1a3a5c' : 
    props.$status === 'completed' ? '#1a4a2a' : '#3a3a3a'};
  color: ${props => 
    props.$status === 'active' ? '#4a9eff' : 
    props.$status === 'completed' ? '#4caf50' : '#888'};
`;

// Table styles
export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: 12px 16px;
  border-bottom: 2px solid #333;
  color: #888;
  font-size: var(--usx-font-size-sm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #2d2d2d;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2a2a2a;
  }
`;

export const TableCell = styled.td`
  padding: 12px 16px;
  font-size: var(--usx-font-size-base);
  color: #d4d4d4;
`;

// Sidebar styles
export const SidebarContainer = styled.div`
  width: 320px;
  background-color: #252526;
  border-left: 1px solid #333;
  padding: 20px;
  overflow-y: auto;
`;

export const SidebarTitle = styled.h2`
  font-size: var(--usx-font-size-base);
  color: #e0e0e0;
  margin-bottom: 16px;
`;

export const SidebarSection = styled.div`
  margin-bottom: 20px;
`;

export const SidebarLabel = styled.label`
  display: block;
  font-size: var(--usx-font-size-sm);
  color: #888;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const SidebarInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  background-color: #3c3c3c;
  color: #e0e0e0;
  font-size: var(--usx-font-size-base);

  &:focus {
    outline: none;
    border-color: #0078d4;
  }
`;

export const SidebarSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  background-color: #3c3c3c;
  color: #e0e0e0;
  font-size: var(--usx-font-size-base);

  &:focus {
    outline: none;
    border-color: #0078d4;
  }
`;

export const OpenEditorButton = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #0078d4;
  color: white;
  cursor: pointer;
  font-size: var(--usx-font-size-base);
  font-weight: 500;
  margin-top: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1a8ad4;
  }
`;

export const DeleteButton = styled.button`
  width: 100%;
  padding: 10px;
  border: 1px solid #c42b1c;
  border-radius: 4px;
  background-color: transparent;
  color: #c42b1c;
  cursor: pointer;
  font-size: var(--usx-font-size-base);
  margin-top: 8px;
  transition: all 0.2s;

  &:hover {
    background-color: #c42b1c;
    color: white;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  font-size: var(--usx-font-size-base);
  gap: 12px;
`;

export const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
  font-size: var(--usx-font-size-base);
`;
