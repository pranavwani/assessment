$(document).ready(function () {

  // Create DB class instance
  const db = new DB()

  let username, password

  setTimeout(() => {
    db.fetchMembers()
  }, 1000)

  // Want to remember username and password
  $("#remember").change(async function () {

    let loginCredentials = await db.loginCredentials()

    if (!$(this).is(":checked"))
      await db.remember(loginCredentials.isbn, false)
  })

  // On click login button
  $("#login-button").on("click", async function (e) {

    let loginCredentials = await db.loginCredentials()

    username = $("#username").val()
    password = $("#password").val()

    // Validate username and password
    if (username.length < 1 || password.length < 1) {
      $(".login-warning-message").css("display", "table")
      $(".login-warning-message p").text("Please enter Username and Password")
    } else $(".login-warning-message").hide()

    // Check credentials
    if (loginCredentials.name === username) {
      $(".login-warning-message").hide()

      if (loginCredentials.password === password) {
        $(".login-success-message").fadeIn(200).css("display", "table")
        $(".login-success-message p").text("Login Successfully.")

        if (!loginCredentials.remember) {
          let remember = confirm("Want to remember username and password?")

          await db.remember(loginCredentials.isbn, remember)
        }

        // Remove login-modal on login successfully
        $(".login-modal").hide()
        $(".assessment-modal").show()
      } else {
        $(".login-warning-message").fadeIn(200).css("display", "table")
        $(".login-warning-message p").text("Password is wrong!")
      }
    } else {
      $(".login-warning-message").fadeIn(200).css("display", "table")
      $(".login-warning-message p").text("Username is wrong!")
    }
  })

  // Set active class to current menu item
  $("ul li a").on("click", function () {
    $("ul li a").removeClass("active")
    $(this).addClass("active");
  })

  // Show modal on menu item click
  $("#view-record").on("click", () => {
    $(".assessment-form").hide()
    $(".assessment-table").show()
  })

  $("#add-record").on("click", () => {
    $(".assessment-table").hide()
    $(".assessment-form").css("display", "table")
  })

  $("#submit-button").on("click", async () => {
    let record = {
      name: $(".add-name input").val(),
      age: $(".add-age input").val(),
      dob: $(".add-dob input").val(),
      address: {
        bno: $("#block-number").val(),
        street: $("#street").val(),
        landmark: $("#landmark").val(),
        city: $("#city").val(),
        pincode: $("#pincode").val()
      },
      mn: $(".add-mobile-number input").val(),
      hobbies: $(".add-hobbies input").val(),
      status: $(".add-status input").val(),
      skn: $(".add-karyakar-name input").val(),
    }

    let res = await db.addMember(record)

    if (res) {
      alert("Member Inserted Successfully.")
    }
  })
})
