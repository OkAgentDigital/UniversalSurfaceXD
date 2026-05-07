import styled from 'styled-components';

export const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #1e1e1e;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background-color: #252526;
  border-bottom: 1px solid #333;
  z-index: 10;
`;

export const TitleInput = styled.input`
  flex: 1;
  padding: 6px 12px;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  background-color: #3c3c3c;
  color: #e0e0e0;
  font-size: 14px;
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: #0078d4;
  }

  &::placeholder {
    color: #666;
  }
`;

export const LanguageSelect = styled.select`
  padding: 6px 12px;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  background-color: #3c3c3c;
  color: #e0e0e0;
  font-size: 13px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #0078d4;
  }
`;

export const ToolbarButton = styled.button`
  padding: 6px 14px;
  border: 1px solid #555;
  border-radius: 4px;
  background-color: transparent;
  color: #ccc;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: #333;
    border-color: #666;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PrimaryButton = styled(ToolbarButton)`
  background-color: #0078d4;
  border-color: #0078d4;
  color: white;

  &:hover {
    background-color: #1a8ad4;
  }
`;

export const BackButton = styled(ToolbarButton)`
  border: none;
  color: #888;
  font-size: 16px;
  padding: 6px 8px;

  &:hover {
    color: #ccc;
    background-color: transparent;
  }
`;

export const SaveIndicator = styled.span<{ $saving: boolean }>`
  font-size: 12px;
  color: ${props => props.$saving ? '#ff9800' : '#4caf50'};
  transition: color 0.3s;
  min-width: 60px;
  text-align: right;
`;

export const MonacoWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;
