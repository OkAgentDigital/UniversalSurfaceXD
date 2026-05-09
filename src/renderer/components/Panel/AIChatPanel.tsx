import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MCPServerStatus } from '../../../shared/types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

type ChatMode = 'chat' | 'github' | 'explain';

export function AIChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'system',
      content: 'Welcome to Universui AI! I can help you with:\n\n' +
        '💬 **Chat** — General conversation and questions\n' +
        '🐙 **GitHub** — Search repos, create issues, analyze code\n' +
        '🔍 **Explain** — Explain selected code or text\n\n' +
        'Select a mode above to get started.',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('chat');
  const [mcpStatuses, setMcpStatuses] = useState<MCPServerStatus[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Check MCP status on mount and when mode changes to github
  useEffect(() => {
    if (chatMode === 'github') {
      window.electron.mcpStatus().then(setMcpStatuses).catch(() => {});
    }
  }, [chatMode]);

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
        // GitHub mode - use MCP server
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
        // Chat or Explain mode - use DeepSeek
        const systemPrompt = chatMode === 'explain'
          ? 'You are an expert code and document explainer. Provide clear, concise explanations with examples where helpful.'
          : 'You are Universui AI, a helpful assistant integrated into a local-first document editor. You help users with writing, coding, and managing their documents.';

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

  const formatTimestamp = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (msg: ChatMessage) => {
    const isUser = msg.role === 'user';
    const isSystem = msg.role === 'system';

    return (
      <div
        key={msg.id}
        className={`ai-chat-message ${isUser ? 'user' : isSystem ? 'system' : 'assistant'}`}
      >
        <div className="ai-chat-message-header">
          <span className="ai-chat-message-role">
            {isUser ? 'You' : isSystem ? 'System' : 'Universui AI'}
          </span>
          <span className="ai-chat-message-time">{formatTimestamp(msg.timestamp)}</span>
        </div>
        <div className="ai-chat-message-content">
          {msg.content.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < msg.content.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="ai-chat-panel">
      <div className="ai-chat-header">
        <div className="ai-chat-header-left">
          <i className="codicon codicon-comment-discussion"></i>
          <span>AI CHAT</span>
        </div>
        <div className="ai-chat-header-actions">
          <button className="action-button" onClick={handleClearChat} title="Clear Chat">
            <i className="codicon codicon-clear-all"></i>
          </button>
        </div>
      </div>

      <div className="ai-chat-mode-selector">
        <button
          className={`ai-chat-mode-btn ${chatMode === 'chat' ? 'active' : ''}`}
          onClick={() => setChatMode('chat')}
        >
          <i className="codicon codicon-comment"></i> Chat
        </button>
        <button
          className={`ai-chat-mode-btn ${chatMode === 'github' ? 'active' : ''}`}
          onClick={() => setChatMode('github')}
        >
          <i className="codicon codicon-github"></i> GitHub
        </button>
        <button
          className={`ai-chat-mode-btn ${chatMode === 'explain' ? 'active' : ''}`}
          onClick={() => setChatMode('explain')}
        >
          <i className="codicon codicon-lightbulb"></i> Explain
        </button>
      </div>

      {chatMode === 'github' && mcpStatuses.length > 0 && (
        <div className={`ai-chat-mcp-status ${mcpStatuses.some(s => s.running) ? 'connected' : 'disconnected'}`}>
          <i className={`codicon ${mcpStatuses.some(s => s.running) ? 'codicon-check' : 'codicon-warning'}`}></i>
          <span>MCP Servers: {mcpStatuses.filter(s => s.running).length}/{mcpStatuses.length} connected</span>
        </div>
      )}

      <div className="ai-chat-messages">
        {messages.map(renderMessage)}
        {isLoading && (
          <div className="ai-chat-message assistant">
            <div className="ai-chat-message-header">
              <span className="ai-chat-message-role">Universui AI</span>
            </div>
            <div className="ai-chat-message-content">
              <span className="ai-chat-typing">Thinking</span>
              <span className="ai-chat-typing-dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-chat-input-area">
        <textarea
          ref={inputRef}
          className="ai-chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            chatMode === 'github'
              ? 'Ask about GitHub repos, issues, PRs...'
              : chatMode === 'explain'
                ? 'Paste code or text to explain...'
                : 'Ask anything...'
          }
          rows={3}
          disabled={isLoading}
        />
        <button
          className="ai-chat-send-btn"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
        >
          <i className="codicon codicon-send"></i>
        </button>
      </div>
    </div>
  );
}
