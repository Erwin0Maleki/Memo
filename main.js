const {app, BrowserWindow} = require('electron')
let mainWindow;
const path = require('path');
function createWindow () {
  mainWindow = new BrowserWindow({width: 1000, height: 600,autoHideMenuBar:true,title:'Memo',icon:path.join(__dirname, 'assets/icons/MemoIco.png')});
  mainWindow.loadURL(`file://${ __dirname}/index.html`)
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)


app.on('window-all-closed', function () {

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

