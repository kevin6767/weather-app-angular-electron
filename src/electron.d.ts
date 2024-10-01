declare global {
  interface Window {
    process: any;
    electron: {
      send: any;
      on: any;
      ipcRenderer: {
        send(channel: string, data?: any): void;
        on(channel: string, func: (...args: any[]) => void): void;
      };
    };
  }
}

export {};
