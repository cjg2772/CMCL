export {}

declare global {
  interface Window {
    cmcl?: {
      getEnv: () => Promise<{ isDev: boolean }>
      downloadFile: (url: string, filePath: string) => Promise<{ success: boolean; error?: string }>
    }
    electronAPI?: {
      minimize: () => void
      maximize: () => void
      close: () => void
      onWindowStateChanged: (callback: (isMaximized: boolean) => void) => void
      onDownloadProgress: (callback: (progress: { percent: number; speed: string }) => void) => void
    }
  }
}
