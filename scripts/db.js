class DB {

  db

  constructor() {
    (async () => {
      this.db = await this.openDB()

      if (this.db)
        await this.remember()
    })()
  }

  openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("assessment")

      request.onupgradeneeded = function (event) {
        let db = event.target.result

        let store = db.createObjectStore("admin", {keyPath: "isbn"})

        store.put({name: "admin", password: "admin", remember: true, isbn: uuidv4()})

        store = db.createObjectStore("members", {keyPath: "isbn"})

        store.createIndex("name", "name", {unique: false})
      }

      request.onsuccess = function (event) {
        /*console.log(request.result) // or
        console.log(event.target.result);*/
        resolve(event.target.result)
      }
    })
  }

  loginCredentials() {
    return new Promise((resolve, reject) => {

      let store = this.db.transaction("admin").objectStore("admin")

      store.openCursor().onsuccess = (event) => {
        let cursor = event.target.result

        if (cursor)
          resolve({
            name: cursor.value.name,
            password: cursor.value.password,
            remember: cursor.value.remember
          })
      }
    });
  }

  async remember(isbn) {
    let loginCredentials = await this.loginCredentials()

    if (loginCredentials.hasOwnProperty("remember")) {
      if (loginCredentials.remember) {
        $("#username").val("admin")
        $("#password").val("admin")
      } else {
        $("#username").val("")
        $("#password").val("")
      }
    }
  }

  init() {
    const request = indexedDB.open("assessment")
    request.onsuccess = (event) => {

      let db = event.target.result

      const tx = db.transaction("members", "readwrite")
      const store = tx.objectStore("members")

      store.put({name: "Karan", age: "22", isbn: uuidv4()})

      tx.oncomplete = function () {
        // All requests have succeeded and the transaction has committed.
        console.log("Done")
      }
    }
  }
}
