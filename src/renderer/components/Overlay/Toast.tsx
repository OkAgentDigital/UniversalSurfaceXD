import React, { useEffect, useState } from 'react';
import { Icon } from '../UI/Icon';
import { useOverlay, ToastItem } from './OverlayContext';

const Toast: React.FC<ToastItem> = ({ id, message, type, duration, actions }) => {
  const { removeToast } = useOverlay();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => removeToast(id), 200);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, removeToast]);

  const handleAction = (action: () => void) => {
    action();
    setIsVisible(false);
    setTimeout(() => removeToast(id), 200);
  };

  const iconMap: Record<string, string> = {
    info: 'info',
    success: 'check',
    warning: 'warning',
    error: 'warning',
  };

  return (
    <div className={`toast toast--${type} ${isVisible ? 'toast--enter' : 'toast--exit'}`}>
      <div className="toast-icon">
        <Icon name={iconMap[type]} size="md" />
      </div>
      <div className="toast-content">
        <p className="toast-message">{message}</p>
        {actions && actions.length > 0 && (
          <div className="toast-actions">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleAction(action.onClick)}
                className="toast-action-btn"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {(!actions || actions.length === 0) && (
        <button onClick={() => handleAction(() => {})} className="toast-close">
          <Icon name="close" size="sm" />
        </button>
      )}
    </div>
  );
};

export const ToastRenderer: React.FC = () => {
  const { toasts } = useOverlay();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};
