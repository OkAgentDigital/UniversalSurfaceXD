import React, { useEffect } from 'react';
import { Icon } from '../UI/Icon';
import { USXStoryForm } from '../Story/USXStoryForm';

import { useOverlay } from './OverlayContext';

export const Curtain: React.FC = () => {
  const { curtain, closeCurtain } = useOverlay();

  useEffect(() => {
    if (curtain.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [curtain.isOpen]);

  if (!curtain.isOpen) return null;

  return (
    <div className="curtain-overlay">
      <div className="curtain-container">
        <div className="curtain-header">
          <button
            onClick={closeCurtain}
            className="curtain-close"
            aria-label="Close"
          >
            <Icon name="close" size="md" />
          </button>
          {curtain.title && <h2 className="curtain-title">{curtain.title}</h2>}
        </div>
        <div className="curtain-content">
          {curtain.storyConfig ? (
            <USXStoryForm
              storyConfig={curtain.storyConfig}
              onComplete={() => closeCurtain()}
              onClose={() => closeCurtain()}
            />

          ) : (
            curtain.children
          )}
        </div>
      </div>
    </div>
  );
};
