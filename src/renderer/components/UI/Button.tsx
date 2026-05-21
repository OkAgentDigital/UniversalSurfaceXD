import React from 'react';
import { Icon } from './Icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'secondary',
  size = 'medium',
  icon,
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const classes = [
    'ui-button',
    `ui-button-${variant}`,
    `ui-button-${size}`,
    fullWidth ? 'ui-button-full' : '',
    loading ? 'ui-button-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? (
        <Icon name="loading" spin size={16} />
      ) : icon ? (
        <Icon name={icon} size={16} />
      ) : null}
      {children && <span className="ui-button-label">{children}</span>}
    </button>
  );
}

interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function ButtonGroup({
  children,
  orientation = 'horizontal',
  className = '',
}: ButtonGroupProps) {
  return (
    <div className={`ui-button-group ui-button-group-${orientation} ${className}`}>
      {children}
    </div>
  );
}
