class Project {

  checkPath;
  homePath;
  fs;
  app;

  constructor(app, fs, homePath, checkPath, db) {
    this.app = app
    this.fs = fs
    this.homePath = homePath
    this.checkPath = checkPath
    this.db = db
  }

  loadProject() {
    return new Promise((resolve, reject) => {

      if (!this.checkPath) {
        this.fs.mkdir(this.homePath + "/assesment", err => {
          if (!err) {
            this.fs.writeFileSync(this.homePath + "/assesment/db.json", "{}")
            this.db = this.db.init()
            this.db.defaults({admin: { username: "admin", password: "admin", remember: true}}).write()
            resolve("Project Created Successfully.")
          }
        })
      } else resolve("Project already exist.")
    })
  }
}

module.exports = Project
