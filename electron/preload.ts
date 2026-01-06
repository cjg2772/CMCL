import { contextBridge, ipcRenderer } from 'electron'

declare global {
  interface Window {
    cmcl: {
      getEnv: () => Promise<{ isDev: boolean }>
    }
  }
}

contextBridge.exposeInMainWorld('cmcl', {
  getEnv: () => ipcRenderer.invoke('cmcl:get-env'),
})
