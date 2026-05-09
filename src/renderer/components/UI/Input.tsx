import React, { forwardRef } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  label?: string;
  error?: string;
  hint?: string;
}


export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size = 'medium', icon, label, error, hint, className = '', ...props }, ref) => {
    const classes = [
      'ui-input',
      `ui-input-${size}`,
      error ? 'ui-input-error' : '',
      icon ? 'ui-input-has-icon' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="ui-input-wrapper">
        {label && <label className="ui-input-label">{label}</label>}
        <div className="ui-input-container">
          {icon && (
            <i className={`codicon codicon-${icon} ui-input-icon`}></i>
          )}
          <input ref={ref} className={classes} {...props} />
        </div>
        {error && <span className="ui-input-error-text">{error}</span>}
        {hint && !error && <span className="ui-input-hint">{hint}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: 'small' | 'medium' | 'large';
  label?: string;
  error?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ size = 'medium', label, error, resize = 'vertical', className = '', ...props }, ref) => {
    const classes = [
      'ui-textarea',
      `ui-textarea-${size}`,
      error ? 'ui-textarea-error' : '',
      `ui-textarea-resize-${resize}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="ui-input-wrapper">
        {label && <label className="ui-input-label">{label}</label>}
        <textarea ref={ref} className={classes} {...props} />
        {error && <span className="ui-input-error-text">{error}</span>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'small' | 'medium' | 'large';
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}


export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ size = 'medium', label, error, options, className = '', ...props }, ref) => {
    const classes = [
      'ui-select',
      `ui-select-${size}`,
      error ? 'ui-select-error' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="ui-input-wrapper">
        {label && <label className="ui-input-label">{label}</label>}
        <div className="ui-select-container">
          <select ref={ref} className={classes} {...props}>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <i className="codicon codicon-chevron-down ui-select-arrow"></i>
        </div>
        {error && <span className="ui-input-error-text">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
