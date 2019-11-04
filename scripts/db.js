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
            remember: cursor.value.remember,
            isbn: cursor.value.isbn
          })
      }
    });
  }

  async remember(isbn, checked) {

    let loginCredentials = await this.loginCredentials()

    if (isbn) {
      let store = this.db.transaction("admin", "readwrite").objectStore("admin")

      let request = store.get(isbn);

      request.onerror = (event) => {
      }

      request.onsuccess = (event) => {
        let data = event.target.result

        data.remember = checked

        let requestUpdate = store.put(data)

        requestUpdate.onerror = (event) => {
        }

        requestUpdate.onsuccess = (event) => {
        }
      }
    } else if (loginCredentials.hasOwnProperty("remember")) {
      if (loginCredentials.remember) {
        $("#username").val("admin")
        $("#password").val("admin")
        $("#remember").prop("checked", true)
      } else {
        $("#username").val("")
        $("#password").val("")
      }
    }
  }

  addMember(details) {

    let {name, age, dob, address, mn, hobbies, status, skn} = details

    return new Promise((resolve, reject) => {
      const request = indexedDB.open("assessment")
      request.onsuccess = (event) => {

        let db = event.target.result

        const tx = db.transaction("members", "readwrite")
        const store = tx.objectStore("members")

        let isbn = uuidv4()

        store.put({
          isbn,
          name,
          age,
          dob,
          address,
          mn,
          hobbies,
          status,
          skn
        })

        tx.oncomplete = function () {

          $("table").append(`
                  <tr>
                    <td>${Number($("table tr:last").find("td:first").html()) + 1}</td>
                    <td>${name}</td>
                    <td>${age}</td>
                    <td>${dob}</td>
                    <td>${address.bno}</td>
                    <td>${address.street}</td>
                    <td>${address.landmark}</td>
                    <td>${address.city}</td>
                    <td>${address.pincode}</td>
                    <td>${mn}</td>
                    <td>${hobbies}</td>
                    <td>${status}</td>
                    <td>${skn}</td>
                    <td><input type="checkbox" id=${isbn}></td>
                </tr>`)

          // All requests have succeeded and the transaction has committed.
          resolve(1)
        }
      }
    })
  }

  fetchMembers() {

    let index = 0;

    let store = this.db.transaction("members").objectStore("members")

    store.openCursor().onsuccess = (event) => {

      let cursor = event.target.result

      if (cursor) {
        $("table").append(`
                  <tr>
                    <td>${++index}</td>
                    <td>${cursor.value.name}</td>
                    <td>${cursor.value.age}</td>
                    <td>${cursor.value.dob}</td>
                    <td>${cursor.value.address.bno}</td>
                    <td>${cursor.value.address.street}</td>
                    <td>${cursor.value.address.landmark}</td>
                    <td>${cursor.value.address.city}</td>
                    <td>${cursor.value.address.pincode}</td>
                    <td>${cursor.value.mn}</td>
                    <td>${cursor.value.hobbies}</td>
                    <td>${cursor.value.status}</td>
                    <td>${cursor.value.skn}</td>
                    <td><input type="checkbox" id=${cursor.value.isbn}></td>
                </tr>`)
        cursor.continue()
      }
    }
  }
}
