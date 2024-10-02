const { app, dialog } = require("electron");
const { createWindow, getMainWindow } = require("./electron/windowManager");
const {
  setupDatabase,
  setupDbIpcHandlers,
  closeDatabase,
} = require("./electron/database");
const { setupOAuthIpcHandlers } = require("./electron/oauthManager");

const gotTheLockFile = app.requestSingleInstanceLock();

if (!gotTheLockFile) {
  app.quit();
} else {
  app.on("second-instance", () => {
    const mainWindow = getMainWindow();
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

app.on("ready", async () => {
  await setupDatabase();
  setupDbIpcHandlers();

  createWindow(); // Create the main window
  const mainWindow = getMainWindow();
  setupOAuthIpcHandlers(mainWindow);
});

app.on("window-all-closed", function () {
  closeDatabase();
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (getMainWindow() === null) createWindow();
});

app.on("open-url", (event, url) => {
  dialog.showErrorBox(
    "Welcome Back",
    `You arrived from the command line: ${url}`,
  );
});
