import React from 'react';

interface GridProps {
  children: React.ReactNode;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export function Grid({
  children,
  columns = { xs: 1, sm: 1, md: 2, lg: 3, xl: 4, '2xl': 4 },
  gap = 'md',
  className = '',
}: GridProps) {
  const style = {
    '--grid-xs': columns.xs || 1,
    '--grid-sm': columns.sm || columns.xs || 1,
    '--grid-md': columns.md || columns.sm || columns.xs || 2,
    '--grid-lg': columns.lg || columns.md || columns.sm || columns.xs || 3,
    '--grid-xl': columns.xl || columns.lg || columns.md || columns.sm || columns.xs || 4,
    '--grid-2xl': columns['2xl'] || columns.xl || columns.lg || columns.md || columns.sm || columns.xs || 4,
    '--grid-gap': `var(--space-${gap}, 12px)`,
  } as React.CSSProperties;

  return (
    <div className={`universui-grid ${className}`} style={style}>
      {children}
    </div>
  );
}

interface GridItemProps {
  children: React.ReactNode;
  span?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  className?: string;
}

export function GridItem({
  children,
  span = { xs: 1, sm: 1, md: 1, lg: 1, xl: 1, '2xl': 1 },
  className = '',
}: GridItemProps) {
  const style = {
    '--grid-item-xs': span.xs || 1,
    '--grid-item-sm': span.sm || span.xs || 1,
    '--grid-item-md': span.md || span.sm || span.xs || 1,
    '--grid-item-lg': span.lg || span.md || span.sm || span.xs || 1,
    '--grid-item-xl': span.xl || span.lg || span.md || span.sm || span.xs || 1,
    '--grid-item-2xl': span['2xl'] || span.xl || span.lg || span.md || span.sm || span.xs || 1,
  } as React.CSSProperties;

  return (
    <div className={`universui-grid-item ${className}`} style={style}>
      {children}
    </div>
  );
}
