export {}

declare global {
  interface Window {
    cmcl?: {
      getEnv: () => Promise<{ isDev: boolean }>
    }
  }
}
