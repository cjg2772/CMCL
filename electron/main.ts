import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isDev = !app.isPackaged

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1100,
    minHeight: 720,
    title: 'CIME Minecraft Launcher',
    backgroundColor: '#0b0f15',
    vibrancy: 'appearance-based',
    visualEffectState: 'active',
    autoHideMenuBar: true,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  const rendererUrl = isDev
    ? 'http://localhost:5173'
    : path.join(__dirname, '../dist/index.html')

  if (isDev) {
    win.loadURL(rendererUrl)
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    win.loadFile(rendererUrl)
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

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
