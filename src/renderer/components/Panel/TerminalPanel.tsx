import React, { useEffect, useRef, useState, useCallback } from 'react';

export function TerminalPanel() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminalId] = useState(() => `term-${Date.now()}`);
  const [lines, setLines] = useState<string[]>([
    'Welcome to Universui Terminal',
    'Type commands and press Enter to execute',
    '─────────────────────────────────────',
    '',
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanup = window.electron.onTerminalData((id: string, data: string) => {
      if (id === terminalId) {
        setLines(prev => [...prev, data]);
      }
    });

    return cleanup;
  }, [terminalId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const handleSpawn = useCallback(async () => {
    try {
      await window.electron.terminalSpawn(terminalId);
      setIsActive(true);
    } catch (err) {
      setLines(prev => [...prev, 'Error: Could not spawn terminal']);
    }
  }, [terminalId]);

  const handleCommand = async () => {
    if (!currentInput.trim()) return;
    const cmd = currentInput + '\n';
    setLines(prev => [...prev, `$ ${currentInput}`]);
    try {
      await window.electron.terminalWrite(terminalId, cmd);
    } catch (err) {
      setLines(prev => [...prev, 'Error: Terminal not available']);
    }
    setCurrentInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand();
    }
  };

  const handleClear = () => {
    setLines([]);
  };

  const handleKill = async () => {
    try {
      await window.electron.terminalKill(terminalId);
      setIsActive(false);
      setLines(prev => [...prev, '', 'Terminal closed. Click "Start" to restart.']);
    } catch (err) {
      // ignore
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 12px',
        background: '#252526',
        borderBottom: '1px solid #3c3c3c',
        fontSize: 11,
        color: '#cccccc',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="codicon codicon-terminal"></i>
          <span>TERMINAL</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {!isActive ? (
            <button className="action-button" onClick={handleSpawn} style={{ fontSize: 11 }}>
              <i className="codicon codicon-play"></i> Start
            </button>
          ) : (
            <button className="action-button" onClick={handleKill} style={{ fontSize: 11 }}>
              <i className="codicon codicon-stop"></i> Kill
            </button>
          )}
          <button className="action-button" onClick={handleClear} style={{ fontSize: 11 }}>
            <i className="codicon codicon-clear-all"></i> Clear
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflow: 'auto',
          background: '#1e1e1e',
          padding: 8,
          fontFamily: "Monaco, Menlo, 'Courier New', monospace",
          fontSize: 13,
          lineHeight: 1.5,
          color: '#d4d4d4',
        }}
      >
        {lines.map((line, i) => (
          <div key={i} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {line}
          </div>
        ))}
        {isActive && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#4ec9b0' }}>$ </span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#d4d4d4',
                fontFamily: "Monaco, Menlo, 'Courier New', monospace",
                fontSize: 13,
                outline: 'none',
                marginLeft: 4,
              }}
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
}
