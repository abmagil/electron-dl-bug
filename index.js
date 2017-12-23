const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const {download} = require('electron-dl');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('download', (event, arg) => {
  const dirPath = path.join(__dirname, 'test');
  try {
    fs.mkdirSync(dirPath);
  } catch (e) {
    console.log("path already exists");
  }
  
  const opts = {
    saveAs: false,
    directory: dirPath,
    openFolderWhenDone: true
  };

  // Try to download a set of files I know exist
  [
    "https://gist.githubusercontent.com/mbostock/4060606/raw/5bcd32917b5df7183f6737099a4c8590acb0f5fc/.block",
    "https://gist.githubusercontent.com/mbostock/4060606/raw/f00e77314966d06cb56b1a46e776529b647d9552/README.md",
    "https://gist.githubusercontent.com/mbostock/4060606/raw/9841cf6f5ba1e72ae8f9c689e8291ca2e942568a/index.html",
    "https://gist.githubusercontent.com/mbostock/4060606/raw/3f2f45d819ae639f06f971881bd62d53e6dd6c28/thumbnail.png",
    "https://gist.githubusercontent.com/mbostock/4060606/raw/dfc657a8d193fa47c56af0bd5e50606b18d171c9/unemployment.tsv"
  ].forEach((fileUrl) => {
    console.log(fileUrl);
    download(win, fileUrl, opts).then(dl => console.log(dl.getSavePath()))
  })
})

