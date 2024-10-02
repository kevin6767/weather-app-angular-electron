const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel, data) => {
      const validChannels = [
        "minimize-window",
        "maximize-window",
        "close-window",
        "open-oauth-window",
      ];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    on: (channel, func) => {
      const validChannels = ["oauth-token"];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    dbQuery: (query) => ipcRenderer.invoke("db-query", query),
    dbUpdate: (query, params) => ipcRenderer.invoke("db-update", query, params),
  },
});
