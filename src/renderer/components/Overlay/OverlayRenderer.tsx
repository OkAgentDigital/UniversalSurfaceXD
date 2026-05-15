import React from 'react';
import { Curtain } from './Curtain';
import { Popup } from './Popup';
import { ToastRenderer } from './Toast';
import { BadgeRenderer } from './Badge';

/**
 * Renders all active overlay components (Curtain, Popup, Toast, Badge).
 * Place once at the root of the app, after the main content.
 */
export const OverlayRenderer: React.FC = () => {
  return (
    <>
      <Curtain />
      <Popup />
      <ToastRenderer />
      <BadgeRenderer />
    </>
  );
};
