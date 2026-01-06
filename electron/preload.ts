import { contextBridge, ipcRenderer } from 'electron'

declare global {
  interface Window {
    cmcl: {
      getEnv: () => Promise<{ isDev: boolean }>
    }
    electronAPI: {
      minimize: () => void
      maximize: () => void
      close: () => void
      onWindowStateChanged: (callback: (isMaximized: boolean) => void) => void
    }
  }
}

contextBridge.exposeInMainWorld('cmcl', {
  getEnv: () => ipcRenderer.invoke('cmcl:get-env'),
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
})
