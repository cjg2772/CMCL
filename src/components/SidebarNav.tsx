import clsx from 'clsx'

export type MenuTab = 'settings' | 'content' | 'instances' | 'history'

interface SidebarNavProps {
  activeTab: MenuTab
  onTabChange: (tab: MenuTab) => void
  isDarkMode: boolean
  onThemeToggle: () => void
}

export function SidebarNav({ activeTab, onTabChange, isDarkMode, onThemeToggle }: SidebarNavProps) {
  const menuItems = [
    {
      id: 'settings' as MenuTab,
      label: '启动器设置',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 'content' as MenuTab,
      label: '内容下载',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
    },
    {
      id: 'instances' as MenuTab,
      label: '游戏实例',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-6 3v-3m-6-4h18V5a2 2 0 00-2-2H3a2 2 0 00-2 2v14a2 2 0 002 2h18a2 2 0 002-2v-5" />
        </svg>
      ),
    },
    {
      id: 'history' as MenuTab,
      label: '版本历史',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-white/10 flex flex-col h-screen">
      {/* 菜单项 */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={clsx(
              'w-full flex items-center gap-3 rounded-lg px-4 py-3 transition-all text-sm font-medium',
              activeTab === item.id
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-lg'
                : 'text-white/70 hover:text-white/90 hover:bg-white/5'
            )}
          >
            <span className={clsx(activeTab === item.id ? 'text-blue-400' : 'text-white/50')}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* 底部工具栏 */}
      <div className="border-t border-white/10 p-4 space-y-3">
        <button
          onClick={onThemeToggle}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-white/5 hover:bg-white/10 px-4 py-2 text-sm text-white/80 transition-colors border border-white/10"
          title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
        >
          {isDarkMode ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <span>浅色模式</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6m-4.22 7.78l-4.24-4.24m-5.08-5.08L2.46 2.46" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" />
              </svg>
              <span>深色模式</span>
            </>
          )}
        </button>

        <button
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-white/5 hover:bg-white/10 px-4 py-2 text-sm text-white/80 transition-colors border border-white/10"
          title="关于"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>关于</span>
        </button>
      </div>
    </aside>
  )
}
