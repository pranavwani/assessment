const { app, BrowserWindow } = require("electron")
const fs = require("fs")
const homePath = app.getPath("home")

module.exports = {
  app: app,
  bw: BrowserWindow,
  homePath: homePath,
  checkPath: fs.existsSync(homePath + "/assesment"),
  fs: fs,
  path: require("path")
}
