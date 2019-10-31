const db = new DB()

db.init()

let usrnm, passwd

$(document).ready(() => {

  /*if (loginCredentials.remember) {
    $("#username").val(loginCredentials.username)
    $("#password").val(loginCredentials.password)
  }*/

  $("#loginBtn").on("click", async (e) => {

    let loginCredentials = await db.loginCredentials()

    usrnm = $("#username").val()
    passwd = $("#password").val()

    if (usrnm.length < 1 || passwd.length < 1) {
      $("#warn").show()
      $("#warn").text("Please enter Username and Password")
    } else $("#warn").hide()

    if (loginCredentials.name === usrnm) {
      $("#warn").hide()

      if (loginCredentials.password === passwd) {
        $("#msg").show()
        $("#msg").text("Login Successfully.")
      } else {
        $('#warn').show()
        $("#warn").text("Password is wrong!")
      }
    } else {
      $('#warn').show()
      $("#warn").text("Username is wrong!")
    }
  })
})
