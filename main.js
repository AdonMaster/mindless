import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import { fileURLToPath } from 'url'

//
const isDev = !app.isPackaged

//
function buildWindow() {

    //
    ipcMain.on('appClose', e => {
        BrowserWindow.fromWebContents(e.sender).close()
    })

    //
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Mindless',
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(currentDir(), 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    })

    //
    if (isDev) {
        win.loadURL('http://localhost:5173')
    } else {
        win.loadFile(path.join(currentDir(), 'dist/index.html'))
    }
}

//
app.whenReady().then(() => {
    buildWindow()
})

// closing gracefully
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})



// ->>>>>>>>>>>>>> utils <<<<<<<<<<<<<<<<-
function currentFilename() {
    return fileURLToPath(import.meta.url)
}
function currentDir() {
    return path.dirname(currentFilename())
}
