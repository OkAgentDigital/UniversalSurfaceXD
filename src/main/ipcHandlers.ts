import { ipcMain } from 'electron';
import {
  getDocument,
  saveDocument,
  listDocuments,
  deleteDocument,
  getAllTasks,
  saveTask,
  deleteTask,
  getViews,
  saveView,
} from './database';
import { IPC_CHANNELS } from '../shared/constants';

export function registerIpcHandlers(): void {
  // Document handlers
  ipcMain.handle(IPC_CHANNELS.GET_DOCUMENT, async (_event, id: string) => {
    return getDocument(id);
  });

  ipcMain.handle(IPC_CHANNELS.SAVE_DOCUMENT, async (_event, doc) => {
    saveDocument(doc);
  });

  ipcMain.handle(IPC_CHANNELS.LIST_DOCUMENTS, async () => {
    return listDocuments();
  });

  ipcMain.handle(IPC_CHANNELS.DELETE_DOCUMENT, async (_event, id: string) => {
    deleteDocument(id);
  });

  // Task handlers
  ipcMain.handle(IPC_CHANNELS.GET_ALL_TASKS, async () => {
    return getAllTasks();
  });

  ipcMain.handle(IPC_CHANNELS.SAVE_TASK, async (_event, task) => {
    saveTask(task);
  });

  ipcMain.handle(IPC_CHANNELS.DELETE_TASK, async (_event, id: string) => {
    deleteTask(id);
  });

  // View handlers
  ipcMain.handle(IPC_CHANNELS.GET_VIEWS, async () => {
    return getViews();
  });

  ipcMain.handle(IPC_CHANNELS.SAVE_VIEW, async (_event, view) => {
    saveView(view);
  });
}
