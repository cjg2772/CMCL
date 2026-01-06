export function CustomTitlebar() {
  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimize()
    }
  }

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.close()
    }
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
          className="w-10 h-10 hover:bg-white/10 transition-colors flex items-center justify-center text-white/70 hover:text-white"
          title="最小化"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        <button
          onClick={handleClose}
          className="w-10 h-10 hover:bg-red-500 transition-colors flex items-center justify-center text-white/70 hover:text-white"
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
