import {BrowserWindow, ipcMain, screen} from "electron";

let captureWin = null

const capture = (e, args) => {
    if (captureWin) {
        return false
    }

    let { width, height } = screen.getPrimaryDisplay().bounds

    captureWin = new BrowserWindow({
        // window 使用 fullscreen,  mac 设置为 undefined, 不可为 false
        fullscreen: process.platform === 'win32' || undefined, // win
        width,
        height,
        x: 0,
        y: 0,
        transparent: true,
        frame: false,
        skipTaskbar: true,
        autoHideMenuBar: true,
        movable: false,
        resizable: false,
        enableLargerThanScreen: true, // mac
        hasShadow: false,
    })

    captureWin.setAlwaysOnTop(true, 'screen-saver') // mac
    captureWin.setVisibleOnAllWorkspaces(true) // mac
    captureWin.setFullScreenable(false) // mac

    captureWin.loadURL('app://./capture.html')

    captureWin.on('closed', () => {
        captureWin = null
    })
}

// 接收截图事件
ipcMain.on('capture', capture)
