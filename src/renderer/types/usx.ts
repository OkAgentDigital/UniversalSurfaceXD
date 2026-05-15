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
  /** Code block renderer: standard | teletext | teletext-condensed | petscii | petscii-double | nes */
  renderer?: string;
  /** Teletext variant: standard | condensed | double | press-start */
  variant?: string;
  /** Enable grid-based teletext rendering */
  grid?: boolean;
  /** Grid columns (teletext standard: 40) */
  columns?: number;
  /** Grid rows (teletext standard: 24) */
  rows?: number;
  /** Explicit font override */
  font?: string;
  /** Double height mode for PETSCII */
  double_height?: boolean;
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

/** Font roles for the USX Font Pack */
export type FontRole = 'body' | 'desktop' | 'document' | 'mono' | 'ui';

/** Font selection state for each role */
export interface FontSelection {
  body: string;
  desktop: string;
  document: string;
  mono: string;
  ui: string;
}

/** Font option descriptor */
export interface FontOption {
  name: string;
  value: string;
  role: FontRole[];
}

export interface USXThemeContextValue {
  theme: ThemeMode;
  fontSize: FontSize;
  toggleTheme: () => void;
  setFontSize: (size: FontSize) => void;
  /** Font role selections */
  fontSelection: FontSelection;
  /** Update a specific font role */
  setFontRole: (role: FontRole, fontName: string) => void;
}
