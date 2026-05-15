import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MCPServerStatus } from '../../../shared/types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

type ChatMode = 'chat' | 'github' | 'explain';

const styles = {
  panel: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    height: '100%',
    backgroundColor: '#212121',
  },
  header: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: '14px 16px',
    borderBottom: '1px solid #2f2f2f',
    flexShrink: 0,
    position: 'relative' as const,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#ececec',
    letterSpacing: '-0.2px',
  },
  headerActions: {
    display: 'flex' as const,
    gap: 2,
    position: 'absolute' as const,
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  iconBtn: {
    background: 'transparent',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    padding: 6,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    transition: 'all 0.15s ease',
  },
  messages: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '24px 16px',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 8,
  },
  messageRow: (role: string) => ({
    display: 'flex' as const,
    justifyContent: role === 'user' ? 'flex-end' as const : 'flex-start' as const,
    padding: '0 0',
  }),
  messageContent: (role: string) => ({
    maxWidth: '90%',
    fontSize: 14,
    lineHeight: 1.7,
    color: role === 'user' ? '#ececec' : '#d4d4d4',
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
    padding: role === 'user' ? '10px 16px' : '4px 4px',
    backgroundColor: role === 'user' ? '#2f2f2f' : 'transparent',
    borderRadius: role === 'user' ? 16 : 0,
    borderBottomRightRadius: role === 'user' ? 4 : 16,
  }),
  systemMessage: {
    textAlign: 'center' as const,
    fontSize: 12,
    color: '#666',
    padding: '12px 16px',
    lineHeight: 1.5,
  },
  inputArea: {
    flexShrink: 0,
    padding: '12px 16px 16px',
    backgroundColor: '#212121',
  },
  inputContainer: {
    display: 'flex' as const,
    alignItems: 'flex-end' as const,
    gap: 8,
    backgroundColor: '#2f2f2f',
    border: '1px solid #3f3f3f',
    borderRadius: 16,
    padding: '8px 8px 8px 16px',
    maxWidth: 600,
    margin: '0 auto',
  },
  textarea: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    padding: '6px 0',
    fontSize: 14,
    color: '#ececec',
    fontFamily: 'inherit',
    resize: 'none' as const,
    outline: 'none',
    lineHeight: 1.5,
    maxHeight: 120,
  },
  sendBtn: (disabled: boolean) => ({
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    width: 32,
    height: 32,
    border: 'none',
    borderRadius: 8,
    backgroundColor: disabled ? '#3f3f3f' : '#ffffff',
    color: disabled ? '#666' : '#1e1e1e',
    cursor: disabled ? 'default' as const : 'pointer' as const,
    transition: 'all 0.15s ease',
    flexShrink: 0,
  }),
  typingIndicator: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: 4,
    color: '#888',
    fontSize: 14,
    padding: '4px 4px',
  },
};

interface OKChatPanelProps {
  onClose?: () => void;
}

export function OKChatPanel({ onClose }: OKChatPanelProps) {
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
  const [chatMode] = useState<ChatMode>('chat');
  const [mcpStatuses, setMcpStatuses] = useState<MCPServerStatus[]>([]);
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

  const renderMessage = (msg: ChatMessage) => {
    if (msg.role === 'system') {
      return (
        <div key={msg.id} style={styles.systemMessage}>
          {msg.content}
        </div>
      );
    }

    return (
      <div key={msg.id} style={styles.messageRow(msg.role)}>
        <div style={styles.messageContent(msg.role)}>
          {msg.content}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.panel}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.headerTitle}>OK Chat</span>
        <div style={styles.headerActions}>
          <button
            onClick={handleClearChat}
            style={styles.iconBtn}
            title="Clear Chat"
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3f3f3f'; e.currentTarget.style.color = '#ececec'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              style={styles.iconBtn}
              title="Close"
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3f3f3f'; e.currentTarget.style.color = '#ececec'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        {messages.map(renderMessage)}
        {isLoading && (
          <div style={styles.messageRow('assistant')}>
            <div style={styles.typingIndicator}>
              <span>Thinking</span>
              <span style={{ animation: 'none', opacity: 1 }}>.</span>
              <span style={{ animation: 'none', opacity: 1 }}>.</span>
              <span style={{ animation: 'none', opacity: 1 }}>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={styles.inputArea}>
        <div style={styles.inputContainer}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message OK Chat..."
            rows={1}
            disabled={isLoading}
            style={styles.textarea}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            style={styles.sendBtn(!input.trim() || isLoading)}
            onMouseEnter={(e) => {
              if (input.trim() && !isLoading) {
                e.currentTarget.style.backgroundColor = '#e8e8e8';
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (input.trim() && !isLoading) {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
