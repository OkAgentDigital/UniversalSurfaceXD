import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../shared/constants';

// DeepSeek API configuration
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  stream?: boolean;
}

/**
 * AI Service for DeepSeek integration
 * Handles chat completions and streaming responses
 */
export function registerAiHandlers(): void {
  // Handle AI chat requests (non-streaming)
  ipcMain.handle(IPC_CHANNELS.AI_CHAT, async (_event, request: ChatRequest) => {
    try {
      const apiKey = process.env.DEEPSEEK_API_KEY;
      if (!apiKey) {
        return {
          success: false,
          error: 'DeepSeek API key not configured. Set DEEPSEEK_API_KEY environment variable.',
        };
      }

      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: request.messages,
          stream: false,
          max_tokens: 4096,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `DeepSeek API error: ${response.status} - ${errorText}` };
      }

      const data = await response.json();
      return {
        success: true,
        message: data.choices[0].message,
        usage: data.usage,
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // Handle AI explain (code/documentation explanation)
  ipcMain.handle(IPC_CHANNELS.AI_EXPLAIN, async (_event, { text, context }: { text: string; context?: string }) => {
    try {
      const apiKey = process.env.DEEPSEEK_API_KEY;
      if (!apiKey) {
        return {
          success: false,
          error: 'DeepSeek API key not configured. Set DEEPSEEK_API_KEY environment variable.',
        };
      }

      const systemPrompt = context
        ? `You are an expert assistant. Explain the following ${context} in a clear, concise manner.`
        : 'You are an expert assistant. Explain the following text in a clear, concise manner.';

      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Please explain this:\n\n${text}` },
          ],
          stream: false,
          max_tokens: 2048,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `DeepSeek API error: ${response.status} - ${errorText}` };
      }

      const data = await response.json();
      return {
        success: true,
        explanation: data.choices[0].message.content,
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });
}
