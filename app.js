const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const url = require("url");
const path = require("path");

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("electron-fiddle", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  } else {
    app.setAsDefaultProtocolClient("electron-fiddle");
  }
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, "preload.js"),
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
    {
      userAgent: "Chrome",
    },
  );

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
  mainWindow.webContents.openDevTools();
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
    if (mainWindow) {
      mainWindow.close();
    }
  });
}

// Function to open OAuth window and handle OAuth flow
function openOAuthWindow() {
  const oauthWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const googleOAuthURL = `https://accounts.google.com/o/oauth2/auth?client_id=${"344825187718-s0890gj7402cgmmoar7qfrkda8niur5n.apps.googleusercontent.com"}&redirect_uri=http://localhost:4200/oauth/callback&response_type=token&scope=email profile openid&state=STATE_PARAMETER&prompt=consent`;

  oauthWindow.loadURL(googleOAuthURL);

  oauthWindow.webContents.on("will-redirect", (event, url) => {
    if (url.includes("access_token")) {
      event.preventDefault();
      const accessToken = new URLSearchParams(url.split("#")[1]).get(
        "access_token",
      );
      console.log("Access Token:", accessToken);

      // Send token back to renderer process (Angular)
      mainWindow.webContents.send("oauth-token", accessToken);
      oauthWindow.close();
    }
  });

  oauthWindow.on("closed", () => {
    console.log("OAuth window closed");
  });
}

// Listen for the request to open the OAuth window
ipcMain.on("open-oauth-window", () => {
  openOAuthWindow();
});

app.on("ready", () => {
  createWindow(); // Create the main browser window
});

// Quit app when all windows are closed, except on macOS
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// Recreate a window when the app is activated (macOS)
app.on("activate", function () {
  if (mainWindow === null) createWindow();
});

// Ensure single instance of the application
const gotTheLockFile = app.requestSingleInstanceLock();

if (!gotTheLockFile) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

app.on("open-url", (event, url) => {
  dialog.showErrorBox(
    "Welcome Back",
    `You arrived from the command line: ${url}`,
  );
});
