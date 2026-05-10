import { app, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';
import { initDatabase } from './database';
import { registerIpcHandlers } from './ipcHandlers';
import { registerAiHandlers } from './aiService';
import { registerMCPHandlers } from './mcpService';
import { registerExtensionHandlers } from './extensionService';
import { registerSonicHandlers, sonicScrewdriver } from './sonicScrewdriver';
import { registerMarketplaceHandlers } from './extensionMarketplace';
import { registerContinueHandlers } from './continueIntegration';
import { registerGithubNextHandlers } from './githubNextIntegration';
import { modeManager } from './modeManager';
import { APP_NAME } from '../shared/constants';


let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: APP_NAME,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2c2c2c',
      symbolColor: '#cccccc',
      height: 42,
    },
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // Check if we should use the dev server (port 3000) or built files
  const devServerUrl = 'http://localhost:3000';
  const builtIndexPath = path.join(__dirname, '../renderer/index.html');

  // Use dev server if DEV_SERVER_URL is set, or if app is not packaged and the built file doesn't exist
  const useDevServer = process.env.DEV_SERVER_URL === 'true' || (!app.isPackaged && !fs.existsSync(builtIndexPath));

  if (useDevServer) {
    mainWindow.loadURL(devServerUrl);
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built HTML file
    mainWindow.loadFile(builtIndexPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Detect mode from CLI args
  const detectedMode = modeManager.getMode();
  console.log(`[${APP_NAME}] Starting in ${detectedMode} mode`);


  // Initialize database
  initDatabase();

  // Register IPC handlers
  registerIpcHandlers();

  // Register AI handlers (DeepSeek)
  registerAiHandlers();

  // Register MCP handlers (GitHub MCP Server)
  registerMCPHandlers();

  // Register Extension API handlers
  registerExtensionHandlers();

  // Register SonicScrewdriver handlers (Secret Store, API Proxy, Container Runtime)
  registerSonicHandlers();

  // Register Extension Marketplace handlers (3 GitHub orgs)
  registerMarketplaceHandlers();

  // Register Continue.dev integration handlers
  registerContinueHandlers();

  // Register GitHub Next integration handlers
  registerGithubNextHandlers();

  // Create the main window
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
