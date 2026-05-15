import React, { useEffect, useState } from 'react';
import { useOverlay, BadgeItem } from './OverlayContext';

const Badge: React.FC<BadgeItem> = ({ id, message, type, duration }) => {
  const { removeBadge } = useOverlay();
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration === 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, ((duration - elapsed) / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        setIsVisible(false);
        setTimeout(() => removeBadge(id), 300);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [duration, id, removeBadge]);

  return (
    <div className={`badge badge--${type} ${isVisible ? 'badge--enter' : 'badge--exit'}`}>
      <div className="badge-content">
        <span className="badge-message">{message}</span>
      </div>
      {duration > 0 && (
        <div className="badge-progress" style={{ width: `${progress}%` }} />
      )}
    </div>
  );
};

export const BadgeRenderer: React.FC = () => {
  const { badges } = useOverlay();

  if (badges.length === 0) return null;

  return (
    <div className="badge-container">
      {badges.map(badge => (
        <Badge key={badge.id} {...badge} />
      ))}
    </div>
  );
};
