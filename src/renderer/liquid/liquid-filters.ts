/* ============================================
   USX Liquid Filter Extensions
   Custom filters for Liquid template rendering
   ============================================ */

/**
 * Wrap text to specific column width (for ASCII/terminal)
 */
export function usxWrap(text: string, width: number = 70): string {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + word).length > width) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine += (currentLine ? ' ' : '') + word;
    }
  }
  lines.push(currentLine);
  return lines.join('\n');
}

/**
 * Convert boolean to checkbox symbol
 */
export function usxCheckbox(completed: boolean): string {
  return completed ? '[x]' : '[ ]';
}

/**
 * Convert heading level to ASCII decoration
 */
export function usxAsciiHeading(text: string, level: number = 1): string {
  const underline = level === 1 ? '='.repeat(text.length) : '-'.repeat(text.length);
  return `${text.toUpperCase()}\n${underline}`;
}

/**
 * Truncate with ellipsis
 */
export function usxTruncate(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '…';
}

/**
 * Convert USX block notation to ASCII
 */
export function usxBlockToAscii(type: string, content: string, attributes?: Record<string, unknown>): string {
  switch (type) {
    case 'heading': {
      const level = (attributes?.level as number) || 1;
      return usxAsciiHeading(content, level);
    }
    case 'paragraph':
      return usxWrap(content, 70);
    case 'divider':
      return '-'.repeat(70);
    default:
      return content;
  }
}

export const liquidFilters = {
  usx_wrap: usxWrap,
  usx_checkbox: usxCheckbox,
  usx_ascii_heading: usxAsciiHeading,
  usx_truncate: usxTruncate,
  usx_block_to_ascii: usxBlockToAscii,
};
