import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import https from 'node:https'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isDev = !app.isPackaged

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1400,
    minHeight: 900,
    maxWidth: 1400,
    maxHeight: 900,
    title: 'CIME Minecraft Launcher',
    backgroundColor: '#0a0e27',
    vibrancy: 'appearance-based',
    visualEffectState: 'active',
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
  
  // 隐藏菜单栏
  mainWindow.setMenu(null)

  const rendererUrl = isDev
    ? 'http://localhost:5173'
    : path.join(__dirname, '../dist/index.html')

  if (isDev) {
    mainWindow.loadURL(rendererUrl)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(rendererUrl)
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // 窗口状态变化监听
  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('window:state-changed', true)
  })
  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('window:state-changed', false)
  })
}

// 窗口控制 IPC handlers
ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize()
})

ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

ipcMain.handle('window:close', () => {
  mainWindow?.close()
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('cmcl:get-env', () => ({ isDev }))

// 文件下载功能
ipcMain.handle('cmcl:download-file', async (_event, url: string, filePath: string) => {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(filePath)
    let downloadedBytes = 0
    let totalBytes = 0
    const startTime = Date.now()

    https.get(url, (response) => {
      totalBytes = parseInt(response.headers['content-length'] || '0', 10)

      response.on('data', (chunk) => {
        downloadedBytes += chunk.length
        file.write(chunk)

        // 计算进度和速度
        const percent = totalBytes > 0 ? (downloadedBytes / totalBytes) * 100 : 0
        const elapsedTime = (Date.now() - startTime) / 1000
        const speed = downloadedBytes / elapsedTime / (1024 * 1024)

        // 发送进度更新
        mainWindow?.webContents.send('download:progress', {
          percent,
          speed: `${speed.toFixed(2)} MB/s`,
        })
      })

      response.on('end', () => {
        file.end()
        resolve({ success: true })
      })
    }).on('error', (err) => {
      file.close()
      fs.unlink(filePath, () => {}) // 删除失败的文件
      resolve({ success: false, error: err.message })
    })
  })
})
