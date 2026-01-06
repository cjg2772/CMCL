import { useState } from 'react'
import clsx from 'clsx'

export interface Download {
  id: string
  name: string
  contentType: 'mods' | 'resourcePacks' | 'shaders' | 'worlds'
  progress: number // 0-100
  status: 'pending' | 'downloading' | 'completed' | 'failed'
  size: string
  speed: string
  error?: string
}

interface DownloadManagerProps {
  downloads: Download[]
  onRemove: (id: string) => void
  onRetry: (id: string) => void
  onClear: () => void
}

export function DownloadManager({
  downloads,
  onRemove,
  onRetry,
  onClear,
}: DownloadManagerProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const activeCount = downloads.filter((d) => d.status === 'downloading' || d.status === 'pending').length
  const completedCount = downloads.filter((d) => d.status === 'completed').length

  if (downloads.length === 0) {
    return null
  }

  const contentIcons = {
    mods: '📦',
    resourcePacks: '🎨',
    shaders: '✨',
    worlds: '🌍',
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      {/* 头部 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500/20 to-blue-600/10 border-b border-white/10 hover:bg-blue-500/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">下载队列</p>
            <p className="text-xs text-white/60">
              {activeCount > 0 ? `${activeCount} 个进行中` : `${completedCount} 已完成`}
            </p>
          </div>
        </div>
        <svg
          className={clsx(
            'w-5 h-5 text-white/70 transition-transform',
            isExpanded && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7m0 0L5 14m7-7v12" />
        </svg>
      </button>

      {/* 下载列表 */}
      {isExpanded && (
        <div className="max-h-96 overflow-y-auto px-4 py-4 space-y-3">
          {downloads.map((download) => (
            <div
              key={download.id}
              className={clsx(
                'rounded-lg border p-3 transition-all',
                download.status === 'completed'
                  ? 'border-green-500/30 bg-green-500/10'
                  : download.status === 'failed'
                    ? 'border-red-500/30 bg-red-500/10'
                    : 'border-blue-500/30 bg-blue-500/10'
              )}
            >
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg">{contentIcons[download.contentType]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{download.name}</p>
                  <div className="flex items-center justify-between gap-2 text-xs text-white/60 mt-1">
                    <span>{download.size}</span>
                    {download.status === 'downloading' && <span>{download.speed}</span>}
                    <span className={clsx(
                      'font-medium',
                      download.status === 'downloading' && 'text-blue-300',
                      download.status === 'completed' && 'text-green-300',
                      download.status === 'failed' && 'text-red-300'
                    )}>
                      {download.status === 'pending' && '待处理'}
                      {download.status === 'downloading' && '下载中'}
                      {download.status === 'completed' && '已完成'}
                      {download.status === 'failed' && '失败'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 进度条 */}
              <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden mb-2">
                <div
                  className={clsx(
                    'h-full transition-all rounded-full',
                    download.status === 'completed'
                      ? 'bg-green-500'
                      : download.status === 'failed'
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                  )}
                  style={{ width: `${download.progress}%` }}
                />
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-2">
                {download.status === 'failed' && (
                  <button
                    onClick={() => onRetry(download.id)}
                    className="flex-1 text-xs rounded px-2 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 transition-colors"
                  >
                    重试
                  </button>
                )}
                <button
                  onClick={() => onRemove(download.id)}
                  className="flex-1 text-xs rounded px-2 py-1 bg-white/10 hover:bg-white/20 text-white/70 transition-colors"
                >
                  {download.status === 'downloading' ? '取消' : '移除'}
                </button>
              </div>

              {download.error && (
                <p className="text-xs text-red-300 mt-2">{download.error}</p>
              )}
            </div>
          ))}

          {downloads.length > 0 && (
            <button
              onClick={onClear}
              className="w-full text-xs rounded px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 transition-colors mt-4 border border-white/10"
            >
              清空列表
            </button>
          )}
        </div>
      )}
    </div>
  )
}
