const {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  nativeTheme,
  powerSaveBlocker
} = require("electron");
const path = require("path");
const os = require("os");
const storage = require("electron-json-storage");

const assetsDirectory = path.join(__dirname, "src/assets/media");
const mode = process.env.NODE_ENV;
let mainWindow = undefined;
let tray = undefined;

class ElectronApp {
  constructor() {
    storage.setDataPath(os.tmpdir());
    powerSaveBlocker.start("prevent-app-suspension");
    app.dock.hide();
    app.on("ready", this.initial);
    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });
    app.on("activate", () => {
      if (mainWindow === null) this.createWindow();
    });
  }

  initial = () => {
    this.setupMenubar();
    this.createWindow();

    ipcMain.on("show-window", () => {
      this.showWindow();
    });
    ipcMain.on("setTrayTitle", (__, title) => {
      tray.setTitle(title);
    });
    ipcMain.on("storage", (event, { type, data }) => {
      this.onStorage(type, data, event);
    });
  };

  setupMenubar = () => {
    tray = new Tray(this.getIcon());
    tray.setIgnoreDoubleClickEvents(true);
    tray.on("click", event => {
      this.toggleWindow();
      if (mainWindow.isVisible() && process.defaultApp && event.metaKey) {
        mainWindow.openDevTools({ mode: "detach" });
      }
    });
  };

  createWindow = () => {
    mainWindow = new BrowserWindow({
      width: 400,
      height: 500,
      webPreferences: {
        nodeIntegration: true,
        backgroundThrottling: true
      },
      icon: "icon.png",
      resizable: false,
      fullscreenable: false,
      show: false,
      frame: false,
      movable: false,
      transparent: true,
      alwaysOnTop: true,
      hasShadow: false
    });
    mainWindow.loadFile("public/index.html");
    const watcher = this.reloadOnChange(mainWindow);
    mainWindow.on("blur", () => {
      if (!mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.hide();
      }
    });
    mainWindow.on("closed", () => {
      mainWindow = null;
      watcher.close();
    });
    // mainWindow.openDevTools({ mode: "detach" });
    setTimeout(() => {
      this.showWindow();
    }, 500);
  };

  getIcon = () => {
    if (process.platform === "win32")
      return path.join(assetsDirectory, "trayIcon-light.png");
    if (nativeTheme.shouldUseDarkColors)
      return path.join(assetsDirectory, "trayIcon-light.png");
    return path.join(assetsDirectory, "trayIcon.png");
  };

  reloadOnChange = win => {
    if (mode !== "development") return { close: () => {} };
    const watcher = require("chokidar").watch(path.join(__dirname, "**"), {
      ignoreInitial: true
    });
    watcher.on("change", () => {
      win.destroy();
      this.createWindow();
    });
    return watcher;
  };

  showWindow = () => {
    const trayPos = tray.getBounds();
    const windowPos = mainWindow.getBounds();
    let x,
      y = 0;
    if (process.platform == "darwin") {
      x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
      y = Math.round(trayPos.y + trayPos.height);
    } else {
      x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
      y = Math.round(trayPos.y + trayPos.height * 10);
    }

    mainWindow.setPosition(x, y, false);
    mainWindow.show();
  };

  toggleWindow = () => {
    if (mainWindow.isVisible()) {
      mainWindow.emit("animateHidden");
    } else {
      this.showWindow();
    }
  };

  onStorage = (type, { key, data }, event) => {
    switch (type) {
      case "save":
        storage.set(key, data, () => false);
        break;
      case "remove":
        storage.remove(key);
        break;
      case "load":
        storage.get(key, (error, data) => {
          if (error) return;
          else event.reply("storage-load", data);
        });
        break;
      default:
        break;
    }
  };
}

new ElectronApp();
