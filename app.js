const {
  app,
  bw
} = require("./scripts/modules")


let win

let createWindow = () => {

  win = new bw({
    width: 600,
    height: 600,
    show: false
  })

  win.loadURL(`file://${__dirname}/index.html`)

  win.on("ready-to-show", () => {
    win.show()
    win.maximize()
  })

  // win.webContents.openDevTools()

  win.on("closed", () => {
    win = null
  })
}

app.on("ready", createWindow)
