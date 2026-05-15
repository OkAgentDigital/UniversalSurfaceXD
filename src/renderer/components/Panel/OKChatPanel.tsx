import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MCPServerStatus } from '../../../shared/types';
import { Icon } from '../UI/Icon';
import { useUSXTheme } from '../USX/USXThemeProvider';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

type ChatMode = 'chat' | 'github' | 'explain';

interface OKChatPanelProps {
  onClose?: () => void;
}

export function OKChatPanel({ onClose }: OKChatPanelProps) {
  const { theme, toggleTheme } = useUSXTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'system',
      content: 'Welcome to OK Chat. I can help with questions, code, and GitHub.',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [chatMode] = useState<ChatMode>('chat');
  const [mcpStatuses, setMcpStatuses] = useState<MCPServerStatus[]>([]);
  const [showTools, setShowTools] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Check MCP status on mount
  useEffect(() => {
    window.electron.mcpStatus().then(setMcpStatuses).catch(() => {});
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (chatMode === 'github') {
        const mcpResult = await window.electron.mcpExecute(input.trim());
        const assistantMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: mcpResult.success
            ? `✅ Command sent to GitHub MCP Server.\n\n\`\`\`\n${mcpResult.result || 'Executed successfully'}\n\`\`\``
            : `❌ Error: ${mcpResult.error || 'Failed to execute command'}`,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const systemPrompt = chatMode === 'explain'
          ? 'You are an expert code and document explainer. Provide clear, concise explanations with examples where helpful.'
          : 'You are OK Chat, a helpful assistant integrated into a local-first document editor. You help users with writing, coding, and managing their documents.';

        const aiResult = await window.electron.aiChat({
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.filter(m => m.role !== 'system').map(m => ({
              role: m.role as 'user' | 'assistant',
              content: m.content,
            })),
            { role: 'user', content: input.trim() },
          ],
        });

        const assistantMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: aiResult.success
            ? aiResult.message?.content || 'No response generated.'
            : `❌ Error: ${aiResult.error || 'Failed to get response'}`,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `❌ Error: ${err.message || 'An unexpected error occurred'}`,
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'system',
        content: 'Chat cleared. How can I help you?',
        timestamp: Date.now(),
      },
    ]);
  };

  const getPrimaryActionState = () => {
    if (isLoading) return 'cancel';
    if (isRecording) return 'stop-dictation';
    if (input.trim()) return 'send';
    return 'dictate';
  };

  const primaryAction = getPrimaryActionState();

  const renderMessage = (msg: ChatMessage) => {
    if (msg.role === 'system') {
      return (
        <div key={msg.id} className="chat-system-message">
          {msg.content}
        </div>
      );
    }

    return (
      <div key={msg.id} className={`chat-message chat-message--${msg.role}`}>
        <div className={`chat-message-content chat-message-content--${msg.role}`}>
          {msg.content}
        </div>
        {msg.role === 'user' && (
          <div className="chat-message-actions">
            <Icon name="more" size="sm" />
          </div>
        )}
      </div>
    );
  };

  // Empty state: centered welcome composer
  if (messages.length === 1 && messages[0].role === 'system') {
    return (
      <div className="ok-chat-panel">
        <div className="ok-chat-header">
          <div className="ok-chat-header-left">
            <span className="ok-chat-header-title">OK Chat</span>
          </div>
          <div className="ok-chat-header-actions">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size="sm" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} />
            <Icon name="trash" size="sm" onClick={handleClearChat} title="Clear Chat" />
            {onClose && <Icon name="close" size="sm" onClick={onClose} title="Close" />}
          </div>
        </div>
        <div className="chat-empty-state">
          <div className="chat-empty-container">
            <h1 className="chat-welcome-heading">Where should we begin?</h1>
            <div className="chat-composer chat-composer--centered">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                className="chat-input"
                rows={1}
                disabled={isLoading}
              />
              <div className="chat-composer-actions">
                <div className="tools-dropdown">
                  <button
                    className="tools-dropdown-button"
                    onClick={() => setShowTools(!showTools)}
                    title="Tools"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    <span>Tools</span>
                  </button>
                  {showTools && (
                    <div className="tools-dropdown-menu">
                      {mcpStatuses.map(server => (
                        <div key={server.id} className="tools-dropdown-item">
                          <span style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: server.running ? '#4ec9b0' : '#d4a04a',
                            flexShrink: 0,
                          }} />
                          <span>{server.name || server.id}</span>
                        </div>
                      ))}
                      <div className="tools-dropdown-item">
                        <Icon name="search" size="sm" />
                        <span>Search documents</span>
                      </div>
                      <div className="tools-dropdown-item">
                        <Icon name="file" size="sm" />
                        <span>Create document</span>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  className={`chat-primary-action chat-primary-action--${primaryAction}`}
                  onClick={() => {
                    if (primaryAction === 'send') handleSend();
                    if (primaryAction === 'cancel') setIsLoading(false);
                    if (primaryAction === 'dictate') setIsRecording(true);
                    if (primaryAction === 'stop-dictation') setIsRecording(false);
                  }}
                  title={
                    primaryAction === 'send' ? 'Send message' :
                    primaryAction === 'cancel' ? 'Cancel' :
                    primaryAction === 'dictate' ? 'Start dictation' :
                    'Stop dictation'
                  }
                >
                  {primaryAction === 'send' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  )}
                  {primaryAction === 'cancel' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  )}
                  {primaryAction === 'dictate' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  )}
                  {primaryAction === 'stop-dictation' && (
                    <span className="recording-indicator">●</span>
                  )}
                </button>
              </div>
            </div>
            <p className="chat-disclaimer">OK Chat can make mistakes. Consider checking important information.</p>
          </div>
        </div>
      </div>
    );
  }

  // Chat state with messages
  return (
    <div className="ok-chat-panel">
      {/* Header */}
      <div className="ok-chat-header">
        <div className="ok-chat-header-left">
          <span className="ok-chat-header-title">OK Chat</span>
        </div>
        <div className="ok-chat-header-actions">
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size="sm" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} />
          <Icon name="trash" size="sm" onClick={handleClearChat} title="Clear Chat" />
          {onClose && <Icon name="close" size="sm" onClick={onClose} title="Close" />}
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map(renderMessage)}

        {isLoading && (
          <div className="chat-message chat-message--assistant">
            <div className="chat-typing-indicator">
              <span>Thinking</span>
              <span className="typing-dot">.</span>
              <span className="typing-dot">.</span>
              <span className="typing-dot">.</span>
            </div>
          </div>
        )}

        {/* Assistant action bar (always visible for assistant messages) */}
        {messages.filter(m => m.role === 'assistant').length > 0 && (
          <div className="assistant-action-bar">
            <Icon name="thumb_up" size="sm" />
            <Icon name="thumb_down" size="sm" />
            <Icon name="copy" size="sm" />
            <Icon name="share" size="sm" />
            <Icon name="reload" size="sm" />
            <Icon name="more" size="sm" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sticky footer composer */}
      <div className="chat-footer">
        <div className="chat-composer chat-composer--footer">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="chat-input"
            rows={1}
            disabled={isLoading}
          />
          <div className="chat-composer-actions">
            <div className="tools-dropdown">
              <button
                className="tools-dropdown-button"
                onClick={() => setShowTools(!showTools)}
                title="Tools"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>Tools</span>
              </button>
              {showTools && (
                <div className="tools-dropdown-menu">
                  {mcpStatuses.map(server => (
                    <div key={server.id} className="tools-dropdown-item">
                      <span style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: server.running ? '#4ec9b0' : '#d4a04a',
                        flexShrink: 0,
                      }} />
                      <span>{server.name || server.id}</span>
                    </div>
                  ))}
                  <div className="tools-dropdown-item">
                    <Icon name="search" size="sm" />
                    <span>Search documents</span>
                  </div>
                  <div className="tools-dropdown-item">
                    <Icon name="file" size="sm" />
                    <span>Create document</span>
                  </div>
                </div>
              )}
            </div>
            <button
              className={`chat-primary-action chat-primary-action--${primaryAction}`}
              onClick={() => {
                if (primaryAction === 'send') handleSend();
                if (primaryAction === 'cancel') setIsLoading(false);
                if (primaryAction === 'dictate') setIsRecording(true);
                if (primaryAction === 'stop-dictation') setIsRecording(false);
              }}
              title={
                primaryAction === 'send' ? 'Send message' :
                primaryAction === 'cancel' ? 'Cancel' :
                primaryAction === 'dictate' ? 'Start dictation' :
                'Stop dictation'
              }
            >
              {primaryAction === 'send' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
              {primaryAction === 'cancel' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              )}
              {primaryAction === 'dictate' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              )}
              {primaryAction === 'stop-dictation' && (
                <span className="recording-indicator">●</span>
              )}
            </button>
          </div>
        </div>
        <p className="chat-disclaimer">OK Chat can make mistakes. Consider checking important information.</p>
      </div>
    </div>
  );
}
