import { app, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';
import { initDatabase } from './database';
import { registerIpcHandlers } from './ipcHandlers';
import { APP_NAME } from '../shared/constants';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: APP_NAME,
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

  // Use dev server if VITE_DEV_SERVER_URL is set, or if app is not packaged and the built file doesn't exist
  const useDevServer = process.env.VITE_DEV_SERVER_URL === 'true' || (!app.isPackaged && !fs.existsSync(builtIndexPath));

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
  // Initialize database
  initDatabase();

  // Register IPC handlers
  registerIpcHandlers();

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
