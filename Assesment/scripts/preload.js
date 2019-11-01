const { app } = require("electron").remote
const fs = require("fs")
const homePath = app.getPath("home")
const DB = require("./db")
let db = new DB(homePath)

if (!fs.existsSync(homePath + "/assesment")) {
  fs.mkdir(homePath + "/assesment", err => {
    if (!err) {
      fs.writeFileSync(homePath + "/assesment/db.json", "{}")
      db = db.init()
      db.defaults({admin: { username: "admin", password: "admin", remember: true}}).write()
      window.DB = db
      console.log("Project Created Successfully.")
    }
  })
} else {
  window.DB = db.init()
  console.log("Project already exist.")
}

window.homePath = app.getPath("home")
