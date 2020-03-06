const { ipcRenderer } = require("electron");

class Storage {
  save({ key, data }) {
    ipcRenderer.send("storage", {
      type: "save",
      data: { key, data }
    });
  }

  remove({ key }) {
    ipcRenderer.send("storage", {
      type: "remove",
      data: { key }
    });
  }

  load({ key }) {
    return new Promise(resolve => {
      ipcRenderer.send("storage", {
        type: "load",
        data: { key }
      });
      ipcRenderer.on("storage-load", (__, data) => {
        resolve(data);
      });
    });
  }
}

const storage = new Storage();
export { storage };
