import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';

const package_json = require('../package.json');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow;

function createWindow() {
    const displaySize = screen.getPrimaryDisplay().size;

    mainWindow = new BrowserWindow({
        width: displaySize.width * 0.7,
        height: displaySize.height * 0.7,
        frame: true,
        resizable: true,
        transparent: false,
        center: true,
        minWidth: 800,
        minHeight: 600,
        fullscreenable: true,
        title: package_json.name,
        icon: path.resolve(__dirname, '../asset/img/logo/logo_64.png')
    });

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.resolve(__dirname, '../asset/html/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null as any;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.