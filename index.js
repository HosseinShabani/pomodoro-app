const { app, BrowserWindow } = require("electron");
const path = require("path");

const mode = process.env.NODE_ENV;
let mainWindow;

function reloadOnChange(win) {
  if (mode !== "development") return { close: () => {} };

  const watcher = require("chokidar").watch(path.join(__dirname, "**"), {
    ignoreInitial: true
  });

  watcher.on("change", () => {
    win.reload();
  });

  return watcher;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    icon: "icon.png"
  });

  mainWindow.loadFile("public/index.html");

  const watcher = reloadOnChange(mainWindow);

  mainWindow.on("closed", function() {
    mainWindow = null;
    watcher.close();
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) createWindow();
});
