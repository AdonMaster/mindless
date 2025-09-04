const {contextBridge, ipcRenderer} = require('electron')

//
contextBridge.exposeInMainWorld('electronApi', {
    ping: ()=> 'pong',
    appClose: () => ipcRenderer.send('appClose')
})