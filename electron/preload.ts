import { contextBridge, ipcRenderer } from 'electron'

declare global {
  interface Window {
    cmcl: {
      getEnv: () => Promise<{ isDev: boolean }>
      downloadFile: (url: string, filePath: string) => Promise<{ success: boolean; error?: string }>
    }
    electronAPI: {
      minimize: () => void
      maximize: () => void
      close: () => void
      onWindowStateChanged: (callback: (isMaximized: boolean) => void) => void
      onDownloadProgress: (callback: (progress: { percent: number; speed: string }) => void) => void
    }
  }
}

contextBridge.exposeInMainWorld('cmcl', {
  getEnv: () => ipcRenderer.invoke('cmcl:get-env'),
  downloadFile: (url: string, filePath: string) => 
    ipcRenderer.invoke('cmcl:download-file', url, filePath),
})

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
  onWindowStateChanged: (callback: (isMaximized: boolean) => void) => {
    ipcRenderer.on('window:state-changed', (_event, isMaximized) => {
      callback(isMaximized)
    })
  },
  onDownloadProgress: (callback: (progress: { percent: number; speed: string }) => void) => {
    ipcRenderer.on('download:progress', (_event, progress) => {
      callback(progress)
    })
  },
})
