import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/constants';

contextBridge.exposeInMainWorld('electron', {
  // Document operations
  getDocument: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.GET_DOCUMENT, id),
  saveDocument: (doc: any) => ipcRenderer.invoke(IPC_CHANNELS.SAVE_DOCUMENT, doc),
  listDocuments: () => ipcRenderer.invoke(IPC_CHANNELS.LIST_DOCUMENTS),
  deleteDocument: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.DELETE_DOCUMENT, id),

  // Task operations
  getAllTasks: () => ipcRenderer.invoke(IPC_CHANNELS.GET_ALL_TASKS),
  saveTask: (task: any) => ipcRenderer.invoke(IPC_CHANNELS.SAVE_TASK, task),
  deleteTask: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.DELETE_TASK, id),

  // View operations
  getViews: () => ipcRenderer.invoke(IPC_CHANNELS.GET_VIEWS),
  saveView: (view: any) => ipcRenderer.invoke(IPC_CHANNELS.SAVE_VIEW, view),
});
