/* ============================================
   USXViewer — Complete USX Document Viewer
   ============================================ */
import React from 'react';
import { USXThemeProvider, useUSXTheme } from './USXThemeProvider';
import { ThemeControls } from './ThemeControls';
import { USXBlockRenderer } from './USXBlockRenderer';
import type { USXDocument } from '../../types/usx';

// Import USX Font Pack
import '../../styles/usx-fonts.css';

// Import all modular USX CSS
import '../../styles/usx/tokens.css';
import '../../styles/usx/components/button.css';
import '../../styles/usx/components/card.css';
import '../../styles/usx/components/heading.css';
import '../../styles/usx/components/task.css';
import '../../styles/usx/components/table.css';
import '../../styles/usx/components/code.css';
import '../../styles/usx/components/divider.css';
import '../../styles/usx/layout/container.css';
import '../../styles/usx/layout/grid.css';
import '../../styles/usx/layout/form.css';

interface USXViewerContentProps {
  document: USXDocument;
}

const USXViewerContent: React.FC<USXViewerContentProps> = ({ document }) => {
  useUSXTheme(); // Ensure theme context is consumed

  return (
    <div className="usx-container">
      {document.blocks.map((block, index) => (
        <USXBlockRenderer key={block.id || index} block={block} />
      ))}
    </div>
  );
};

interface USXViewerProps {
  document: USXDocument;
}

export const USXViewer: React.FC<USXViewerProps> = ({ document }) => {
  return (
    <USXThemeProvider>
      <USXViewerContent document={document} />
      <ThemeControls />
    </USXThemeProvider>
  );
};
