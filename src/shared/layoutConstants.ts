/**
 * Layout Constants — Responsive breakpoints, column system, and sizing
 * Based on character-width (ch) units for consistent scaling
 */

export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export const COLUMNS: Record<Breakpoint, number> = {
  xs: 4,    // 4 columns on smallest screens
  sm: 6,    // 6 columns on phones
  md: 8,    // 8 columns on tablets
  lg: 12,   // 12 columns on laptops (standard)
  xl: 12,   // Still 12, but wider gap
  '2xl': 12,
};

export const GAP_SIZES: Record<Breakpoint, string> = {
  xs: '0.5ch',
  sm: '0.75ch',
  md: '1ch',
  lg: '1.25ch',
  xl: '1.5ch',
  '2xl': '2ch',
};

export const LAYOUT_SIZES = {
  activityBar: {
    xs: 56,
    sm: 56,
    md: 56,
    lg: 64,
    xl: 72,
    '2xl': 80,
  },
  sidebar: {
    minWidth: '20ch',
    maxWidth: '40ch',
    defaultWidth: '30ch',
    xlMinWidth: '25ch',
    xlMaxWidth: '50ch',
    xlDefaultWidth: '35ch',
  },
  rightPanel: {
    defaultWidth: 320,
    minWidth: 260,
    maxWidth: 480,
    xlDefaultWidth: 360,
    xlMinWidth: 300,
  },
  statusBar: {
    height: 28,
  },
  titleBar: {
    height: 42,
  },
  panel: {
    height: 280,
  },
} as const;

export const READABLE_WIDTH = '80ch';

/**
 * Get the current breakpoint based on window width
 */
export function getBreakpoint(width: number): Breakpoint {
  if (width < 640) return 'xs';
  if (width < 768) return 'sm';
  if (width < 1024) return 'md';
  if (width < 1280) return 'lg';
  if (width < 1536) return 'xl';
  return '2xl';
}

/**
 * Get column width for a given breakpoint
 */
export function getColumnWidth(breakpoint: Breakpoint): string {
  const totalColumns = COLUMNS[breakpoint];
  const gap = GAP_SIZES[breakpoint];
  return `calc((100% - (${totalColumns - 1} * ${gap})) / ${totalColumns})`;
}

/**
 * Check if a breakpoint is mobile (XS or SM)
 */
export function isMobile(breakpoint: Breakpoint): boolean {
  return breakpoint === 'xs' || breakpoint === 'sm';
}

/**
 * Check if a breakpoint is tablet (MD)
 */
export function isTablet(breakpoint: Breakpoint): boolean {
  return breakpoint === 'md';
}

/**
 * Check if a breakpoint is desktop (LG or larger)
 */
export function isDesktop(breakpoint: Breakpoint): boolean {
  return breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl';
}
