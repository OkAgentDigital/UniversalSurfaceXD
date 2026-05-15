// ============================================
// USX Story Form — Type Definitions
// ============================================

export interface StoryVariable {
  type: 'string' | 'email' | 'number' | 'boolean' | 'array';
  default: any;
  required?: boolean;
  min?: number;
  max?: number;
  options?: string[];
}

export interface StoryStorageConfig {
  backend: 'json';
  path: string;
  auto_save: boolean;
  autosave_interval?: number;
  encrypt?: boolean;
}

export interface StoryOption {
  value: string;
  label: string;
  description?: string;
}

export interface StoryValidation {
  required?: boolean;
  min_length?: number;
  max_length?: number;
  pattern?: string;
  error_message?: string;
}

export interface StoryStep {
  id: string;
  type: 'intro' | 'message' | 'input' | 'email' | 'choice' | 'multiselect' | 'scale' | 'confirm' | 'branch';
  title: string;
  description?: string;
  content?: string;
  variable?: string;
  validation?: StoryValidation;
  placeholder?: string;
  auto_focus?: boolean;
  options?: StoryOption[];
  display?: 'buttons' | 'list';
  min?: number;
  max?: number;
  labels?: Record<string, string>;
  confirm_label?: string;
  cancel_label?: string;
  next?: string | null;
  conditions?: StoryCondition[];
  on_complete?: StoryAction;
}

export interface StoryCondition {
  when?: string;
  then?: string;
  otherwise?: string;
}

export interface StoryAction {
  action: string;
  params?: Record<string, any>;
  redirect?: string;
}

export interface StoryMeta {
  id: string;
  title: string;
  description?: string;
  version: number;
  author?: string;
}

export interface StoryConfig {
  $schema?: string;
  version: string;
  meta: StoryMeta;
  variables: Record<string, StoryVariable>;
  storage: StoryStorageConfig;
  steps: StoryStep[];
  on_complete?: {
    save_to_storage?: boolean;
    show_toast?: string;
    play_sound?: boolean;
    track_event?: {
      name: string;
      properties: Record<string, string>;
    };
  };
}

export interface StorySession {
  session_id: string;
  story_id: string;
  version: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  started_at: string;
  last_updated: string;
  completed_at: string | null;
  current_step: string;
  answers: Record<string, any>;
  metadata: Record<string, any>;
}
