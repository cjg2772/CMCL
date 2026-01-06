import clsx from 'clsx'
import { DownloadSource } from '../types'

interface ContentTypeSourceMenuProps {
  contentType: 'mods' | 'resourcePacks' | 'shaders' | 'worlds'
  sources: { key: DownloadSource; label: string; speedHint: string }[]
  currentSource: DownloadSource
  onSourceChange: (source: DownloadSource) => void
  isExpanded: boolean
  onToggle: () => void
}

export function ContentTypeSourceMenu({
  contentType,
  sources,
  currentSource,
  onSourceChange,
  isExpanded,
  onToggle,
}: ContentTypeSourceMenuProps) {
  const contentLabels = {
    mods: '模组',
    resourcePacks: '资源包',
    shaders: '光影',
    worlds: '世界',
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <button
        onClick={onToggle}
        className={clsx(
          'w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all',
          isExpanded ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white/90'
        )}
      >
        <span>{contentLabels[contentType]} 下载源</span>
        <svg
          className={clsx(
            'w-4 h-4 transition-transform',
            isExpanded && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7m0 0L5 14m7-7v12" />
        </svg>
      </button>

      {isExpanded && (
        <div className="border-t border-white/10 px-4 py-2 space-y-2 bg-black/20">
          {sources.map((source) => (
            <label
              key={source.key}
              className={clsx(
                'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-all',
                currentSource === source.key
                  ? 'border border-blue-500/50 bg-blue-500/10'
                  : 'border border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              )}
            >
              <input
                type="radio"
                name={`source-${contentType}`}
                checked={currentSource === source.key}
                onChange={() => onSourceChange(source.key)}
                className="h-4 w-4 accent-blue-500"
              />
              <div className="flex-1 text-xs">
                <p className="font-medium text-white">{source.label}</p>
                <p className="text-white/50">{source.speedHint}</p>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
