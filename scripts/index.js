$(document).ready(function () {

  window.skn = [];

  // Create DB class instance
  const db = new DB()

  let username, password

   /* setTimeout(() => {
      db.fetchMembers()
      db.fetchSk()
    })*/

  setTimeout(() => {
    db.fetchPresent()
  }, 2000)

  // Want to remember username and password
  $("#remember").change(async function () {

    let loginCredentials = await db.loginCredentials()

    if (!$(this).is(":checked"))
      await db.remember(loginCredentials.isbn, false)
  })

  let d = new Date()

  let date = d.getDate()

  let month = d.getMonth() + 1

  let year = d.getFullYear()

  $("#current-date").val(`${year}-${String(month).length > 1 ? month : '0' + month}-${String(date).length > 1 ? date : '0' + date}`)

  $("#current-date").on("change", function () {
    db.fetchPresent()
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

  $("#designation").on("click", function () {
    if (this.value === "skn")
      $(".add-karyakar-name").hide()
    else if (this.value === "member")
      $(".add-karyakar-name").show()
  })

  $("#submit-button").on("click", async () => {
    let record = {
      name: $(".add-name input").val(),
      age: $(".add-age input").val(),
      dob: $(".add-dob input").val(),
      designation: $("#designation").val(),
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

    console.log(record)

    let res = await db.addMember(record)

    if (res) {
      if(record.designation === "skn")
        db.fetchSk()
      alert("Member Inserted Successfully.")
    }
  })

  $(document).on("change", ".present", function() {
    let today_date = $("#current-date").val().replace(/\s/g, "").trim();

    db.present(today_date, $(this).prop("id"), $(this).prop("checked"))
  });
})

let searchUser = () => {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("search-user");
  filter = input.value.toUpperCase();
  table = document.getElementById("table");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
