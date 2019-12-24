const { app, BrowserWindow, ipcMain, Tray, nativeImage } = require("electron");
const path = require("path");

const mode = process.env.NODE_ENV;
let mainWindow = undefined;
let tray = undefined;

class ElectronApp {
  constructor() {
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
  };

  setupMenubar = () => {
    let icon = nativeImage.createFromDataURL(base64Icon);
    tray = new Tray(icon);
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
      width: 375,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      },
      icon: "icon.png",
      resizable: false,
      show: false,
      frame: false,
      movable: false,
      transparent: true
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
    this.showWindow();
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
    mainWindow.focus();
  };

  toggleWindow = () => {
    if (mainWindow.isVisible()) {
      mainWindow.emit("animateHidden");
    } else {
      this.showWindow();
    }
  };
}

new ElectronApp();

// Tray Icon as Base64 so tutorial has less overhead
let base64Icon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw
7AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkZCg87wZW7ewA
AAp1JREFUOMuV1U2IVlUcx/HPnbc0MWwEF40hRWRQmWhEUi4KorlTQ0zQKgqSxKinRYuWrdq0iIp8DAy
CFmYUUVTYY0Qw0SsYVDQRlFlQU4o4VDMUY9NzWtz/45znzo3yv7n/l3O+53fOPS+F/7R9G0l34Vlap/x
PG+gPby76471jpJdxI4p/x5QrakPVZ3yI4lLSLH4LpetIT5N24AWKpZXAW4boXogFnGxQXEzhdQYHl0v
pbtJkBIOkBqXpVhzAWIPi8hocxCyH5qp0e10oHY6BNy3P7szULyc9hzkGTjat8WPRqctkD3QORrJ211J
srPV7CKP4i7S6CXxF+GtY2lG5D5yg+D6bckHaRXs463dV+OtJVzeBj4Q/inuy2uf4NYPvyVR38Vn4GzD
ZAC5ezHbITsqtEU8HvGcjpFblDncpDma16yhvqit+c3mLuQj3Vm7rJ4r3kW+z+6sD80aKQWcivwm318B
pHk9mA11PuSXil/B1thyrSA9HMI8nMtYNlDszcKdbHVcLkduCO0L1VxTv1VTv5plR3lrCuzga+c2YqB2
QNEfqjV7EWl8c8X78kKleTTfWeuA49maDjlNuz8CHFykOYDEabKvg0Jqh+AB/Z4D7qs+h03gbxyK/FVf
WL6FfsC/8tdGoZ0/hRKZ6A+2pUP1jdZecse01cGcBr2YNzqdcG6q/oDgS+7e3XLeF6j/wTvzM6Lfi2nQ
KP8e0P6Ezn9X2488MvLnW75vwP2wCr8J5eD4upsxaHZzOwNNZcU2c3FfwWg1cDuISfIxH6fzedE8G90s
8nuXH8B0eoXNc/6tQjsQfXaQz0/BEXUD3W4oF0hQPflTlJwZIl+FcOp86e2vvoj1Le6I/P974ZA2dBXk
97qQ13Z8+3PS0+AdjKa1R95YOZgAAAABJRU5ErkJggg==`;
