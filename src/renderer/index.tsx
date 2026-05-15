import React from 'react';
import { createRoot } from 'react-dom/client';
import '@vscode/codicons/dist/codicon.css';
import './styles/usx-fonts.css';
import './styles/usx/tokens.css';
import './styles/universui.css';
import './styles/chat.css';
import './styles/overlay/curtain.css';
import './styles/overlay/popup.css';
import './styles/overlay/toast.css';
import './styles/overlay/badge.css';
import './styles/overlay/story.css';

import App from './App';

// Detect macOS and add darwin class to body for traffic light spacing
if (navigator.platform?.toLowerCase().includes('mac')) {
  document.body.classList.add('darwin');
}

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
