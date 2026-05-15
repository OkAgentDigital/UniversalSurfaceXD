/* ============================================
   AutoUpdater — GitHub Releases Auto-Update
   ============================================
   Uses electron-updater to check for updates
   from GitHub Releases and apply them.
   ============================================ */
import { autoUpdater } from 'electron-updater';
import { BrowserWindow, ipcMain } from 'electron';
import { APP_NAME } from '../shared/constants';

// Configure auto-updater
autoUpdater.autoDownload = false; // We'll prompt before downloading
autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'OkAgentDigital',
  repo: 'UniversalSurfaceXD',
});

let mainWindow: BrowserWindow | null = null;

/** Initialize the auto-updater with a reference to the main window */
export function initAutoUpdater(window: BrowserWindow): void {
  mainWindow = window;

  // Register IPC handlers for renderer communication
  ipcMain.handle('update:check', async () => {
    try {
      const result = await autoUpdater.checkForUpdates();
      return {
        updateAvailable: result?.updateInfo ? true : false,
        version: result?.updateInfo?.version || null,
        releaseNotes: result?.updateInfo?.releaseNotes || null,
        releaseDate: result?.updateInfo?.releaseDate || null,
      };
    } catch (err) {
      console.error('[AutoUpdater] Check failed:', err);
      return { updateAvailable: false, error: String(err) };
    }
  });

  ipcMain.handle('update:download', async () => {
    try {
      autoUpdater.downloadUpdate();
      return { success: true };
    } catch (err) {
      console.error('[AutoUpdater] Download failed:', err);
      return { success: false, error: String(err) };
    }
  });

  ipcMain.handle('update:install', async () => {
    autoUpdater.quitAndInstall();
    return { success: true };
  });

  // Auto-updater event handlers
  autoUpdater.on('checking-for-update', () => {
    console.log('[AutoUpdater] Checking for updates...');
    sendToRenderer('update:checking', {});
  });

  autoUpdater.on('update-available', (info) => {
    console.log(`[AutoUpdater] Update available: ${info.version}`);
    sendToRenderer('update:available', {
      version: info.version,
      releaseDate: info.releaseDate,
      releaseNotes: info.releaseNotes,
    });
  });

  autoUpdater.on('update-not-available', (info) => {
    console.log(`[AutoUpdater] No update available (current: ${info.version})`);
    sendToRenderer('update:not-available', { version: info.version });
  });

  autoUpdater.on('download-progress', (progress) => {
    sendToRenderer('update:download-progress', {
      percent: progress.percent,
      bytesPerSecond: progress.bytesPerSecond,
      transferred: progress.transferred,
      total: progress.total,
    });
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log(`[AutoUpdater] Update downloaded: ${info.version}`);
    sendToRenderer('update:downloaded', {
      version: info.version,
      releaseNotes: info.releaseNotes,
    });
  });

  autoUpdater.on('error', (err) => {
    console.error('[AutoUpdater] Error:', err.message);
    sendToRenderer('update:error', { message: err.message });
  });

  // Check for updates on startup (with a small delay to let the app settle)
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch((err) => {
      console.error('[AutoUpdater] Initial check failed:', err.message);
    });
  }, 5000);
}

/** Send an event to the renderer process */
function sendToRenderer(channel: string, data: unknown): void {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, data);
  }
}
