const loginCredentials = DB.get("admin").value()

let usrnm, passwd

$(document).ready(() => {

  $("#remember").change(function () {
    if ($(this).is(":checked"))
      DB.set("admin.remember", true).write()
    else
      DB.set("admin.remember", false).write()
  })

  if (loginCredentials.remember) {
    $("#rememberOption").show()
    $("#remember").prop("checked", true)
    $("#username").val(loginCredentials.username)
    $("#password").val(loginCredentials.password)
  }

  $("#loginBtn").on("click", (e) => {

    usrnm = $("#username").val()
    passwd = $("#password").val()

    if (usrnm.length < 1 || passwd.length < 1) {
      $("#warn").show()
      $("#warn").text("Please enter Username and Password")
    } else {
      $("#warn").hide()
      $("#msg").hide()
    }

    if (loginCredentials.username === usrnm) {
      $("#warn").hide()

      if (loginCredentials.password === passwd) {
        $("#msg").show()
        $("#msg").text("Login Successfully.")
        DB.set("admin.remember", true).write()
        $(".login-form").hide()
        $(".dash").show()
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
