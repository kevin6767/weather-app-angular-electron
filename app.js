const { app, BrowserWindow, ipcMain } = require("electron");
const url = require("url");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, "preload.js"), // Load preload script
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(
        __dirname,
        `dist/weather-app-angular-electron/browser/index.html`,
      ),
      protocol: "file:",
      slashes: true,
    }),
  );

  // Attach the "closed" event listener inside createWindow()
  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  // IPC handlers for window actions
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
    mainWindow.close();
  });
}

// Ensure window is created after the app is ready
app.on("ready", createWindow);

// Quit app when all windows are closed, except on macOS
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// Recreate a window when the app is activated (macOS)
app.on("activate", function () {
  if (mainWindow === null) createWindow();
});
