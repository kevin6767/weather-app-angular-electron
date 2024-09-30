const { contextBridge, ipcRenderer } = require("electron");

// Exposing ipcRenderer to the renderer process
contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    // You can add more methods to expose if needed
  },
});
