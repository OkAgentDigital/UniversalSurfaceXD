/* ============================================
   USXBlockRenderer — Renders individual USX blocks
   ============================================ */
import React from 'react';
import type { USXBlock } from '../../types/usx';

interface USXBlockRendererProps {
  block: USXBlock;
}

export const USXBlockRenderer: React.FC<USXBlockRendererProps> = ({ block }) => {
  switch (block.type) {
    case 'heading': {
      const level = block.attributes?.level || 1;
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag className={`usx-heading usx-heading--${level}`}>
          {block.content as string}
        </HeadingTag>
      );
    }

    case 'paragraph':
      return <div className="usx-body">{block.content as string}</div>;

    case 'list': {
      const ListTag = block.attributes?.ordered ? 'ol' : 'ul';
      const items = block.content as string[];
      return (
        <ListTag
          className="usx-list"
          style={{ margin: 'var(--usx-spacing-4) 0', paddingLeft: 'var(--usx-spacing-6)' }}
        >
          {items.map((item, i) => (
            <li key={i} style={{ marginBottom: 'var(--usx-spacing-2)' }}>
              {item}
            </li>
          ))}
        </ListTag>
      );
    }

    case 'task': {
      const tasks = block.content as Array<{ id: string; text: string; completed: boolean }>;
      return (
        <div className="usx-task-list">
          {tasks.map((task) => (
            <label key={task.id} className="usx-task">
              <input type="checkbox" defaultChecked={task.completed} />
              <span>{task.text}</span>
            </label>
          ))}
        </div>
      );
    }

    case 'card':
      return (
        <div className="usx-card">
          {block.attributes?.title && (
            <h3 className="usx-card__title">{block.attributes.title}</h3>
          )}
          <div className="usx-card__body">{block.content as string}</div>
          {block.attributes?.actions && (
            <div className="usx-card__actions">
              {(block.attributes.actions as Array<{ label: string; variant?: string }>).map(
                (action, i) => (
                  <button key={i} className={`usx-btn usx-btn--${action.variant || 'primary'}`}>
                    {action.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      );

    case 'table': {
      const { headers, rows } = block.content as { headers: string[]; rows: string[][] };
      return (
        <div className="usx-table-wrapper">
          <table className="usx-table">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'code':
      return (
        <div className="usx-code-block">
          <pre>
            <code>{block.content as string}</code>
          </pre>
        </div>
      );

    case 'divider':
      return <hr className="usx-divider" />;

    default:
      return <div className="usx-body">{block.content as string}</div>;
  }
};
