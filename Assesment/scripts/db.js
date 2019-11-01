const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")

class DB {

  homePath;

  constructor (homePath) {
    this.homePath = homePath
  }

  init () {
    return low(new FileSync(this.homePath + "/assesment/db.json"))
  }
}

module.exports = DB
