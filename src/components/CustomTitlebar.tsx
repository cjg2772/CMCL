import { useEffect, useState } from 'react'

interface ElectronAPI {
  onWindowStateChanged?: (callback: (isMaximized: boolean) => void) => void
  minimize?: () => void
  maximize?: () => void
  close?: () => void
}

export function CustomTitlebar() {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    // 获取 Electron 窗口 API
    const electronAPI = (window as unknown as { electronAPI?: ElectronAPI }).electronAPI
    if (!electronAPI) return

    // 监听窗口状态变化
    if (electronAPI.onWindowStateChanged) {
      electronAPI.onWindowStateChanged((isMaximized: boolean) => {
        setIsMaximized(isMaximized)
      })
    }
  }, [])

  const handleMinimize = () => {
    const electronAPI = (window as unknown as { electronAPI?: ElectronAPI }).electronAPI
    electronAPI?.minimize?.()
  }

  const handleMaximize = () => {
    const electronAPI = (window as unknown as { electronAPI?: ElectronAPI }).electronAPI
    electronAPI?.maximize?.()
  }

  const handleClose = () => {
    const electronAPI = (window as unknown as { electronAPI?: ElectronAPI }).electronAPI
    electronAPI?.close?.()
  }

  return (
    <div
      className="h-12 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-white/10 flex items-center justify-between px-6 select-none"
      style={{ WebkitAppRegion: 'drag' } as unknown as React.CSSProperties}
    >
      <div className="flex items-center gap-3">
        <div className="text-lg font-bold tracking-tight text-white">CMCL</div>
        <span className="text-xs text-white/50">CIME Minecraft Launcher</span>
      </div>

      <div
        className="flex items-center gap-2"
        style={{ WebkitAppRegion: 'no-drag' } as unknown as React.CSSProperties}
      >
        <button
          onClick={handleMinimize}
          className="w-8 h-8 hover:bg-white/10 rounded transition-colors flex items-center justify-center text-white/70 hover:text-white"
          title="最小化"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        <button
          onClick={handleMaximize}
          className="w-8 h-8 hover:bg-white/10 rounded transition-colors flex items-center justify-center text-white/70 hover:text-white"
          title={isMaximized ? '还原' : '最大化'}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMaximized ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m0 0V3a2 2 0 00-2-2h-2a2 2 0 00-2 2v2m0 0H9m11 0h2" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4m-4 0l5 5m11-5v4m0 0h-4m4 0l-5 5M4 20v-4m0 4h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            )}
          </svg>
        </button>

        <button
          onClick={handleClose}
          className="w-8 h-8 hover:bg-red-500/20 rounded transition-colors flex items-center justify-center text-white/70 hover:text-red-400"
          title="关闭"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
