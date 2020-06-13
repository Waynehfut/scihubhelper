// Modules to control application life and create native browser window
const { app, Menu, BrowserWindow, ipcMain } = require("electron");

const path = require("path");
const join = require("path").join;

const openAboutWindow = require("about-window").default;
const { download } = require("electron-dl");

ipcMain.on("download_request", (event, info) => {
  const win = BrowserWindow.getFocusedWindow();
  info.properties.onStarted = () => {
    win.webContents.send("download_start");
  };
  info.properties.onProgress = (status) =>
    win.webContents.send("download_progress", status);
  download(win, info.url, info.properties).then((dl) =>
    win.webContents.send("download_complete", dl.getSavePath())
  );
});

let template = [
  {
    label: "Edit",
    submenu: [
      // {
      //   label: "设置",
      //   accelerator: "f2",
      //   click: function (item, focusedWindow) {
      //     console.log("todo");
      //   },
      // },
      {
        label: "Reload",
        accelerator: "CmdOrCtrl+R",
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            // 重载之后, 刷新并关闭所有的次要窗体
            if (focusedWindow.id === 1) {
              BrowserWindow.getAllWindows().forEach(function (win) {
                if (win.id > 1) {
                  win.close();
                }
              });
            }
            focusedWindow.reload();
          }
        },
      },
      {
        label: "Toggle Full Screen",
        accelerator: (function () {
          if (process.platform === "darwin") {
            return "Ctrl+Command+F";
          } else {
            return "F11";
          }
        })(),
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        },
      },
      {
        label: "Developer Tools",
        accelerator: (function () {
          if (process.platform === "darwin") {
            return "Alt+Command+I";
          } else {
            return "Ctrl+Shift+I";
          }
        })(),
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        },
      },
    ],
  },
  {
    label: "About",
    accelerator: (function () {
      if (process.platform === "darwin") {
        return "f1";
      } else {
        return "f1";
      }
    })(),
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        openAboutWindow({
          icon_path: join(__dirname, "/images/512x512.png"),
          product_name: "SCI Helper",
          copyright: "(C) Waynehfut.com",
          homepage: "https://blog.waynehfut.com/2020/06/11/scihelper/",
          description: "Help you find the accessible paper",
        });
      }
    },
  },
];

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: __dirname + "/images/24x24.png",
    width: 800,
    height: 480,
    webPreferences: {
      nodeIntegration: true, //enable require
      enableRemoteModule: true,
      // webSecurity: false
      //   preload: path.join(__dirname, '/js/preload.js')
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(__dirname + "/html/index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
