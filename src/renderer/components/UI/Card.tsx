import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  hoverable = false,
}: CardProps) {
  const classes = [
    'ui-card',
    `ui-card-${variant}`,
    `ui-card-padding-${padding}`,
    hoverable ? 'ui-card-hoverable' : '',
    onClick ? 'ui-card-clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export function CardHeader({ children, className = '', actions }: CardHeaderProps) {
  return (
    <div className={`ui-card-header ${className}`}>
      <div className="ui-card-header-content">{children}</div>
      {actions && <div className="ui-card-header-actions">{actions}</div>}
    </div>
  );
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`ui-card-body ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return <div className={`ui-card-footer ${className}`}>{children}</div>;
}
