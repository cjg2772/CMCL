export type DownloadSource = 'auto' | 'official' | 'bmclapi'
export type ProxyMode = 'system' | 'none' | 'http' | 'socks'
export type LoaderPrimary = 'forge' | 'neoforge' | 'fabric' | 'quilt' | 'optifine' | 'vanilla'
export type LoaderAddon = 'fabric-api' | 'quilt-api' | 'qsl' | 'qfapi'

export type Compatibility = 'recommended' | 'compatible' | 'incompatible'

export interface ContentVersion {
  id: string
  title: string
  publishedAt: string
  gameVersions: string[]
  compatibility: Compatibility
  loaders: LoaderPrimary[]
}

export interface ContentItem {
  id: string
  name: string
  source: 'modrinth' | 'curseforge'
  versions: ContentVersion[]
}

// 新增：游戏实例配置
export interface GameInstance {
  id: string
  name: string
  gameVersion: string
  loaderPrimary: LoaderPrimary
  loaderAddons: LoaderAddon[]
  javaPath: string
  gameDir: string
  maxMemory: number
  jvmArgs: string[]
  createdAt: string
}

// 新增：版本历史记录
export interface VersionHistory {
  contentType: 'mods' | 'resourcePacks' | 'shaders' | 'worlds'
  versionId: string
  versionTitle: string
  installedAt: string
  size: number
}

// 新增：启动日志
export interface LaunchLog {
  timestamp: string
  level: 'info' | 'warning' | 'error'
  message: string
}

