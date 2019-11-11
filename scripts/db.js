class DB {

  db

  constructor() {
    (async () => {
      this.db = await this.openDB()

      if (this.db)
        await this.remember()

      this.fetchMembers()
      this.fetchSk()
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

        store = db.createObjectStore("skn", {keyPath: "isbn"})

        store = db.createObjectStore("present", {keyPath: "date"})
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

    let {name, age, dob, designation, address, mn, hobbies, status, skn} = details

    designation = designation === "member" ? "members" : "skn"

    return new Promise((resolve, reject) => {
      const request = indexedDB.open("assessment")
      request.onsuccess = (event) => {

        let db = event.target.result

        const tx = db.transaction(designation, "readwrite")
        const store = tx.objectStore(designation)

        let isbn = uuidv4()

        store.put({
          isbn,
          name,
          age,
          dob,
          designation,
          address,
          mn,
          hobbies,
          status,
          skn
        })

        tx.oncomplete = function () {

          let preId = Number($("table tr:last").find("td:first").html());

          if (Number.isNaN(preId))
            preId = 0

          if (designation !== "skn")
            $("table").append(`
                  <tr>
                    <td>${preId + 1}</td>
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
                    <td><input type="checkbox" class="present" id=${isbn}></td>
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
                    <td><input type="checkbox" class="present" id=${cursor.value.isbn}></td>
                </tr>`)
        cursor.continue()
      }
    }
  }

  fetchSk() {

    let sknLength = $("#skn").children.length

    if (sknLength > 0) {
      for (let i = 0; i < sknLength; i++)
        $("#skn").children(i).remove()
    }

    let store = this.db.transaction("skn").objectStore("skn")

    store.openCursor().onsuccess = (event) => {

      let cursor = event.target.result

      if (cursor) {
        $("#skn").append(`<option value="${cursor.value.name}">`)
        cursor.continue()
      }
    }
  }

  present(date, isbn, checked) {
    console.log(date, isbn, checked)
    let store = this.db.transaction("present", "readwrite").objectStore("present")

    let request;

    try {
      request = store.get(date)

      request.onerror = (event) => {
        console.log(event.target)
      }

      request.onsuccess = (event) => {
        let data = event.target.result

        if (typeof data === "undefined")
          store.put({date, members: {[isbn]: checked ? 1 : 0}})
        else {
          data.members[isbn] = checked ? 1 : 0

          let requestUpdate = store.put(data)

          requestUpdate.onerror = (event) => {
          }

          requestUpdate.onsuccess = (event) => {
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  fetchPresent() {
    let store = this.db.transaction("present").objectStore("present")

    let today_date = $("#today-date span").text().replace(/\s/g, "").trim()

    let request = store.get(today_date)

    request.onsuccess = (event) => {

      let data = event.target.result

      console.log(data)

      for (let member in data["members"])
        $(`#table #${member}`).prop("checked", data["members"][member])
    }
  }
}
