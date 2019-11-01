const {
  app,
  bw,
  fs,
  path
} = require("./scripts/modules")


let win

let createWindow = () => {

  win = new bw({
    width: 600,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(app.getAppPath(), "scripts/preload.js")
    }
  })

  win.loadURL(`file://${__dirname}/index.html`)

  win.on("ready-to-show", () => {
    win.show()
    win.maximize()
  })

  win.webContents.openDevTools()

  win.on("closed", () => {
    win = null
  })
}

app.on("ready", createWindow)
