/* ============================================
   USX Liquid Filter Extensions
   Custom filters for Liquid template rendering
   Includes teletext/grid formatting support
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

/**
 * Teletext format: uppercase, spaces to blocks, wrap at 40 columns
 */
export function teletextFormat(text: string): string {
  // Convert to uppercase (teletext standard)
  let output = text.toUpperCase();

  // Replace spaces with teletext blank blocks
  output = output.replace(/ /g, '░');

  // Wrap at 40 columns
  const lines: string[] = [];
  for (let i = 0; i < output.length; i += 40) {
    lines.push(output.slice(i, i + 40));
  }

  return lines.join('\n');
}

/**
 * Teletext grid: convert text to 40-column character grid
 */
export function teletextGrid(text: string, columns: number = 40): string[][] {
  const output = text.toUpperCase();
  const grid: string[][] = [];
  let row: string[] = [];

  for (let i = 0; i < output.length; i++) {
    const char = output[i] === ' ' ? '░' : output[i];
    row.push(char);
    if (row.length >= columns) {
      grid.push(row);
      row = [];
    }
  }

  // Pad last row if needed
  while (row.length < columns) {
    row.push('░');
  }
  if (row.length > 0) {
    grid.push(row);
  }

  return grid;
}

export const liquidFilters = {
  usx_wrap: usxWrap,
  usx_checkbox: usxCheckbox,
  usx_ascii_heading: usxAsciiHeading,
  usx_truncate: usxTruncate,
  usx_block_to_ascii: usxBlockToAscii,
  teletext_format: teletextFormat,
  teletext_grid: teletextGrid,
};
