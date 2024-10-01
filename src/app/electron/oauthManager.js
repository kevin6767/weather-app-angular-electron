const { BrowserWindow, ipcMain } = require("electron");

function openOAuthWindow(mainWindow) {
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

      mainWindow.webContents.send("oauth-token", accessToken);
      oauthWindow.close();
    }
  });

  oauthWindow.on("closed", () => {
    console.log("OAuth window closed");
  });
}

function setupOAuthIpcHandlers(mainWindow) {
  ipcMain.on("open-oauth-window", () => {
    openOAuthWindow(mainWindow);
  });
}

module.exports = { setupOAuthIpcHandlers };
