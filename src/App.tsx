import { useMemo, useState } from 'react'
import { clsx } from 'clsx'
import { contentCatalog, defaultBackgrounds } from './data'
import { CustomTitlebar } from './components/CustomTitlebar'
import { SidebarNav, type MenuTab } from './components/SidebarNav'
import { ContentTypeSourceMenu } from './components/ContentTypeSourceMenu'
import { DownloadManager, type Download } from './components/DownloadManager'
import {
  type DownloadSource,
  type LoaderAddon,
  type LoaderPrimary,
  type ProxyMode,
  type GameInstance,
  type VersionHistory,
} from './types'

const downloadSources: Array<{ key: DownloadSource; label: string; speedHint: string }> = [
  { key: 'auto', label: '自动选择最快', speedHint: '根据实时测速自动切换' },
  { key: 'bmclapi', label: 'BMCLAPI', speedHint: 'bmclapi2.bangbang93.com' },
  { key: 'official', label: '官方源', speedHint: 'launcher.mojang.com' },
]

const proxyOptions: Array<{ key: ProxyMode; label: string; desc: string }> = [
  { key: 'system', label: '系统代理', desc: '默认跟随 Windows 系统' },
  { key: 'none', label: '不使用代理', desc: '直连下载' },
  { key: 'http', label: 'HTTP 代理', desc: '自定义地址:端口' },
  { key: 'socks', label: 'SOCKS 代理', desc: 'SOCKS5/4a 支持' },
]

const loaderPrimaries: Array<{ key: LoaderPrimary; label: string; hint?: string }> = [
  { key: 'vanilla', label: '原版', hint: '无 Mod Loader' },
  { key: 'forge', label: 'Forge' },
  { key: 'neoforge', label: 'NeoForge' },
  { key: 'fabric', label: 'Fabric', hint: '可选 Fabric API' },
  { key: 'quilt', label: 'Quilt', hint: '可选 QSL/QFAPI' },
  { key: 'optifine', label: 'OptiFine', hint: '与 Fabric/Quilt 不兼容' },
]

const loaderAddonLabels: Record<LoaderAddon, string> = {
  'fabric-api': 'Fabric API',
  'quilt-api': 'Quilt API',
  qsl: 'QSL',
  qfapi: 'QFAPI',
}

const mockSourceSpeeds: Record<Exclude<DownloadSource, 'auto'>, number> = {
  official: 4.2,
  bmclapi: 8.3,
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

function App() {
  const [activeTab, setActiveTab] = useState<MenuTab>('settings')
  const [backgroundUrl, setBackgroundUrl] = useState(defaultBackgrounds[0])
  const [blurBackground, setBlurBackground] = useState(true)
  const [themeColor, setThemeColor] = useState('#3b82f6')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // 源切换状态（每个内容类型独立）
  const [modsSource, setModsSource] = useState<DownloadSource>('bmclapi')
  const [resourcePacksSource, setResourcePacksSource] = useState<DownloadSource>('bmclapi')
  const [shadersSource, setShadersSource] = useState<DownloadSource>('bmclapi')
  const [worldsSource, setWorldsSource] = useState<DownloadSource>('bmclapi')

  // 源菜单展开状态
  const [expandedSourceMenus, setExpandedSourceMenus] = useState<Record<string, boolean>>({
    mods: false,
    resourcePacks: false,
    shaders: false,
    worlds: false,
  })

  // 下载管理
  const [downloads, setDownloads] = useState<Download[]>([])

  const [autoSource, setAutoSource] = useState(true)
  const [source, setSource] = useState<DownloadSource>('bmclapi')

  const [threadAuto, setThreadAuto] = useState(true)
  const [threads, setThreads] = useState(8)

  const [proxyMode, setProxyMode] = useState<ProxyMode>('system')
  const [customProxy, setCustomProxy] = useState('http://127.0.0.1:7890')

  const [primaryLoader, setPrimaryLoader] = useState<LoaderPrimary>('fabric')
  const [loaderAddons, setLoaderAddons] = useState<LoaderAddon[]>(['fabric-api'])
  const [loaderNote, setLoaderNote] = useState('推荐 Fabric + Fabric API 以获得更佳兼容性')

  // 游戏实例管理
  const [gameInstances] = useState<GameInstance[]>([
    {
      id: '1',
      name: '默认实例',
      gameVersion: '1.21',
      loaderPrimary: 'fabric',
      loaderAddons: ['fabric-api'],
      javaPath: 'java',
      gameDir: '.minecraft',
      maxMemory: 2048,
      jvmArgs: ['-Xmn128M', '-Dfile.encoding=UTF-8'],
      createdAt: new Date().toISOString(),
    },
  ])
  const [selectedInstance, setSelectedInstance] = useState<string>('1')

  // 版本历史
  const [versionHistory] = useState<VersionHistory[]>([])

  // 配置预设
  const presets = [
    { name: '极速配置', config: { source: 'bmclapi' as DownloadSource, threads: 32, loader: 'fabric' as LoaderPrimary } },
    { name: '稳定配置', config: { source: 'official' as DownloadSource, threads: 8, loader: 'forge' as LoaderPrimary } },
    { name: '官方推荐', config: { source: 'auto' as DownloadSource, threads: 16, loader: 'vanilla' as LoaderPrimary } },
  ]

  const fastestSource = useMemo(() => {
    if (!autoSource) return source
    const fastest = Object.entries(mockSourceSpeeds).sort((a, b) => b[1] - a[1])[0]?.[0]
    return (fastest as DownloadSource) ?? 'bmclapi'
  }, [autoSource, source])

  function addDownload(name: string, contentType: 'mods' | 'resourcePacks' | 'shaders' | 'worlds', size: string) {
    const newDownload: Download = {
      id: `download-${Date.now()}`,
      name,
      contentType,
      progress: 0,
      status: 'pending',
      size,
      speed: '0 MB/s',
    }
    setDownloads([...downloads, newDownload])

    // 模拟下载过程
    setTimeout(() => {
      setDownloads((prev) =>
        prev.map((d) =>
          d.id === newDownload.id ? { ...d, status: 'downloading' } : d
        )
      )

      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          setDownloads((prev) =>
            prev.map((d) =>
              d.id === newDownload.id
                ? { ...d, progress: 100, status: 'completed', speed: '完成' }
                : d
            )
          )
        } else {
          setDownloads((prev) =>
            prev.map((d) =>
              d.id === newDownload.id
                ? { ...d, progress, speed: `${(Math.random() * 10 + 2).toFixed(2)} MB/s` }
                : d
            )
          )
        }
      }, 500)
    }, 300)
  }

  function removeDownload(id: string) {
    setDownloads((prev) => prev.filter((d) => d.id !== id))
  }

  function retryDownload(id: string) {
    setDownloads((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: 'pending', progress: 0, error: undefined } : d
      )
    )
    addDownload(
      downloads.find((d) => d.id === id)?.name || '',
      downloads.find((d) => d.id === id)?.contentType || 'mods',
      downloads.find((d) => d.id === id)?.size || ''
    )
  }

  function clearDownloads() {
    setDownloads((prev) => prev.filter((d) => d.status !== 'completed' && d.status !== 'failed'))
  }

  function toggleSourceMenu(contentType: string) {
    setExpandedSourceMenus((prev) => ({
      ...prev,
      [contentType]: !prev[contentType],
    }))
  }

  function randomBackground() {
    const next = defaultBackgrounds[Math.floor(Math.random() * defaultBackgrounds.length)]
    setBackgroundUrl(next)
  }

  function handleThreadInput(next: number) {
    const clamped = Math.min(64, Math.max(1, next || 1))
    setThreads(clamped)
  }

  function applyLoader(primary: LoaderPrimary, addons: LoaderAddon[]) {
    let nextAddons = addons
    let note = ''

    if (primary === 'fabric') {
      nextAddons = addons.filter((a) => a === 'fabric-api')
      note = 'Fabric 需搭配 Fabric API，OptiFine 将被禁用'
    } else if (primary === 'quilt') {
      nextAddons = addons.filter((a) => a === 'quilt-api' || a === 'qsl' || a === 'qfapi')
      note = 'Quilt 推荐 QSL/QFAPI 组合'
    } else if (primary === 'optifine') {
      nextAddons = []
      note = 'OptiFine 与 Fabric/Quilt 不兼容'
    } else {
      nextAddons = []
      note = `${primary === 'vanilla' ? '原版' : primary} 将禁用其他 Loader`
    }

    setPrimaryLoader(primary)
    setLoaderAddons(nextAddons)
    setLoaderNote(note)
  }

  function toggleAddon(addon: LoaderAddon) {
    if (primaryLoader === 'optifine' || primaryLoader === 'forge' || primaryLoader === 'neoforge' || primaryLoader === 'vanilla') {
      return
    }

    if (primaryLoader === 'fabric' && addon !== 'fabric-api') return
    if (primaryLoader === 'quilt' && addon === 'fabric-api') return

    setLoaderAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon],
    )
  }

  function getFilteredContent(contentType: 'mods' | 'resourcePacks' | 'shaders' | 'worlds') {
    const items = contentCatalog[contentType]
    if (!searchQuery.trim()) return items
    
    const query = searchQuery.toLowerCase()
    return items.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    )
  }

  function renderVersions(contentType: 'mods' | 'resourcePacks' | 'shaders' | 'worlds') {
    const filtered = getFilteredContent(contentType)
    const allVersions = filtered.flatMap(item => item.versions)
    const compatible = allVersions.filter((v) => v.compatibility !== 'incompatible')
    const incompatible = allVersions.filter((v) => v.compatibility === 'incompatible')

    return (
      <div className="space-y-2">
        {compatible.map((v) => (
          <div
            key={v.id}
            className={clsx(
              'content-card',
              v.compatibility === 'recommended' && 'border-brand-400/40 shadow-glow',
            )}
          >
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{v.title}</p>
                <p className="text-xs text-white/60">
                  适配版本：{v.gameVersions.join(', ')} · 发布时间：{formatDate(v.publishedAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={clsx(
                    'badge',
                    v.compatibility === 'recommended'
                      ? 'border-brand-400/60 bg-brand-500/20 text-brand-50'
                      : 'border-white/10 bg-white/10 text-white/70',
                  )}
                >
                  {v.compatibility === 'recommended' ? '推荐' : '兼容'}
                </span>
                <button 
                  onClick={() => addDownload(v.title, contentType, '12.5 MB')}
                  className="rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-glow active:scale-95"
                >
                  下载
                </button>
              </div>
            </div>
          </div>
        ))}

        {incompatible.length > 0 && (
          <details className="rounded-xl border border-white/5 bg-white/5 p-3 text-sm text-white/60">
            <summary className="cursor-pointer select-none text-white/70">不兼容版本（折叠）</summary>
            <div className="mt-2 space-y-2">
              {incompatible.map((v) => (
                <div
                  key={v.id}
                  className="rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-white/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{v.title}</span>
                    <span className="text-xs">{v.gameVersions.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    )
  }

  return (
    <div className="relative h-screen overflow-hidden bg-slate-900 flex flex-col">
      {/* 自定义标题栏 */}
      <CustomTitlebar />

      {/* 主容器 */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* 背景层 */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(120deg, rgba(10,15,24,0.9), rgba(6,10,16,0.94)), url(${backgroundUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className={clsx('absolute inset-0', blurBackground && 'backdrop-blur-[18px]')} />
          <div className="absolute inset-0 bg-grid bg-[length:24px_24px]" />
        </div>

        {/* 左侧菜单 */}
        <div className="relative z-20">
          <SidebarNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isDarkMode={isDarkMode}
            onThemeToggle={() => setIsDarkMode(!isDarkMode)}
          />
        </div>

        {/* 右侧内容区域 */}
        <main className="flex-1 relative z-10 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-8 py-8">
            {/* 所有选项卡的通用外观面板 */}
            <div className="glass rounded-2xl p-6 shadow-xl mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">外观设置</h3>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-white/80 transition-colors hover:text-white">
                  <input
                    type="checkbox"
                    checked={blurBackground}
                    onChange={(e) => setBlurBackground(e.target.checked)}
                    className="h-4 w-4 rounded accent-brand-500"
                  />
                  <span>毛玻璃效果</span>
                </label>
                <div className="h-6 w-px bg-white/10" />
                <label className="flex items-center gap-2 text-sm text-white/80">
                  <span>主题色：</span>
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded-lg border border-white/20 bg-transparent transition-transform hover:scale-110"
                    title="选择主题色"
                  />
                </label>
                <div className="h-6 w-px bg-white/10" />
                <button
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition-all hover:border-white/20 hover:bg-white/10"
                  onClick={randomBackground}
                >
                  换背景
                </button>
              </div>
            </div>

            {/* 选项卡内容 */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* 配置预设 */}
                <section className="glass rounded-2xl p-6 shadow-xl">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">快速预设</h3>
                      <p className="text-xs text-white/50">一键应用推荐配置</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {presets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          if (preset.config.source === 'auto') {
                            setAutoSource(true)
                          } else {
                            setAutoSource(false)
                            setSource(preset.config.source)
                          }
                          setThreads(preset.config.threads)
                          setPrimaryLoader(preset.config.loader)
                        }}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition-all hover:border-brand-500/50 hover:bg-brand-500/10"
                      >
                        <p className="font-semibold text-white">{preset.name}</p>
                        <p className="mt-1 text-xs text-white/50">线程: {preset.config.threads} · {preset.config.loader}</p>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="glass group rounded-2xl p-6 shadow-xl transition-all hover:shadow-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">下载源</h3>
                    <p className="text-xs text-white/50">官方 & BMCLAPI</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {downloadSources.map((item) => (
                    <label
                      key={item.key}
                      className={clsx(
                        'flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all',
                        (autoSource && item.key === 'auto') || (!autoSource && source === item.key)
                          ? 'border-brand-500/60 bg-brand-500/10 shadow-md'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10',
                      )}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{item.label}</p>
                        <p className="text-xs text-white/50">{item.speedHint}</p>
                      </div>
                      <input
                        type="radio"
                        name="source"
                        checked={autoSource ? item.key === 'auto' : source === item.key}
                        onChange={() => {
                          if (item.key === 'auto') {
                            setAutoSource(true)
                          } else {
                            setAutoSource(false)
                            setSource(item.key)
                          }
                        }}
                        className="h-4 w-4 accent-brand-500"
                      />
                    </label>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-brand-500/20 bg-brand-500/5 px-4 py-3 text-sm text-white/80">
                  <span className="font-medium text-brand-300">当前：</span> {autoSource ? '自动' : '手动'} · {fastestSource} ({mockSourceSpeeds[fastestSource as Exclude<DownloadSource, 'auto'>] ?? '-'} MB/s)
                </div>
              </div>

              <div className="glass group rounded-2xl p-6 shadow-xl transition-all hover:shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">线程</h3>
                      <p className="text-xs text-white/50">下载并发数</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-white/70">
                    <input
                      type="checkbox"
                      checked={threadAuto}
                      onChange={(e) => setThreadAuto(e.target.checked)}
                      className="h-4 w-4 rounded accent-brand-500"
                    />
                    自动
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={64}
                    value={threads}
                    disabled={threadAuto}
                    onChange={(e) => handleThreadInput(Number(e.target.value))}
                    className="w-full accent-brand-500 disabled:opacity-40"
                  />
                  <input
                    type="number"
                    min={1}
                    max={64}
                    value={threads}
                    disabled={threadAuto}
                    onChange={(e) => handleThreadInput(Number(e.target.value))}
                    className="w-16 rounded-lg border border-white/10 bg-black/30 px-2 py-2 text-center text-sm font-medium text-white transition-colors focus:border-brand-500/50 focus:outline-none disabled:opacity-40"
                  />
                </div>
                <p className="mt-4 text-xs leading-relaxed text-white/50">自动模式根据源与磁盘速度动态调整</p>
              </div>

              <div className="glass group rounded-2xl p-6 shadow-xl transition-all hover:shadow-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">代理</h3>
                    <p className="text-xs text-white/50">网络代理设置</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {proxyOptions.map((item) => (
                    <label
                      key={item.key}
                      className={clsx(
                        'flex cursor-pointer flex-col rounded-xl border px-3 py-2.5 text-sm transition-all',
                        proxyMode === item.key
                          ? 'border-brand-500/60 bg-brand-500/10 text-white shadow-md'
                          : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10',
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{item.label}</span>
                        <input
                          type="radio"
                          name="proxy"
                          checked={proxyMode === item.key}
                          onChange={() => setProxyMode(item.key)}
                          className="h-3.5 w-3.5 accent-brand-500"
                        />
                      </div>
                      <span className="mt-0.5 text-xs text-white/50">{item.desc}</span>
                    </label>
                  ))}
                </div>
                {(proxyMode === 'http' || proxyMode === 'socks') && (
                  <input
                    className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white transition-colors focus:border-brand-500/50 focus:outline-none"
                    value={customProxy}
                    onChange={(e) => setCustomProxy(e.target.value)}
                    placeholder="http://127.0.0.1:7890"
                  />
                )}
              </div>
            </section>

            <section className="glass rounded-2xl p-6 shadow-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Mod 加载器</h3>
                  <p className="text-xs text-white/50">Forge / NeoForge / Fabric / Quilt / OptiFine</p>
                </div>
              </div>
              
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {loaderPrimaries.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => applyLoader(item.key, loaderAddons)}
                        className={clsx(
                          'rounded-xl border px-3 py-3 text-left transition-all',
                          primaryLoader === item.key
                            ? 'border-brand-500/60 bg-brand-500/15 text-white shadow-glow'
                            : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10',
                        )}
                      >
                        <p className="text-sm font-semibold">{item.label}</p>
                        <p className="mt-0.5 text-xs text-white/50">{item.hint ?? '选择此加载器'}</p>
                      </button>
                    ))}
                  </div>
                  {primaryLoader === 'fabric' && (
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-white/80">
                        <input
                          type="checkbox"
                          checked={loaderAddons.includes('fabric-api')}
                          onChange={() => toggleAddon('fabric-api')}
                          className="h-4 w-4 rounded accent-brand-500"
                        />
                        <span>Fabric API</span>
                      </label>
                    </div>
                  )}
                  {primaryLoader === 'quilt' && (
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex flex-wrap gap-3 text-sm text-white/80">
                        {(['quilt-api', 'qsl', 'qfapi'] as LoaderAddon[]).map((addon) => (
                          <label key={addon} className="flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={loaderAddons.includes(addon)}
                              onChange={() => toggleAddon(addon)}
                              className="h-4 w-4 rounded accent-brand-500"
                            />
                            <span>{loaderAddonLabels[addon]}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 px-4 py-3 text-xs text-white/70">
                    <p className="font-medium text-brand-300">提示：</p>
                    <p className="mt-1 leading-relaxed">{loaderNote}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h4 className="mb-2 text-sm font-semibold text-white">兼容性规则</h4>
                  <ul className="space-y-1.5 text-xs leading-relaxed text-white/60">
                    <li className="flex gap-2">
                      <span className="text-brand-400">•</span>
                      <span>OptiFine 与 Fabric / Quilt 互斥，切换时自动清理附加组件</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-brand-400">•</span>
                      <span>Fabric 仅可搭配 Fabric API</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-brand-400">•</span>
                      <span>Quilt 仅可搭配 QSL / QFAPI / Quilt API</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-brand-400">•</span>
                      <span>Forge / NeoForge / 原版禁用所有附加组件</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'instances' && (
          <div className="space-y-6">
            <section className="glass rounded-2xl p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">游戏实例</h3>
                    <p className="text-xs text-white/50">管理多个游戏配置</p>
                  </div>
                </div>
                <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-600">
                  + 新增实例
                </button>
              </div>
              
              <div className="space-y-3">
                {gameInstances.map((instance) => (
                  <div
                    key={instance.id}
                    onClick={() => setSelectedInstance(instance.id)}
                    className={clsx(
                      'cursor-pointer rounded-xl border px-4 py-4 transition-all',
                      selectedInstance === instance.id
                        ? 'border-brand-500/60 bg-brand-500/10 shadow-glow'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{instance.name}</p>
                        <p className="mt-1 text-xs text-white/50">
                          版本: {instance.gameVersion} · 加载器: {instance.loaderPrimary} · 内存: {instance.maxMemory}MB
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 transition-all hover:border-white/20 hover:bg-white/10">
                          编辑
                        </button>
                        <button className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300 transition-all hover:border-red-500/50 hover:bg-red-500/20">
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {selectedInstance && (
              <section className="glass rounded-2xl p-6 shadow-xl">
                <h3 className="mb-4 text-lg font-semibold text-white">实例配置</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-white/70">Java 路径</label>
                    <input
                      type="text"
                      defaultValue={gameInstances.find(i => i.id === selectedInstance)?.javaPath}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white transition-colors focus:border-brand-500/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/70">游戏目录</label>
                    <input
                      type="text"
                      defaultValue={gameInstances.find(i => i.id === selectedInstance)?.gameDir}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white transition-colors focus:border-brand-500/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/70">最大内存 (MB)</label>
                    <input
                      type="number"
                      defaultValue={gameInstances.find(i => i.id === selectedInstance)?.maxMemory}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white transition-colors focus:border-brand-500/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/70">JVM 参数</label>
                    <input
                      type="text"
                      defaultValue={gameInstances.find(i => i.id === selectedInstance)?.jvmArgs.join(' ')}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white transition-colors focus:border-brand-500/50 focus:outline-none"
                      placeholder="-Xmn128M -Dfile.encoding=UTF-8"
                    />
                  </div>
                </div>
                <button className="mt-4 w-full rounded-xl bg-brand-500 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-600">
                  启动游戏
                </button>
              </section>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <section className="glass rounded-2xl p-6 shadow-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">版本历史</h3>
                  <p className="text-xs text-white/50">已安装版本记录</p>
                </div>
              </div>

              {versionHistory.length > 0 ? (
                <div className="space-y-2">
                  {versionHistory.map((history, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{history.versionTitle}</p>
                        <p className="mt-0.5 text-xs text-white/50">
                          {history.contentType} · {(history.size / 1024 / 1024).toFixed(2)} MB · {new Date(history.installedAt).toLocaleString()}
                        </p>
                      </div>
                      <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 transition-all hover:border-white/20 hover:bg-white/10">
                        卸载
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-6 text-center text-white/50">
                  暂无安装历史
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-5">
            {/* 搜索框 */}
            <div className="glass rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 border border-white/10 focus-within:border-brand-500/50">
                <svg className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="搜索模组、资源包、光影和世界..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none"
                />
              </div>
            </div>

            {/* 模组 */}
            <div className="glass rounded-2xl p-6 shadow-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">模组</h3>
                  <p className="text-xs text-white/50">来源：Modrinth + CurseForge</p>
                </div>
                <span className="ml-auto rounded-lg border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs text-brand-300">
                  {getFilteredContent('mods').length} / {contentCatalog.mods.length}
                </span>
              </div>

              {/* 模组源切换菜单 */}
              <div className="mb-4">
                <ContentTypeSourceMenu
                  contentType="mods"
                  sources={downloadSources}
                  currentSource={modsSource}
                  onSourceChange={setModsSource}
                  isExpanded={expandedSourceMenus.mods}
                  onToggle={() => toggleSourceMenu('mods')}
                />
              </div>

              <ul className="space-y-2">{renderVersions('mods')}</ul>
            </div>

            {/* 资源包 */}
            <div className="glass rounded-2xl p-6 shadow-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">资源包</h3>
                  <p className="text-xs text-white/50">来源：Modrinth + CurseForge</p>
                </div>
                <span className="ml-auto rounded-lg border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs text-brand-300">
                  {getFilteredContent('resourcePacks').length} / {contentCatalog.resourcePacks.length}
                </span>
              </div>

              {/* 资源包源切换菜单 */}
              <div className="mb-4">
                <ContentTypeSourceMenu
                  contentType="resourcePacks"
                  sources={downloadSources}
                  currentSource={resourcePacksSource}
                  onSourceChange={setResourcePacksSource}
                  isExpanded={expandedSourceMenus.resourcePacks}
                  onToggle={() => toggleSourceMenu('resourcePacks')}
                />
              </div>

              <ul className="space-y-2">{renderVersions('resourcePacks')}</ul>
            </div>

            {/* 光影 */}
            <div className="glass rounded-2xl p-6 shadow-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">光影</h3>
                  <p className="text-xs text-white/50">来源：Modrinth + CurseForge</p>
                </div>
                <span className="ml-auto rounded-lg border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs text-brand-300">
                  {getFilteredContent('shaders').length} / {contentCatalog.shaders.length}
                </span>
              </div>

              {/* 光影源切换菜单 */}
              <div className="mb-4">
                <ContentTypeSourceMenu
                  contentType="shaders"
                  sources={downloadSources}
                  currentSource={shadersSource}
                  onSourceChange={setShadersSource}
                  isExpanded={expandedSourceMenus.shaders}
                  onToggle={() => toggleSourceMenu('shaders')}
                />
              </div>

              <ul className="space-y-2">{renderVersions('shaders')}</ul>
            </div>

            {/* 世界 */}
            <div className="glass rounded-2xl p-6 shadow-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20 text-green-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">世界</h3>
                  <p className="text-xs text-white/50">来源：Modrinth + CurseForge</p>
                </div>
                <span className="ml-auto rounded-lg border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs text-brand-300">
                  {getFilteredContent('worlds').length} / {contentCatalog.worlds.length}
                </span>
              </div>

              {/* 世界源切换菜单 */}
              <div className="mb-4">
                <ContentTypeSourceMenu
                  contentType="worlds"
                  sources={downloadSources}
                  currentSource={worldsSource}
                  onSourceChange={setWorldsSource}
                  isExpanded={expandedSourceMenus.worlds}
                  onToggle={() => toggleSourceMenu('worlds')}
                />
              </div>

              <ul className="space-y-2">{renderVersions('worlds')}</ul>
            </div>
          </div>
        )}
          </div>
        </main>

        {/* 下载管理器 */}
        <DownloadManager
          downloads={downloads}
          onRemove={removeDownload}
          onRetry={retryDownload}
          onClear={clearDownloads}
        />
      </div>

      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute left-10 top-20 h-40 w-40 rounded-full bg-brand-500/20 blur-[120px]"
          style={{ backgroundColor: `${themeColor}33` }}
        />
        <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-brand-300/10 blur-[150px]" />
      </div>
    </div>
  )
}

export default App
