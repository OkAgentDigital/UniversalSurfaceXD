import React, { useEffect } from 'react';
import { Icon } from '../UI/Icon';
import { USXStoryForm } from '../Story/USXStoryForm';

import { useOverlay } from './OverlayContext';

const sizeClasses: Record<string, string> = {
  sm: 'popup--sm',
  md: 'popup--md',
  lg: 'popup--lg',
  xl: 'popup--xl',
};

export const Popup: React.FC = () => {
  const { popup, closePopup } = useOverlay();

  useEffect(() => {
    if (popup.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [popup.isOpen]);

  if (!popup.isOpen) return null;

  return (
    <div className="popup-overlay" onClick={closePopup}>
      <div
        className={`popup-container ${sizeClasses[popup.size || 'md']}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-header">
          <button
            onClick={closePopup}
            className="popup-close"
            aria-label="Close"
          >
            <Icon name="close" size="md" />
          </button>
          {popup.title && <h3 className="popup-title">{popup.title}</h3>}
        </div>
        <div className="popup-content">
          {popup.storyConfig ? (
            <USXStoryForm
              storyConfig={popup.storyConfig}
              onComplete={() => closePopup()}
              onClose={() => closePopup()}
            />

          ) : (
            popup.children
          )}
        </div>
      </div>
    </div>
  );
};
