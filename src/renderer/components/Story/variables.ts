// ============================================
// USX Story Form — Variable Handlers & Filters
// ============================================

// Global variable handlers ({{ $variable }})
export const variableHandlers: Record<string, any> = {
  uuid: () => crypto.randomUUID(),
  now: () => new Date().toISOString(),
  timestamp: () => Date.now(),
  session_id: () => {
    try {
      return sessionStorage.getItem('usxd_session_id') || crypto.randomUUID();
    } catch {
      return crypto.randomUUID();
    }
  },
  user: {
    first_name: () => {
      try { return localStorage.getItem('user_first_name') || ''; } catch { return ''; }
    },
    last_name: () => {
      try { return localStorage.getItem('user_last_name') || ''; } catch { return ''; }
    },
    email: () => {
      try { return localStorage.getItem('user_email') || ''; } catch { return ''; }
    },
  },
  workspace: {
    name: () => {
      try { return localStorage.getItem('workspace_name') || ''; } catch { return ''; }
    },
    path: () => {
      try { return localStorage.getItem('workspace_path') || ''; } catch { return ''; }
    },
  },
};

// Storage variable handlers ({{ %variable }})
export const storageHandlers: Record<string, any> = {
  app: {
    version: () => '1.5.0',
    platform: () => {
      try { return navigator.platform; } catch { return 'unknown'; }
    },
    isDev: () => {
      try { return process.env.NODE_ENV === 'development'; } catch { return false; }
    },
  },
};

// Liquid-style filters
export const filters: Record<string, (...args: any[]) => any> = {
  default: (value: any, defaultValue: any) => {
    if (value === undefined || value === null || value === '') return defaultValue;
    return value;
  },
  capitalize: (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  uppercase: (str: string) => {
    if (!str) return '';
    return str.toUpperCase();
  },
  lowercase: (str: string) => {
    if (!str) return '';
    return str.toLowerCase();
  },
  join: (arr: any[], sep: string = ', ') => {
    if (!Array.isArray(arr)) return String(arr);
    return arr.join(sep);
  },
  date: (timestamp: string, format: string = 'YYYY-MM-DD') => {
    try {
      return new Date(timestamp).toLocaleDateString();
    } catch {
      return timestamp;
    }
  },
  truncate: (str: string, length: number = 50) => {
    if (!str) return '';
    return str.length > length ? str.slice(0, length) + '...' : str;
  },
  slugify: (str: string) => {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  },
};

/**
 * Resolve variable handles in a template string.
 * Supports:
 *   {{ variable }}       — current answers
 *   {{ $variable }}      — global handlers
 *   {{ %variable }}      — storage handlers
 *   {{ expr | filter }}  — liquid-style filters
 *   {{ expr ? a : b }}   — ternary expressions
 */
export function resolveVariables(
  template: string,
  answers: Record<string, any>,
  variables: Record<string, any> = {}
): string {
  if (!template) return '';

  let resolved = template;

  // Handle ternary expressions first: {{ condition ? true_val : false_val }}
  resolved = resolved.replace(
    /\{\{\s*(.+?)\s*\?\s*(.+?)\s*:\s*(.+?)\s*\}\}/g,
    (_, condition, trueVal, falseVal) => {
      const condResult = resolveVariables(condition.trim(), answers, variables);
      const isTruthy = condResult !== '' && condResult !== 'false' && condResult !== '0' && condResult !== 'undefined' && condResult !== 'null';
      return isTruthy ? trueVal.trim() : falseVal.trim();
    }
  );

  // Handle filters: {{ expr | filter: arg }}
  resolved = resolved.replace(
    /\{\{\s*(.*?)\s*\|\s*(\w+)(?:\s*:\s*(.*?))?\s*\}\}/g,
    (_, valueExpr, filterName, arg) => {
      const filter = filters[filterName];
      if (!filter) return valueExpr;

      // Resolve the inner value first
      const innerResolved = resolveVariables(valueExpr.trim(), answers, variables);
      let parsedArg: any = arg?.trim();
      if (parsedArg) {
        // Try to parse as number
        const num = Number(parsedArg);
        if (!isNaN(num)) parsedArg = num;
      }
      return filter(innerResolved, parsedArg);
    }
  );

  // Handle {{ variable }} — current answers
  resolved = resolved.replace(
    /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g,
    (_, name) => {
      const value = answers[name] ?? variables[name]?.default ?? '';
      return String(value);
    }
  );

  // Handle {{ $variable }} — global handlers (dot-separated paths)
  resolved = resolved.replace(
    /\{\{\s*\$([a-zA-Z_.]+)\s*\}\}/g,
    (_, path) => {
      const parts = path.split('.');
      let value: any = variableHandlers;
      for (const part of parts) {
        if (value == null) return '';
        value = value[part];
        if (typeof value === 'function') value = value();
      }
      return String(value ?? '');
    }
  );

  // Handle {{ %variable }} — storage handlers (dot-separated paths)
  resolved = resolved.replace(
    /\{\{\s*%([a-zA-Z_.]+)\s*\}\}/g,
    (_, path) => {
      const parts = path.split('.');
      let value: any = storageHandlers;
      for (const part of parts) {
        if (value == null) return '';
        value = value[part];
        if (typeof value === 'function') value = value();
      }
      return String(value ?? '');
    }
  );

  return resolved;
}
