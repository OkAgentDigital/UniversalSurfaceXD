/* ============================================
   USX TypeScript Types — Universal Surface XSchema
   ============================================ */

export interface USXMetadata {
  title: string;
  author: string;
  created: string; // ISO-8601
  modified: string; // ISO-8601
  tags: string[];
}

export interface USXBlockAttributes {
  level?: number;
  title?: string;
  language?: string;
  ordered?: boolean;
  actions?: Array<{ label: string; variant?: string }>;
  [key: string]: unknown;
}

export interface USXBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'task' | 'card' | 'table' | 'code' | 'divider';
  content: string | string[] | Array<Record<string, unknown>> | Record<string, unknown>;
  attributes?: USXBlockAttributes;
}

export interface USXDocument {
  version: string;
  metadata: USXMetadata;
  blocks: USXBlock[];
}

export type ThemeMode = 'light' | 'dark';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';

export interface USXThemeContextValue {
  theme: ThemeMode;
  fontSize: FontSize;
  toggleTheme: () => void;
  setFontSize: (size: FontSize) => void;
}
