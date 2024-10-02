const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, "../preload.js"),
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(
        __dirname,
        `../../../dist/weather-app-angular-electron/browser/index.html`,
      ),
      protocol: "file:",
      slashes: true,
    }),
    {
      userAgent: "Chrome",
    },
  );

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.openDevTools();
  setupIpcHandlers();
};

const setupIpcHandlers = () => {
  ipcMain.on("minimize-window", () => {
    mainWindow.minimize();
  });

  ipcMain.on("maximize-window", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on("close-window", () => {
    if (mainWindow) {
      mainWindow.close();
    }
  });
};

const getMainWindow = () => {
  return mainWindow;
};

module.exports = { createWindow, getMainWindow };
