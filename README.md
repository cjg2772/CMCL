# CIME Minecraft Launcher (CMCL)

Electron + Vite + React + TypeScript + Tailwind 版本的 Windows 启动器原型。

特性概览
- 扁平化 / 毛玻璃界面，支持自定义主题色与高清背景图（默认从网络预设图集中抓取）。
- 深色/浅色主题切换（太阳/月亮图标），支持界面亮度调节。
- 下载源：官方源 / BMCLAPI，可自动测速选择最快；线程数支持自动/手动滑块与数值同步。
- 代理：系统代理 / 直连 / HTTP / SOCKS（可填自定义地址）。
- 加载器：Forge、NeoForge、Fabric（含 Fabric API）、Quilt（QSL/QFAPI/Quilt API）、OptiFine，互斥关系内置。
- 游戏实例管理：支持多个游戏实例配置，包括 Java 路径、内存分配、JVM 参数等。
- 版本历史追踪：记录已安装的内容版本与更新时间。
- 快速配置预设：内置极速、稳定、官方推荐等预设配置，一键应用。
- 内容下载视图：模组、资源包、光影、世界（Modrinth + CurseForge），按发布时间排序，兼容/推荐/不兼容分组展示。
- **内容搜索**：支持在模组、资源包、光影、世界中按标题和描述搜索，实时过滤结果。

## 运行与构建

前置：建议使用 Node 20.19+ 或 22+，需能访问 Electron 下载源（可设置 `ELECTRON_MIRROR` 或 npm 代理）。

先安装依赖（一次）：

```bash
npm install
```

### 本地构建代理配置

如本地网络需代理访问 GitHub/Electron 下载源，在构建前设置环境变量（PowerShell）：

```powershell
# 设置 HTTP/HTTPS 代理（根据实际端口调整）
$env:HTTP_PROXY="http://127.0.0.1:10809"
$env:HTTPS_PROXY="http://127.0.0.1:10809"

# 或使用系统代理
# netsh winhttp set proxy 127.0.0.1:10809
```

配置后运行构建/打包命令即可。

### 开发与构建命令

## CI / GitHub Actions
- 工作流：`.github/workflows/release.yml`
- 触发：
  - 推送至 `main`/`master` 分支（自动运行 lint/build/打包）
  - Pull Request 到 `main`/`master`
  - 手动触发（workflow_dispatch）
  - 推送 `v*` 标签
- 产物：
	- 安装包：`CMCL-Setup-<version>.exe`
	- 便携版 exe：`*portable*.exe`
	- 绿色压缩包：`CMCL-portable.zip`（压缩自 `release/win-unpacked`）

### 开发与构建命令

本地开发（启动 Vite + Electron + tsup 热编译）：

```bash
npm run dev
```

生产构建（渲染进程 + 主进程）：

```bash
npm run build
```

打包 Windows 安装器和便携版（需先完成 `npm run build`）：

```powershell
# 确保代理已配置（若需要）
$env:HTTP_PROXY="http://127.0.0.1:10809"
$env:HTTPS_PROXY="http://127.0.0.1:10809"

# 打包 NSIS 安装包 + 便携版
npx electron-builder --win nsis portable --publish never
```

产物输出到 `release/` 目录：
- `CMCL-Setup-*.exe` - NSIS 安装包
- `*portable*.exe` - 便携版 exe
- `win-unpacked/` - 未压缩的绿色版（可手动压缩为 zip）

## 目录速览
- `src/` 渲染进程 React 代码与 Tailwind 样式。
- `electron/` 主进程与 preload，使用 tsup 输出到 `dist-electron/`。
- `vite.config.ts` 前端构建配置，`tsup.config.ts` 主进程打包配置。

## 下一步可拓展
- 将下载逻辑接入官方与 BMCLAPI 实际 API，增加测速与自动切源。
- 持久化配置（主题、代理、线程、加载器选择）。
- 集成 Modrinth / CurseForge API 列表与下载器队列、进度展示。
- 补充单元测试与端到端测试。
