// ============================================
// USX Story Form — JSON Storage Backend
// ============================================

import { StorySession } from './types';

const STORAGE_PREFIX = 'usxd_story_';

/**
 * Browser-side story session storage using localStorage.
 * For Electron, this could be swapped with fs-based file storage.
 */
export class StoryStorage {
  private prefix: string;

  constructor(prefix: string = STORAGE_PREFIX) {
    this.prefix = prefix;
  }

  private getKey(storyId: string, sessionId: string): string {
    return `${this.prefix}${storyId}_${sessionId}`;
  }

  async save(session: StorySession): Promise<void> {
    try {
      const key = this.getKey(session.story_id, session.session_id);
      localStorage.setItem(key, JSON.stringify(session));
    } catch (err) {
      console.error('StoryStorage.save failed:', err);
    }
  }

  async load(storyId: string, sessionId: string): Promise<StorySession | null> {
    try {
      const key = this.getKey(storyId, sessionId);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  async listSessions(storyId: string): Promise<string[]> {
    try {
      const sessions: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(`${this.prefix}${storyId}_`)) {
          sessions.push(key.replace(`${this.prefix}${storyId}_`, ''));
        }
      }
      return sessions;
    } catch {
      return [];
    }
  }

  async delete(storyId: string, sessionId: string): Promise<void> {
    try {
      const key = this.getKey(storyId, sessionId);
      localStorage.removeItem(key);
    } catch {}
  }

  /**
   * Create a new session from a story config
   */
  createSession(storyConfig: any, initialAnswers?: Record<string, any>): StorySession {
    const defaults: Record<string, any> = {};
    if (storyConfig.variables) {
      for (const [key, def] of Object.entries(storyConfig.variables)) {
        defaults[key] = (def as any).default;
      }
    }

    return {
      session_id: crypto.randomUUID(),
      story_id: storyConfig.meta?.id || 'unknown',
      version: storyConfig.version || 1,
      status: 'in_progress',
      started_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      completed_at: null,
      current_step: storyConfig.steps?.[0]?.id || '',
      answers: { ...defaults, ...initialAnswers },
      metadata: {
        user_agent: navigator.userAgent,
        platform: navigator.platform,
      },
    };
  }
}
